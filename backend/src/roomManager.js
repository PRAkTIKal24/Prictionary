const config = require('../config');
const { generateRoomCode } = require('./utils/roomCode');
const { hashPassword, verifyPassword } = require('./utils/passwordHash');

// In-memory storage for rooms
const rooms = new Map();

/**
 * Create a new room
 */
async function createRoom(hostName, password, category) {
  let roomCode;
  
  // Generate unique room code
  do {
    roomCode = generateRoomCode();
  } while (rooms.has(roomCode));
  
  const passwordHash = await hashPassword(password);
  
  const room = {
    code: roomCode,
    passwordHash,
    createdAt: Date.now(),
    lastActivity: Date.now(),
    host: null, // Will be set when host socket connects
    players: [],
    gameState: {
      active: false,
      round: 1,
      maxRounds: 500,
      currentDrawer: null,
      currentWord: '',
      category,
      timeLeft: config.TURN_DURATION,
      usedWords: new Set(),
      scores: {},
    },
    drawingData: [],
  };
  
  rooms.set(roomCode, room);
  
  // Schedule room cleanup
  setTimeout(() => cleanupInactiveRoom(roomCode), config.ROOM_INACTIVITY_TIMEOUT);
  
  return room;
}

/**
 * Get a room by code
 */
function getRoom(roomCode) {
  return rooms.get(roomCode);
}

/**
 * Verify room password
 */
async function verifyRoomPassword(roomCode, password) {
  const room = rooms.get(roomCode);
  if (!room) return false;
  return await verifyPassword(password, room.passwordHash);
}

/**
 * Add player to room
 */
function addPlayerToRoom(roomCode, player) {
  const room = rooms.get(roomCode);
  if (!room) return null;
  
  // Check if room is full
  if (room.players.length >= config.MAX_PLAYERS_PER_ROOM) {
    return { error: 'Room is full' };
  }
  
  // Check if player already exists (by name)
  if (room.players.some(p => p.name === player.name)) {
    return { error: 'Player name already taken in this room' };
  }
  
  // Set host if first player
  if (room.players.length === 0) {
    room.host = player.id;
  }
  
  room.players.push(player);
  room.gameState.scores[player.id] = 0;
  room.lastActivity = Date.now();
  
  return room;
}

/**
 * Remove player from room
 */
function removePlayerFromRoom(roomCode, playerId) {
  const room = rooms.get(roomCode);
  if (!room) return null;
  
  room.players = room.players.filter(p => p.id !== playerId);
  delete room.gameState.scores[playerId];
  
  // Transfer host if needed
  if (room.host === playerId && room.players.length > 0) {
    room.host = room.players[0].id;
  }
  
  // Delete room if empty
  if (room.players.length === 0) {
    rooms.delete(roomCode);
    return null;
  }
  
  room.lastActivity = Date.now();
  return room;
}

/**
 * Update player connection status
 */
function updatePlayerStatus(roomCode, playerId, connected) {
  const room = rooms.get(roomCode);
  if (!room) return null;
  
  const player = room.players.find(p => p.id === playerId);
  if (player) {
    player.connected = connected;
    room.lastActivity = Date.now();
  }
  
  return room;
}

/**
 * Clean up inactive room
 */
function cleanupInactiveRoom(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;
  
  const inactive = Date.now() - room.lastActivity > config.ROOM_INACTIVITY_TIMEOUT;
  if (inactive) {
    console.log(`Cleaning up inactive room: ${roomCode}`);
    rooms.delete(roomCode);
  }
}

/**
 * Get room info (without sensitive data)
 */
function getRoomInfo(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return null;
  
  return {
    code: room.code,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      connected: p.connected,
      score: room.gameState.scores[p.id] || 0,
    })),
    host: room.host,
    gameState: {
      active: room.gameState.active,
      round: room.gameState.round,
      maxRounds: room.gameState.maxRounds,
      category: room.gameState.category,
    },
  };
}

module.exports = {
  createRoom,
  getRoom,
  verifyRoomPassword,
  addPlayerToRoom,
  removePlayerFromRoom,
  updatePlayerStatus,
  getRoomInfo,
};
