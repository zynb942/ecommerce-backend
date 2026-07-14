/**
 * Helper function to send a standard and unified JSON response to the client
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code to send
 * @param {string} message - response message
 * @param {object} data - Express JSON response (default: {})
 * @returns {object} Express response object
 */
const sendResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

module.exports = sendResponse;