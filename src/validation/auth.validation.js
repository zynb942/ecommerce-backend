const Joi = require('joi')


// validation schema for requesting a Reset Password
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email cannot be empty",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required"
  }),
  otp: Joi.string().length(6).required().messages({
    "string.empty": "OTP code cannot be empty",
    "string.length": "OTP must be exactly 6 digits",
    "any.required": "OTP is required"
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.empty": "New password cannot be empty",
    "string.min": "New password must be at least 6 characters long",
    "any.required": "New password is required"
  })
})

module.exports = { resetPasswordSchema };