const Joi = require("joi");

// here we put our models schema
const cartSchema = Joi.object({});

const cartProductIdSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
});

module.exports = {
  cartSchema,
  cartProductIdSchema,
};