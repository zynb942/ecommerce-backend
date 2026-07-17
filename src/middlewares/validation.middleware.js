const ApiError = require("../utils/apiError");

/**
 * Request validation middleware using Joi
 * @param {Object} schema Joi validation schema
 * @param {String} property request property to validate (body, params, query)
 */
const validate = (schema, property = "body") => {
  return (request, response, next) => {
    const { error, value } = schema.validate(request[property], {
      abortEarly: false
    });

    if (error) {
      return next(
        new ApiError(
          400,
          error.details.map((err) => err.message).join(", ")
        )
      );
    }

    req[property] = value;

    next()
  };
};

module.exports = validate;