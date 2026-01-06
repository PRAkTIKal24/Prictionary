/**
 * Sanitize user input to prevent XSS
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 100); // Limit length
}

/**
 * Validate player name
 */
function validatePlayerName(name) {
  if (!name || typeof name !== 'string') return false;
  const sanitized = sanitizeInput(name);
  return sanitized.length >= 1 && sanitized.length <= 20;
}

/**
 * Validate password
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 4 && password.length <= 50;
}

module.exports = {
  sanitizeInput,
  validatePlayerName,
  validatePassword,
};
