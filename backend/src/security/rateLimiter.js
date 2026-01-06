const config = require('../../config');

// Store rate limit data
const rateLimitStore = new Map();

/**
 * Check rate limit for an action
 */
function checkRateLimit(identifier, action, maxAttempts, windowMs) {
  const key = `${identifier}:${action}`;
  const now = Date.now();
  
  let data = rateLimitStore.get(key);
  
  if (!data || now > data.resetAt) {
    data = {
      count: 0,
      resetAt: now + windowMs,
    };
  }
  
  if (data.count >= maxAttempts) {
    return false; // Rate limited
  }
  
  data.count++;
  rateLimitStore.set(key, data);
  return true;
}

/**
 * Check guess rate limit
 */
function checkGuessLimit(playerId) {
  return checkRateLimit(playerId, 'guess', config.MAX_GUESSES_PER_MINUTE, 60000);
}

/**
 * Check room creation rate limit
 */
function checkRoomCreationLimit(ip) {
  return checkRateLimit(ip, 'room_create', config.MAX_ROOM_CREATIONS_PER_HOUR, 3600000);
}

/**
 * Clean up old rate limit data
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

module.exports = {
  checkGuessLimit,
  checkRoomCreationLimit,
};
