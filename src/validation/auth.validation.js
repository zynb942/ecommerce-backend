const Joi = require('joi')


// validation schema for requesting a Reset Password
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({
    "string.empty": "Email cannot be empty",
    "string.base": "Email must be a string",
    "string.base": "OTP must be a string",
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

module.exports = { resetPasswordSchema };