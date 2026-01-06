// Configuration
const BACKEND_URL = (() => {
    // Check if running in GitHub Codespaces or Gitpod
    if (window.location.hostname.includes('github.dev') || window.location.hostname.includes('gitpod.io')) {
        // Replace port 8000 with 3000 in the URL
        return window.location.origin.replace('-8000.', '-3000.');
    }
    // Local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    }
    // Production (GitHub Pages)
    return 'https://prictionary-backend.onrender.com';
})();

// Socket.IO connection
let socket = null;

// Game State
let gameState = {
    playerName: '',
    playerId: '',
    roomCode: '',
    isHost: false,
    currentDrawer: null,
    currentWord: '',
    wordHint: '',
    category: 'all',
    players: [],
    scores: {},
    round: 1,
    maxRounds: 500,
    timeLeft: 90,
    gameActive: false,
};

// Canvas setup
let canvas, ctx;
let isDrawing = false;
let currentColor = '#013220';  // Default to dark green for dark mode
let currentSize = 5;
let currentTool = 'pen';
let lastPoint = null;

// Drawing throttle
let drawingBuffer = [];
let drawingSendInterval = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    setupEventListeners();
    connectToBackend();
});

/**
 * Connect to backend WebSocket server
 */
function connectToBackend() {
    console.log('Attempting to connect to:', BACKEND_URL);
    socket = io(BACKEND_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
    });
    
    setupSocketListeners();
}

/**
 * Setup Socket.IO event listeners
 */
function setupSocketListeners() {
    socket.on('connect', () => {
        console.log('✅ Connected to server! Socket ID:', socket.id);
        gameState.playerId = socket.id;
        showNotification('Connected to server', 'success');
    });
    
    socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        showNotification('Failed to connect to server', 'error');
    });
    
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        showNotification('Disconnected from server. Reconnecting...', 'error');
    });
    
    socket.on('room-created', (data) => {
        gameState.roomCode = data.roomCode;
        gameState.isHost = true;
        showLobbyScreen();
    });
    
    socket.on('room-joined', (data) => {
        gameState.players = data.players;
        gameState.host = data.host;
        gameState.isHost = (socket.id === data.host);
        updatePlayersList();
        updateScores();
    });
    
    socket.on('room-error', (data) => {
        showNotification(data.message, 'error');
    });
    
    socket.on('player-joined', (data) => {
        gameState.players.push(data.player);
        updatePlayersList();
        showNotification(`${data.player.name} joined the room`, 'info');
    });
    
    socket.on('player-left', (data) => {
        gameState.players = gameState.players.filter(p => p.id !== data.playerId);
        updatePlayersList();
        showNotification(`${data.playerName} left the room`, 'info');
    });
    
    socket.on('game-started', (data) => {
        gameState.gameActive = true;
        gameState.round = data.round;
        gameState.maxRounds = data.maxRounds;
        gameState.currentDrawer = data.drawer.id;
        showGameScreen();
        showNotification(`Game started! Round ${data.round}/${data.maxRounds}`, 'success');
        updateGameInfo();
    });
    
    socket.on('your-word', (data) => {
        gameState.currentWord = data.word;
        updateWordDisplay();
    });
    
    socket.on('word-hint', (data) => {
        gameState.wordHint = data.hint;
        updateWordDisplay();
    });
    
    socket.on('turn-started', (data) => {
        gameState.round = data.round;
        gameState.currentDrawer = data.drawer.id;
        gameState.timeLeft = data.timeLeft;
        clearCanvas();
        updateGameInfo();
        showNotification(`${data.drawer.name}'s turn to draw!`, 'info');
    });
    
    socket.on('drawing-update', (data) => {
        drawRemoteLine(data);
    });
    
    socket.on('drawing-sync', (data) => {
        // Replay drawing data for newly joined players
        data.drawingData.forEach(drawData => {
            drawRemoteLine(drawData);
        });
    });
    
    socket.on('clear-canvas', () => {
        clearCanvas();
    });
    
    socket.on('guess-submitted', (data) => {
        addChatMessage(data.player.name, data.guess, data.correct);
    });
    
    socket.on('correct-guess', (data) => {
        gameState.scores = data.scores;
        updateScores();
        showNotification(`${data.player.name} guessed correctly! +${data.score} points`, 'success');
        addChatMessage('System', `The word was: ${data.word}`, false, 'system');
    });
    
    socket.on('turn-ended', (data) => {
        gameState.scores = data.scores;
        updateScores();
        addChatMessage('System', `Time's up! The word was: ${data.word}`, false, 'system');
    });
    
    socket.on('timer-tick', (data) => {
        gameState.timeLeft = data.timeLeft;
        updateTimer();
    });
    
    socket.on('game-ended', (data) => {
        gameState.gameActive = false;
        showWinnerScreen(data.winner, data.scores);
    });
    
    socket.on('game-error', (data) => {
        showNotification(data.message, 'error');
    });
}

/**
 * Initialize canvas
 */
function initializeCanvas() {
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

/**
 * Resize canvas
 */
function resizeCanvas() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    ctx.putImageData(imageData, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Start screen
    document.getElementById('createRoomBtn').addEventListener('click', createRoom);
    document.getElementById('joinRoomBtn').addEventListener('click', () => showScreen('joinScreen'));
    
    // Join screen
    document.getElementById('joinSubmitBtn').addEventListener('click', joinRoom);
    document.getElementById('joinBackBtn').addEventListener('click', () => showScreen('startScreen'));
    
    // Lobby screen
    document.getElementById('categorySelect').addEventListener('change', (e) => {
        gameState.category = e.target.value;
    });
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    document.getElementById('leaveRoomBtn').addEventListener('click', leaveRoom);
    
    // Drawing tools
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentColor = btn.dataset.color;
            currentTool = 'pen';
        });
    });
    
    document.getElementById('penBtn').addEventListener('click', () => setTool('pen'));
    document.getElementById('eraserBtn').addEventListener('click', () => setTool('eraser'));
    
    document.getElementById('sizeSlider').addEventListener('input', (e) => {
        currentSize = e.target.value;
    });
    
    document.getElementById('clearBtn').addEventListener('click', () => {
        if (isCurrentDrawer()) {
            socket.emit('clear-canvas');
            clearCanvas();
        }
    });
    
    // Chat/guess input
    const guessInput = document.getElementById('guessInput');
    document.getElementById('guessBtn').addEventListener('click', submitGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitGuess();
    });
    
    // Winner screen
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        showLobbyScreen();
    });
    document.getElementById('exitGameBtn').addEventListener('click', () => {
        leaveRoom();
        showScreen('startScreen');
    });
    
    // Start drawing throttle
    drawingSendInterval = setInterval(() => {
        if (drawingBuffer.length > 0 && isCurrentDrawer()) {
            socket.emit('drawing-data', drawingBuffer);
            drawingBuffer = [];
        }
    }, 50);
}

/**
 * Create room
 */
function createRoom() {
    const name = document.getElementById('playerName').value.trim();
    const password = document.getElementById('roomPassword').value;
    
    if (!name) {
        showNotification('Please enter your name', 'error');
        return;
    }
    
    if (!password || password.length < 4) {
        showNotification('Password must be at least 4 characters', 'error');
        return;
    }
    
    if (!socket || !socket.connected) {
        showNotification('Not connected to server. Please refresh the page.', 'error');
        console.error('Socket not connected:', socket);
        return;
    }
    
    gameState.playerName = name;
    gameState.category = 'all';
    
    console.log('Creating room with:', { playerName: name, password: '***', category: gameState.category });
    socket.emit('create-room', {
        playerName: name,
        password: password,
        category: gameState.category,
    });
}

/**
 * Join room
 */
function joinRoom() {
    const name = document.getElementById('joinPlayerName').value.trim();
    const roomCode = document.getElementById('roomCode').value.trim().toUpperCase();
    const password = document.getElementById('joinRoomPassword').value;
    
    if (!name) {
        showNotification('Please enter your name', 'error');
        return;
    }
    
    if (!roomCode || roomCode.length !== 6) {
        showNotification('Room code must be 6 characters', 'error');
        return;
    }
    
    if (!password) {
        showNotification('Please enter room password', 'error');
        return;
    }
    
    gameState.playerName = name;
    gameState.roomCode = roomCode;
    
    socket.emit('join-room', {
        roomCode: roomCode,
        playerName: name,
        password: password,
    });
}

/**
 * Start game
 */
function startGame() {
    if (!gameState.isHost) {
        showNotification('Only the host can start the game', 'error');
        return;
    }
    
    if (gameState.players.length < 2) {
        showNotification('Need at least 2 players to start', 'error');
        return;
    }
    
    socket.emit('start-game');
}

/**
 * Leave room
 */
function leaveRoom() {
    socket.emit('leave-room');
    gameState.roomCode = '';
    gameState.players = [];
    gameState.scores = {};
    gameState.gameActive = false;
}

/**
 * Submit guess
 */
function submitGuess() {
    if (isCurrentDrawer()) return;
    
    const input = document.getElementById('guessInput');
    const guess = input.value.trim();
    
    if (!guess) return;
    
    socket.emit('submit-guess', { guess });
    input.value = '';
}

/**
 * Drawing functions
 */
function startDrawing(e) {
    if (!isCurrentDrawer()) return;
    
    isDrawing = true;
    const point = getMousePos(e);
    lastPoint = point;
}

function draw(e) {
    if (!isDrawing || !isCurrentDrawer()) return;
    
    e.preventDefault();
    
    const point = getMousePos(e);
    
    // Draw locally
    drawLine(lastPoint, point, currentColor, currentSize, currentTool === 'eraser');
    
    // Add to buffer for server
    drawingBuffer.push({
        from: { x: lastPoint.x / canvas.width, y: lastPoint.y / canvas.height },
        to: { x: point.x / canvas.width, y: point.y / canvas.height },
        color: currentColor,
        size: currentSize,
        erase: currentTool === 'eraser',
    });
    
    lastPoint = point;
}

function stopDrawing() {
    isDrawing = false;
    lastPoint = null;
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}

function drawLine(from, to, color, size, erase) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = erase ? '#000000' : color;  // Erase with black for dark mode
    ctx.lineWidth = erase ? size * 2 : size;
    ctx.stroke();
}

function drawRemoteLine(data) {
    const from = {
        x: data.from.x * canvas.width,
        y: data.from.y * canvas.height,
    };
    const to = {
        x: data.to.x * canvas.width,
        y: data.to.y * canvas.height,
    };
    
    drawLine(from, to, data.color, data.size, data.erase);
}

function clearCanvas() {
    ctx.fillStyle = '#000000';  // Black background for dark mode
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawingBuffer = [];
}

function setTool(tool) {
    currentTool = tool;
    
    document.getElementById('penBtn').classList.remove('active');
    document.getElementById('eraserBtn').classList.remove('active');
    
    if (tool === 'pen') {
        document.getElementById('penBtn').classList.add('active');
    } else {
        document.getElementById('eraserBtn').classList.add('active');
    }
}

/**
 * UI Update Functions
 */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showLobbyScreen() {
    showScreen('lobbyScreen');
    document.getElementById('currentRoomCode').textContent = gameState.roomCode;
    document.getElementById('categorySelect').value = gameState.category;
    document.getElementById('startGameBtn').style.display = gameState.isHost ? 'block' : 'none';
    updatePlayersList();
}

function showGameScreen() {
    showScreen('gameScreen');
    clearCanvas();
    updateGameInfo();
    updateWordDisplay();
    updateScores();
    
    // Clear chat
    document.getElementById('chatMessages').innerHTML = '';
}

function showWinnerScreen(winner, scores) {
    showScreen('winnerScreen');
    
    document.getElementById('winnerName').textContent = winner || 'No one';
    
    // Show final scores
    const scoresList = document.getElementById('finalScores');
    scoresList.innerHTML = '';
    
    const sortedPlayers = gameState.players.sort((a, b) => {
        return (scores[b.id] || 0) - (scores[a.id] || 0);
    });
    
    sortedPlayers.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name}: ${scores[player.id] || 0} points`;
        scoresList.appendChild(li);
    });
}

function updatePlayersList() {
    const list = document.getElementById('playersList');
    list.innerHTML = '';
    
    gameState.players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player.name;
        if (player.id === gameState.host) {
            li.textContent += ' (Host)';
            li.style.fontWeight = 'bold';
        }
        list.appendChild(li);
    });
    
    document.getElementById('playersCount').textContent = `${gameState.players.length}/8 players`;
}

function updateScores() {
    const list = document.getElementById('scoresList');
    list.innerHTML = '';
    
    const sortedPlayers = [...gameState.players].sort((a, b) => {
        return (gameState.scores[b.id] || 0) - (gameState.scores[a.id] || 0);
    });
    
    sortedPlayers.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name}: ${gameState.scores[player.id] || 0}`;
        list.appendChild(li);
    });
}

function updateGameInfo() {
    document.getElementById('roundInfo').textContent = `Round ${gameState.round}/${gameState.maxRounds}`;
    
    const drawer = gameState.players.find(p => p.id === gameState.currentDrawer);
    if (drawer) {
        document.getElementById('drawerName').textContent = drawer.name;
    }
    
    // Show/hide drawing tools based on role
    const isDrawer = isCurrentDrawer();
    document.getElementById('drawingTools').style.display = isDrawer ? 'flex' : 'none';
    document.getElementById('guessSection').style.display = isDrawer ? 'none' : 'flex';
}

function updateWordDisplay() {
    const wordDisplay = document.getElementById('wordDisplay');
    
    if (isCurrentDrawer()) {
        wordDisplay.textContent = `Your word: ${gameState.currentWord}`;
        wordDisplay.style.fontSize = '1.5rem';
        wordDisplay.style.fontWeight = 'bold';
    } else {
        wordDisplay.textContent = gameState.wordHint || '_ _ _ _ _';
        wordDisplay.style.fontSize = '1.2rem';
    }
}

function updateTimer() {
    document.getElementById('timer').textContent = `${gameState.timeLeft}s`;
}

function addChatMessage(player, message, isCorrect, type = 'guess') {
    const chatMessages = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `chat-message ${type}`;
    
    if (type === 'system') {
        div.innerHTML = `<strong>${message}</strong>`;
        div.style.color = '#007bff';
    } else if (isCorrect) {
        div.innerHTML = `<strong>${player}</strong> guessed correctly!`;
        div.style.color = '#28a745';
    } else {
        div.innerHTML = `<strong>${player}:</strong> ${message}`;
    }
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Helper Functions
 */
function isCurrentDrawer() {
    return gameState.currentDrawer === socket.id;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .chat-message {
        padding: 8px;
        margin-bottom: 5px;
        border-radius: 4px;
        background: #f8f9fa;
    }
    
    .chat-message.system {
        background: #e3f2fd;
    }
`;
document.head.appendChild(style);
