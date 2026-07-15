const Joi = require("joi");

const updateUserSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  avatar: Joi.string(),
});

module.exports = {
  updateUserSchema,
}
