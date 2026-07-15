const Joi = require('joi')

const addUserSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": "Username must be a string",
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must not exceed 30 characters",
      "any.required": "Username is required",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.base": "Email must be a string",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email",
      "any.required": "Email is required",
    }),

  password: Joi.string()
  .trim()  
  .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/
    )
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be at least 8 characters and contain uppercase, lowercase, number and special character",
      "any.required": "Password is required",
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^\+?[1-9]\d{7,14}$/) 
    .required()
    .messages({
      "string.base": "Phone must be a string",
      "string.empty": "Phone is required",
      "string.pattern.base": "Phone must be a valid international number (e.g., +201234567890 or 01234567890)",
      "any.required": "Phone is required",
    }),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

module.exports = {
  addUserSchema,
};


