const Joi = require("joi");
const ApiError = require("../utils/apiError");


/**
 * Request body validation middleware using Joi
 * @param { object } schema Joi validation schema
 * @returns { function } Express middleware function
 */
const validate = (schema) => {
  return (request, response, next) => {
    const { error, value } = schema.validate(request.body, {
      abortEarly: false
    });

    if (error) {
      return next(
        new ApiError(
          400,
          error.details.map((err) => err.message).join(', ')
        )
      );
    }
    next()
  };
};

module.exports = validate;
