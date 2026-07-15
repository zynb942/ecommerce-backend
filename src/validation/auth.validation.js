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

  
  const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(255)
        .required()
        .messages({
            "string.base": "Email must be a string",
            "string.empty": "Email is required",
            "string.email": "Please enter a valid email address",
            "string.max": "Email must not exceed 255 characters",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .required()
        .messages({
            "string.base": "Password must be a string",
            "string.empty": "Password is required",
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

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({
    "string.empty": "Email cannot be empty",
    "string.base": "Email must be a string",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required"
  }),
  otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    "string.empty": "OTP code cannot be empty",
    "string.length": "OTP must be exactly 6 digits",
    "any.required": "OTP is required"
  }),
  newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/).required().messages({
    "string.empty": "New password cannot be empty",
    "string.pattern.base": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    "any.required": "New password is required"
  })
})




module.exports = {
  userSchema,
  registerSchema,
  loginSchema,
  verifyOtpSchema, 
  forgotPasswordSchema,
  resetPasswordSchema,
  changeRoleSchema
};
