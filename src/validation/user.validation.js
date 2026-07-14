const Joi = require("joi");

const userSchema = Joi.object({});

const registerSchema = Joi.object({
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
});

const verifyOtpSchema = Joi.object({
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


  otp: Joi.string()
    .pattern(/^\d{6}$/) 
    .required()
    .messages({
      "string.base": "OTP must be a string",
      "string.empty": "OTP is required",
      "string.pattern.base": "OTP must be exactly 6 digits", 
      "any.required": "OTP is required",
    }),
});

const forgotPasswordSchema = Joi.object({
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
});

const changeRoleSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.base": "User ID must be a string",
      "string.empty": "User ID is required",
      "string.pattern.base": "Invalid User ID format (must be a valid MongoDB ObjectId)",
      "any.required": "User ID is required",
    }),

  role: Joi.string()
    .valid("admin", "customer")
    .required()
    .messages({
      "string.base": "Role must be a string",
      "string.empty": "Role is required",
      "any.only": "Role must be either admin or customer",
      "any.required": "Role is required",
    }),
});

module.exports = {
  userSchema,
  registerSchema,
  verifyOtpSchema, 
  forgotPasswordSchema,
  changeRoleSchema
};

