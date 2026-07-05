// Utility function to send consistent API JSON success responses 
 
const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    ...(data !== null && {
      results: Array.isArray(data) ? data.length : undefined,
      data
    })
  });
};

export default sendResponse;