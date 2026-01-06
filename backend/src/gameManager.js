const config = require('../config');

// Word lists will be loaded from the frontend words.js file
// For now, we'll use simple word selection logic

/**
 * Select a random word from a category
 */
function selectWord(category, usedWords, wordLists) {
  let availableWords = [];
  
  if (category === 'all') {
    // Combine all categories
    availableWords = Object.values(wordLists).flat();
  } else if (wordLists[category]) {
    availableWords = wordLists[category];
  }
  
  // Filter out used words
  availableWords = availableWords.filter(word => !usedWords.has(word.toLowerCase()));
  
  if (availableWords.length === 0) {
    // Reset used words if all have been used
    usedWords.clear();
    availableWords = category === 'all' 
      ? Object.values(wordLists).flat() 
      : wordLists[category] || [];
  }
  
  // Select random word
  const randomIndex = Math.floor(Math.random() * availableWords.length);
  return availableWords[randomIndex];
}

/**
 * Calculate score based on time remaining
 */
function calculateScore(timeLeft, maxTime = config.TURN_DURATION) {
  const baseScore = 100;
  const timeBonus = Math.floor((timeLeft / maxTime) * 50);
  return baseScore + timeBonus; // 100-150 points
}

/**
 * Start a new game
 */
function startGame(room, wordLists) {
  if (room.players.length < 2) {
    return { error: 'Need at least 2 players to start' };
  }
  
  room.gameState.active = true;
  room.gameState.round = 1;
  room.gameState.usedWords = new Set();
  
  // Reset scores
  room.players.forEach(player => {
    room.gameState.scores[player.id] = 0;
  });
  
  // Start first turn
  startTurn(room, wordLists);
  
  return { success: true };
}

/**
 * Start a new turn
 */
function startTurn(room, wordLists) {
  // Select next drawer
  if (room.gameState.currentDrawer === null) {
    room.gameState.currentDrawer = 0;
  } else {
    room.gameState.currentDrawer = (room.gameState.currentDrawer + 1) % room.players.length;
    
    // If we've cycled through all players, increment round
    if (room.gameState.currentDrawer === 0) {
      room.gameState.round++;
      
      // Check if game is over
      if (room.gameState.round > room.gameState.maxRounds) {
        endGame(room);
        return;
      }
    }
  }
  
  // Select word
  room.gameState.currentWord = selectWord(
    room.gameState.category, 
    room.gameState.usedWords,
    wordLists
  );
  room.gameState.usedWords.add(room.gameState.currentWord.toLowerCase());
  
  // Reset timer
  room.gameState.timeLeft = config.TURN_DURATION;
  
  // Clear drawing
  room.drawingData = [];
  
  return room;
}

/**
 * End current turn
 */
function endTurn(room, wordLists) {
  if (!room.gameState.active) return room;
  
  // Start next turn
  startTurn(room, wordLists);
  
  return room;
}

/**
 * Process a guess
 */
function processGuess(room, playerId, guess) {
  if (!room.gameState.active) {
    return { error: 'Game not active' };
  }
  
  const drawerIndex = room.gameState.currentDrawer;
  const drawer = room.players[drawerIndex];
  
  // Drawer can't guess
  if (drawer && drawer.id === playerId) {
    return { error: 'Drawer cannot guess' };
  }
  
  // Check if guess is correct (case-insensitive, trim whitespace)
  const isCorrect = guess.trim().toLowerCase() === room.gameState.currentWord.toLowerCase();
  
  if (isCorrect) {
    const score = calculateScore(room.gameState.timeLeft);
    room.gameState.scores[playerId] = (room.gameState.scores[playerId] || 0) + score;
    
    return {
      correct: true,
      score,
      word: room.gameState.currentWord,
    };
  }
  
  return { correct: false };
}

/**
 * Generate word hint (partial reveal)
 */
function generateHint(word, percentRevealed = 0) {
  if (!word) return '';
  
  const chars = word.split('');
  const revealCount = Math.floor(chars.length * percentRevealed);
  
  return chars.map((c, i) => {
    if (c === ' ') return ' ';
    return i < revealCount ? c : '_';
  }).join(' ');
}

/**
 * End the game
 */
function endGame(room) {
  room.gameState.active = false;
  
  // Find winner
  let winner = null;
  let maxScore = 0;
  
  for (const playerId in room.gameState.scores) {
    if (room.gameState.scores[playerId] > maxScore) {
      maxScore = room.gameState.scores[playerId];
      winner = room.players.find(p => p.id === playerId);
    }
  }
  
  return {
    winner: winner ? winner.name : null,
    scores: room.gameState.scores,
  };
}

/**
 * Update drawing data
 */
function updateDrawing(room, drawingData) {
  room.drawingData.push(drawingData);
  return room;
}

/**
 * Clear drawing
 */
function clearDrawing(room) {
  room.drawingData = [];
  return room;
}

module.exports = {
  startGame,
  startTurn,
  endTurn,
  processGuess,
  generateHint,
  endGame,
  updateDrawing,
  clearDrawing,
  selectWord,
  calculateScore,
};
