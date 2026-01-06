const roomManager = require('./roomManager');
const gameManager = require('./gameManager');
const { sanitizeInput, validatePlayerName, validatePassword } = require('./security/sanitizer');
const { validateRoomCode } = require('./utils/roomCode');
const { checkGuessLimit, checkRoomCreationLimit } = require('./security/rateLimiter');

// Simple word lists (subset for backend - full lists in frontend)
const WORD_LISTS = {
  movies: ['Titanic', 'Avatar', 'Inception', 'Frozen', 'Jaws'],
  tvshows: ['Friends', 'Seinfeld', 'Lost', 'Breaking Bad', 'Game of Thrones'],
  songs: ['Imagine', 'Bohemian Rhapsody', 'Thriller', 'Yesterday', 'Hey Jude'],
  animals: ['Elephant', 'Giraffe', 'Penguin', 'Kangaroo', 'Dolphin'],
  objects: ['Umbrella', 'Bicycle', 'Camera', 'Laptop', 'Guitar'],
  food: ['Pizza', 'Hamburger', 'Sushi', 'Pasta', 'Tacos'],
  places: ['Paris', 'Beach', 'Mountain', 'Desert', 'Forest'],
  actions: ['Dancing', 'Swimming', 'Flying', 'Reading', 'Cooking'],
};

// Timer intervals for each room
const roomTimers = new Map();

/**
 * Initialize Socket.IO event handlers
 */
function initializeSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    let currentRoom = null;
    let playerName = null;
    
    /**
     * Create a new room
     */
    socket.on('create-room', async (data) => {
      try {
        const { playerName: name, password, category } = data;
        
        // Validate input
        if (!validatePlayerName(name)) {
          socket.emit('room-error', { message: 'Invalid player name (1-20 characters)' });
          return;
        }
        
        if (!validatePassword(password)) {
          socket.emit('room-error', { message: 'Invalid password (4-50 characters)' });
          return;
        }
        
        // Check rate limit
        const clientIp = socket.handshake.address;
        if (!checkRoomCreationLimit(clientIp)) {
          socket.emit('room-error', { message: 'Too many room creation attempts. Please wait.' });
          return;
        }
        
        // Create room
        const sanitizedName = sanitizeInput(name);
        const room = await roomManager.createRoom(sanitizedName, password, category || 'all');
        
        // Add creator as first player
        const player = {
          id: socket.id,
          name: sanitizedName,
          connected: true,
        };
        
        roomManager.addPlayerToRoom(room.code, player);
        
        // Join socket room
        socket.join(room.code);
        currentRoom = room.code;
        playerName = sanitizedName;
        
        console.log(`Room created: ${room.code} by ${sanitizedName}`);
        
        socket.emit('room-created', {
          roomCode: room.code,
          player: { id: socket.id, name: sanitizedName },
        });
        
        socket.emit('room-joined', roomManager.getRoomInfo(room.code));
        
      } catch (error) {
        console.error('Error creating room:', error);
        socket.emit('room-error', { message: 'Failed to create room' });
      }
    });
    
    /**
     * Join an existing room
     */
    socket.on('join-room', async (data) => {
      try {
        const { roomCode, playerName: name, password } = data;
        
        // Validate input
        if (!validateRoomCode(roomCode)) {
          socket.emit('room-error', { message: 'Invalid room code' });
          return;
        }
        
        if (!validatePlayerName(name)) {
          socket.emit('room-error', { message: 'Invalid player name (1-20 characters)' });
          return;
        }
        
        // Check if room exists
        const room = roomManager.getRoom(roomCode);
        if (!room) {
          socket.emit('room-error', { message: 'Room not found' });
          return;
        }
        
        // Verify password
        const passwordValid = await roomManager.verifyRoomPassword(roomCode, password);
        if (!passwordValid) {
          socket.emit('room-error', { message: 'Invalid password' });
          return;
        }
        
        // Add player
        const sanitizedName = sanitizeInput(name);
        const player = {
          id: socket.id,
          name: sanitizedName,
          connected: true,
        };
        
        const result = roomManager.addPlayerToRoom(roomCode, player);
        
        if (result.error) {
          socket.emit('room-error', { message: result.error });
          return;
        }
        
        // Join socket room
        socket.join(roomCode);
        currentRoom = roomCode;
        playerName = sanitizedName;
        
        console.log(`${sanitizedName} joined room: ${roomCode}`);
        
        socket.emit('room-joined', roomManager.getRoomInfo(roomCode));
        
        // Notify other players
        socket.to(roomCode).emit('player-joined', {
          player: { id: socket.id, name: sanitizedName, score: 0 },
        });
        
        // Send current drawing if game is active
        if (room.gameState.active && room.drawingData.length > 0) {
          socket.emit('drawing-sync', { drawingData: room.drawingData });
        }
        
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('room-error', { message: 'Failed to join room' });
      }
    });
    
    /**
     * Start the game
     */
    socket.on('start-game', () => {
      if (!currentRoom) return;
      
      const room = roomManager.getRoom(currentRoom);
      if (!room || room.host !== socket.id) {
        socket.emit('game-error', { message: 'Only host can start the game' });
        return;
      }
      
      const result = gameManager.startGame(room, WORD_LISTS);
      
      if (result.error) {
        socket.emit('game-error', { message: result.error });
        return;
      }
      
      console.log(`Game started in room: ${currentRoom}`);
      
      // Notify all players
      const drawerIndex = room.gameState.currentDrawer;
      const drawer = room.players[drawerIndex];
      
      io.to(currentRoom).emit('game-started', {
        round: room.gameState.round,
        maxRounds: room.gameState.maxRounds,
        drawer: { id: drawer.id, name: drawer.name },
      });
      
      // Send word to drawer
      io.to(drawer.id).emit('your-word', { word: room.gameState.currentWord });
      
      // Send hint to guessers
      socket.to(currentRoom).emit('word-hint', {
        hint: gameManager.generateHint(room.gameState.currentWord, 0),
      });
      
      // Start timer
      startRoomTimer(currentRoom, io);
    });
    
    /**
     * Submit a guess
     */
    socket.on('submit-guess', (data) => {
      if (!currentRoom) return;
      
      const room = roomManager.getRoom(currentRoom);
      if (!room || !room.gameState.active) return;
      
      // Check rate limit
      if (!checkGuessLimit(socket.id)) {
        socket.emit('game-error', { message: 'Guessing too fast. Slow down!' });
        return;
      }
      
      const guess = sanitizeInput(data.guess);
      const result = gameManager.processGuess(room, socket.id, guess);
      
      if (result.error) {
        return; // Silently ignore (drawer guessing, etc.)
      }
      
      // Broadcast guess to all players
      io.to(currentRoom).emit('guess-submitted', {
        player: { id: socket.id, name: playerName },
        guess,
        correct: result.correct,
      });
      
      if (result.correct) {
        console.log(`${playerName} guessed correctly: ${result.word}`);
        
        // Stop timer
        stopRoomTimer(currentRoom);
        
        // Notify all players
        io.to(currentRoom).emit('correct-guess', {
          player: { id: socket.id, name: playerName },
          word: result.word,
          score: result.score,
          scores: room.gameState.scores,
        });
        
        // Wait a bit, then start next turn
        setTimeout(() => {
          const updatedRoom = roomManager.getRoom(currentRoom);
          if (!updatedRoom) return;
          
          gameManager.endTurn(updatedRoom, WORD_LISTS);
          
          // Check if game ended
          if (!updatedRoom.gameState.active) {
            const gameResult = gameManager.endGame(updatedRoom);
            io.to(currentRoom).emit('game-ended', gameResult);
            return;
          }
          
          // Start next turn
          const drawerIndex = updatedRoom.gameState.currentDrawer;
          const drawer = updatedRoom.players[drawerIndex];
          
          io.to(currentRoom).emit('turn-started', {
            round: updatedRoom.gameState.round,
            drawer: { id: drawer.id, name: drawer.name },
            timeLeft: updatedRoom.gameState.timeLeft,
          });
          
          io.to(drawer.id).emit('your-word', { word: updatedRoom.gameState.currentWord });
          
          io.to(currentRoom).emit('word-hint', {
            hint: gameManager.generateHint(updatedRoom.gameState.currentWord, 0),
          });
          
          io.to(currentRoom).emit('clear-canvas');
          
          startRoomTimer(currentRoom, io);
          
        }, 3000);
      }
    });
    
    /**
     * Drawing data
     */
    socket.on('drawing-data', (data) => {
      if (!currentRoom) return;
      
      const room = roomManager.getRoom(currentRoom);
      if (!room || !room.gameState.active) return;
      
      // Only drawer can send drawing data
      const drawerIndex = room.gameState.currentDrawer;
      const drawer = room.players[drawerIndex];
      
      if (!drawer || drawer.id !== socket.id) return;
      
      // Data is an array of drawing segments
      if (Array.isArray(data)) {
        data.forEach(segment => {
          socket.to(currentRoom).emit('drawing-update', segment);
          gameManager.updateDrawing(room, segment);
        });
      } else {
        // Single segment (fallback)
        socket.to(currentRoom).emit('drawing-update', data);
        gameManager.updateDrawing(room, data);
      }
    });
    
    /**
     * Clear canvas
     */
    socket.on('clear-canvas', () => {
      if (!currentRoom) return;
      
      const room = roomManager.getRoom(currentRoom);
      if (!room) return;
      
      gameManager.clearDrawing(room);
      io.to(currentRoom).emit('clear-canvas');
    });
    
    /**
     * Leave room
     */
    socket.on('leave-room', () => {
      handleDisconnect();
    });
    
    /**
     * Handle disconnect
     */
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      handleDisconnect();
    });
    
    function handleDisconnect() {
      if (currentRoom) {
        const room = roomManager.removePlayerFromRoom(currentRoom, socket.id);
        
        if (room) {
          // Notify other players
          io.to(currentRoom).emit('player-left', {
            playerId: socket.id,
            playerName,
          });
          
          // If game was active and drawer left, end turn
          if (room.gameState.active) {
            const drawerIndex = room.gameState.currentDrawer;
            if (drawerIndex >= 0 && drawerIndex < room.players.length) {
              const drawer = room.players[drawerIndex];
              if (drawer.id === socket.id) {
                stopRoomTimer(currentRoom);
                gameManager.endTurn(room, WORD_LISTS);
                // Notify and restart turn...
              }
            }
          }
        } else {
          // Room was deleted (empty)
          stopRoomTimer(currentRoom);
        }
        
        socket.leave(currentRoom);
        currentRoom = null;
        playerName = null;
      }
    }
  });
}

/**
 * Start timer for a room
 */
function startRoomTimer(roomCode, io) {
  stopRoomTimer(roomCode); // Clear any existing timer
  
  const interval = setInterval(() => {
    const room = roomManager.getRoom(roomCode);
    if (!room || !room.gameState.active) {
      stopRoomTimer(roomCode);
      return;
    }
    
    room.gameState.timeLeft--;
    
    // Broadcast timer tick
    io.to(roomCode).emit('timer-tick', { timeLeft: room.gameState.timeLeft });
    
    // Time's up
    if (room.gameState.timeLeft <= 0) {
      stopRoomTimer(roomCode);
      
      io.to(roomCode).emit('turn-ended', {
        word: room.gameState.currentWord,
        scores: room.gameState.scores,
      });
      
      // Start next turn after delay
      setTimeout(() => {
        gameManager.endTurn(room, WORD_LISTS);
        
        if (!room.gameState.active) {
          const gameResult = gameManager.endGame(room);
          io.to(roomCode).emit('game-ended', gameResult);
          return;
        }
        
        const drawerIndex = room.gameState.currentDrawer;
        const drawer = room.players[drawerIndex];
        
        io.to(roomCode).emit('turn-started', {
          round: room.gameState.round,
          drawer: { id: drawer.id, name: drawer.name },
          timeLeft: room.gameState.timeLeft,
        });
        
        io.to(drawer.id).emit('your-word', { word: room.gameState.currentWord });
        
        io.to(roomCode).emit('word-hint', {
          hint: gameManager.generateHint(room.gameState.currentWord, 0),
        });
        
        io.to(roomCode).emit('clear-canvas');
        
        startRoomTimer(roomCode, io);
        
      }, 3000);
    }
  }, 1000);
  
  roomTimers.set(roomCode, interval);
}

/**
 * Stop timer for a room
 */
function stopRoomTimer(roomCode) {
  const interval = roomTimers.get(roomCode);
  if (interval) {
    clearInterval(interval);
    roomTimers.delete(roomCode);
  }
}

module.exports = {
  initializeSocketHandlers,
};
