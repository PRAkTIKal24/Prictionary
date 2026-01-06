require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:8000',
  
  // Game settings
  MAX_PLAYERS_PER_ROOM: parseInt(process.env.MAX_PLAYERS_PER_ROOM) || 8,
  ROOM_INACTIVITY_TIMEOUT: parseInt(process.env.ROOM_INACTIVITY_TIMEOUT) || 7200000, // 2 hours
  PLAYER_TIMEOUT: parseInt(process.env.PLAYER_TIMEOUT) || 120000, // 2 minutes
  MAX_ROUNDS: parseInt(process.env.MAX_ROUNDS) || 5,
  TURN_DURATION: 60, // seconds
  
  // Rate limiting
  MAX_GUESSES_PER_MINUTE: parseInt(process.env.MAX_GUESSES_PER_MINUTE) || 10,
  MAX_ROOM_CREATIONS_PER_HOUR: parseInt(process.env.MAX_ROOM_CREATIONS_PER_HOUR) || 5,
};
