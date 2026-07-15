const Joi = require("joi");

const updateUserSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).messages({
    "string.min": "Username must be at least 3 characters long",
    "sring.max": "Username cannot exceed 30 characters",
  }),
  phone: Joi.string().pattern(/^\+?[1-9]\d{7,14}$/).messages({
    "string.pattern.base": "Phone number must be a valid international format",
  }),

  avatar: Joi.string().trim().uri().messages({
    "string.uri": "Avatar must be a valid URL",
  }),
})
.options({
    abortEarly: false,
    allowUnknown: false,

  });
module.exports = {
  updateUserSchema,
};
