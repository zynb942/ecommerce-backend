const Joi = require("joi");


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
      return response.status(400).json({
        errors: error.details.map(err => err.message),
      });
    }
    next();
  };
};

module.exports = validate;
