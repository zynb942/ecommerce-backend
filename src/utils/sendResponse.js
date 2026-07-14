/**
 * Helper function to send a standard and unified JSON response to the client
 * @param {object} response Express response object
 * @param {number} statusCode HTTP status code to send
 * @param {string} message response message
 * @param {object} data Express JSON response
 * @returns { object } Express response object
 */
const sendResponse = (response, statusCode, message, data = {}) => {
  return response.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

module.exports = sendResponse;