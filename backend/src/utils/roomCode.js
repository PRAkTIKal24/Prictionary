/**
 * Generate a unique room code
 */
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar-looking characters
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validate room code format
 */
function validateRoomCode(code) {
  return /^[A-Z0-9]{6}$/.test(code);
}

module.exports = {
  generateRoomCode,
  validateRoomCode,
};
