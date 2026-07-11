const _config = require('../config/env.js')
const express = require('express')

/**
 * Global Error Handler Middleware
 * @param { Error & {statusCode?: number, status?: string, isOperational?: boolean}} error error object & HTTP status code & error status & expected operational errors
 * @param { express.Request} request Express request object
 * @param { express.Response} response Express response object
 * @param { express.NextFunction} next Express next middleware function
 * @returns { void }
 */
const errorHandler = (error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  const errorStatus = error.status || 'error'

  if(_config.NODE_ENV === 'development'){
    return response.status(statusCode).json({
      status: errorStatus,
      success: false,
      message: error.message,
        //#region this return complete error path, NOT DISPLAY IT ON PRODUCTION, to PROTECT SENSITIVE SYSTEM DATA
        stack: error.stack, // ← ONLY IN DEVELOPMENT
        //#endregion 
      error: error
    })
  }else {
    return response.status(statusCode).json({
      status: errorStatus,
      success: false,
      //#region show message for operational errors and hide internal system errors to secure sensitive data
      message: error.isOperational ? error.message : "Internal server error",
      //#endregion
    });
  }
}

module.exports = errorHandler;


/**
 * as not operational error: MongoNetworkError: failed to connect to [mongodb+srv://admin:MySecretPassword123@cluster.mongodb.net/ecommerce]
 */