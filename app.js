// Game State
let gameState = {
    playerName: '',
    roomCode: '',
    isHost: false,
    currentDrawer: null,
    currentWord: '',
    category: 'all',
    players: [],
    scores: {},
    round: 1,
    maxRounds: 3,
    timeLeft: 60,
    gameActive: false,
    usedWords: new Set()
};

// Canvas setup
let canvas, ctx;
let isDrawing = false;
let currentColor = '#000000';
let currentSize = 5;
let currentTool = 'pen';
let drawingData = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    setupEventListeners();
});

function initializeCanvas() {
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Setup drawing events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    
    // Set initial canvas style
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

function resizeCanvas() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    
    // Store current drawing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Restore drawing
    ctx.putImageData(imageData, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

function setupEventListeners() {
    // Start screen
    document.getElementById('createRoomBtn').addEventListener('click', createRoom);
    document.getElementById('joinRoomBtn').addEventListener('click', showJoinScreen);
    
    // Join screen
    document.getElementById('joinSubmitBtn').addEventListener('click', joinRoom);
    document.getElementById('joinBackBtn').addEventListener('click', showStartScreen);
    
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
        });
    });
    
    document.getElementById('penBtn').addEventListener('click', () => {
        setTool('pen');
    });
    
    document.getElementById('eraserBtn').addEventListener('click', () => {
        setTool('eraser');
    });
    
    document.getElementById('clearBtn').addEventListener('click', clearCanvas);
    
    document.getElementById('brushSize').addEventListener('input', (e) => {
        currentSize = e.target.value;
    });
    
    // Chat
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Results screen
    document.getElementById('playAgainBtn').addEventListener('click', playAgain);
    document.getElementById('exitGameBtn').addEventListener('click', exitToMenu);
}

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showStartScreen() {
    showScreen('startScreen');
    resetGameState();
}

function showJoinScreen() {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
        alert('Please enter your name');
        return;
    }
    gameState.playerName = playerName;
    showScreen('joinScreen');
}

// Room Management
function createRoom() {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
        alert('Please enter your name');
        return;
    }
    
    gameState.playerName = playerName;
    gameState.roomCode = generateRoomCode();
    gameState.isHost = true;
    
    // Initialize players
    gameState.players = [{
        name: playerName,
        id: 'player-' + Date.now(),
        isHost: true
    }];
    
    // Initialize scores
    gameState.scores[gameState.playerName] = 0;
    
    showLobby();
}

function joinRoom() {
    const roomCode = document.getElementById('roomCode').value.trim().toUpperCase();
    if (!roomCode) {
        alert('Please enter a room code');
        return;
    }
    
    gameState.roomCode = roomCode;
    gameState.isHost = false;
    
    // In a real implementation, this would connect to the server
    // For this single-device demo, we'll simulate joining
    const playerId = 'player-' + Date.now();
    gameState.players.push({
        name: gameState.playerName,
        id: playerId,
        isHost: false
    });
    
    gameState.scores[gameState.playerName] = 0;
    
    showLobby();
}

function showLobby() {
    document.getElementById('currentRoomCode').textContent = gameState.roomCode;
    updatePlayersList();
    showScreen('lobbyScreen');
}

function updatePlayersList() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    gameState.players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player.name + (player.isHost ? ' (Host)' : '');
        playersList.appendChild(li);
    });
}

function leaveRoom() {
    if (confirm('Are you sure you want to leave the room?')) {
        showStartScreen();
    }
}

// Game Logic
function startGame() {
    if (gameState.players.length < 2) {
        alert('Need at least 2 players to start the game. In this demo, you can add simulated players by joining from another device or proceed with single player mode for testing.');
        // For demo purposes, add a bot player
        addBotPlayer();
        return;
    }
    
    gameState.gameActive = true;
    gameState.round = 1;
    gameState.usedWords.clear();
    
    // Reset scores
    gameState.players.forEach(player => {
        gameState.scores[player.name] = 0;
    });
    
    startNewRound();
}

function addBotPlayer() {
    const botNames = ['AI Player', 'Bot', 'Computer', 'Virtual Player'];
    const botName = botNames[Math.floor(Math.random() * botNames.length)];
    
    gameState.players.push({
        name: botName,
        id: 'bot-' + Date.now(),
        isHost: false,
        isBot: true
    });
    
    gameState.scores[botName] = 0;
    updatePlayersList();
}

function startNewRound() {
    // Select drawer (rotate through players)
    const drawerIndex = (gameState.round - 1) % gameState.players.length;
    gameState.currentDrawer = gameState.players[drawerIndex].name;
    
    // Select random word
    let word;
    do {
        word = getRandomWord(gameState.category);
    } while (gameState.usedWords.has(word) && gameState.usedWords.size < getWordsByCategory(gameState.category).length);
    
    gameState.currentWord = word;
    gameState.usedWords.add(word);
    gameState.timeLeft = 60;
    
    showGameScreen();
    startTimer();
}

function showGameScreen() {
    showScreen('gameScreen');
    updateGameUI();
    clearCanvas();
    
    // Show/hide drawing tools based on if player is drawer
    const isDrawer = gameState.currentDrawer === gameState.playerName;
    document.getElementById('drawingTools').classList.toggle('hidden', !isDrawer);
    
    // Disable canvas for non-drawers
    canvas.style.pointerEvents = isDrawer ? 'auto' : 'none';
    canvas.style.cursor = isDrawer ? 'crosshair' : 'default';
    
    // Add system message
    if (isDrawer) {
        addChatMessage(`You are drawing: ${gameState.currentWord}`, 'system');
    } else {
        addChatMessage(`${gameState.currentDrawer} is drawing...`, 'system');
    }
}

function updateGameUI() {
    // Update timer
    document.getElementById('timerDisplay').textContent = gameState.timeLeft;
    
    // Update round
    document.getElementById('roundDisplay').textContent = `${gameState.round}/${gameState.maxRounds}`;
    
    // Update word display
    const isDrawer = gameState.currentDrawer === gameState.playerName;
    if (isDrawer) {
        document.getElementById('wordDisplay').textContent = gameState.currentWord;
    } else {
        // Show word length with underscores
        const wordHint = gameState.currentWord.split('').map(char => char === ' ' ? ' ' : '_').join(' ');
        document.getElementById('wordDisplay').textContent = wordHint;
    }
    
    // Update scores
    updateScoreboard();
}

function updateScoreboard() {
    const scoresList = document.getElementById('scoresList');
    scoresList.innerHTML = '';
    
    // Sort players by score
    const sortedPlayers = Object.entries(gameState.scores)
        .sort((a, b) => b[1] - a[1]);
    
    sortedPlayers.forEach(([name, score]) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${name}</span><span>${score} pts</span>`;
        scoresList.appendChild(li);
    });
}

let timerInterval;

function startTimer() {
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        gameState.timeLeft--;
        document.getElementById('timerDisplay').textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            endRound();
        }
    }, 1000);
}

function endRound() {
    clearInterval(timerInterval);
    
    addChatMessage(`Time's up! The word was: ${gameState.currentWord}`, 'system');
    
    // Simulate bot guessing (random chance)
    if (gameState.currentDrawer !== gameState.playerName) {
        gameState.players.forEach(player => {
            if (player.isBot && Math.random() > 0.5) {
                setTimeout(() => {
                    gameState.scores[player.name] += 50;
                    addChatMessage(`${player.name} guessed correctly! +50 points`, 'correct');
                    updateScoreboard();
                }, 1000);
            }
        });
    }
    
    // Move to next round or end game
    setTimeout(() => {
        if (gameState.round >= gameState.maxRounds) {
            endGame();
        } else {
            gameState.round++;
            startNewRound();
        }
    }, 3000);
}

function endGame() {
    gameState.gameActive = false;
    showResults();
}

function showResults() {
    showScreen('resultsScreen');
    
    const finalScoresList = document.getElementById('finalScoresList');
    finalScoresList.innerHTML = '';
    
    // Sort players by score
    const sortedPlayers = Object.entries(gameState.scores)
        .sort((a, b) => b[1] - a[1]);
    
    sortedPlayers.forEach(([name, score], index) => {
        const li = document.createElement('li');
        const medal = index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        li.innerHTML = `<span>${medal} ${name}</span><span>${score} pts</span>`;
        finalScoresList.appendChild(li);
    });
}

// Drawing Functions
function startDrawing(e) {
    if (gameState.currentDrawer !== gameState.playerName) return;
    
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    if (gameState.currentDrawer !== gameState.playerName) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isDrawing) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineTo(x, y);
    ctx.stroke();
}

function setTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    
    if (tool === 'pen') {
        document.getElementById('penBtn').classList.add('active');
    } else if (tool === 'eraser') {
        document.getElementById('eraserBtn').classList.add('active');
    }
}

function clearCanvas() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Chat Functions
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Check if it's the correct answer
    if (gameState.currentDrawer !== gameState.playerName) {
        if (message.toLowerCase() === gameState.currentWord.toLowerCase()) {
            // Correct guess!
            const points = Math.max(50, Math.floor(gameState.timeLeft));
            gameState.scores[gameState.playerName] = (gameState.scores[gameState.playerName] || 0) + points;
            
            addChatMessage(`${gameState.playerName} guessed correctly! +${points} points`, 'correct');
            updateScoreboard();
            
            input.value = '';
            return;
        }
    }
    
    addChatMessage(`${gameState.playerName}: ${message}`, 'normal');
    input.value = '';
}

function addChatMessage(message, type = 'normal') {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${type}`;
    msgDiv.textContent = message;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Utility Functions
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function resetGameState() {
    clearInterval(timerInterval);
    gameState = {
        playerName: '',
        roomCode: '',
        isHost: false,
        currentDrawer: null,
        currentWord: '',
        category: 'all',
        players: [],
        scores: {},
        round: 1,
        maxRounds: 3,
        timeLeft: 60,
        gameActive: false,
        usedWords: new Set()
    };
}

function playAgain() {
    gameState.round = 1;
    gameState.usedWords.clear();
    
    // Reset scores
    gameState.players.forEach(player => {
        gameState.scores[player.name] = 0;
    });
    
    startNewRound();
}

function exitToMenu() {
    showStartScreen();
}
