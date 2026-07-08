import { logEvents } from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

// Database Error 
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new ApiError(400, `Invalid input data: ${errors.join('. ')}`);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.keys(err.keyValue || {})[0];
  return new ApiError(400, `Duplicate field value: "${err.keyValue[value]}". Please use another value!`);
};

const handleCastErrorDB = (err) => {
  return new ApiError(400, `Invalid ${err.path}: ${err.value}.`);
};

const handleJWTError = () => new ApiError(401, 'Invalid token. Please log in again!');
const handleJWTExpiredError = () => new ApiError(401, 'Your token has expired! Please log in again.');

//Central Global Error Handling Middleware
 
const errorHandler = (err, req, res, next) => {

    if (res.headersSent) {
    return next(err);
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const origin = req.headers.origin || req.get("host") || req.ip || "unknown origin";
  
  logEvents(`${err.name || "Error"}: ${err.message}\t${req.method}\t${err.statusCode}\t${req.url}\t${origin}`, "errorLog.log");
  console.error(err.stack);

  // Development Strategy
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } 

  // Production Strategy
  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  error.message = err.message;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  }

  // Fallback for unexpected error
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong on our servers.'
  });
};

export default errorHandler;