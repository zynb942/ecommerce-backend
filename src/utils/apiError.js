/**
 * Custom error class to handle known operational API errors
 * @extends Error
 */
class ApiError extends Error {
  /**
   * 
   * @param {number} statusCode HTTP status code (400, 404, 500)
   * @param {string} message  error message
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;