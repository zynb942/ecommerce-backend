const errorHandler = (error, request, response, next) => {
  const statusCode = error.statusCode || 500;

  return response.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
}


module.exports = errorHandler;