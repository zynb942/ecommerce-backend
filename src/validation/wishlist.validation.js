const Joi = require("joi");

const productIdSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
});

module.exports = {
  productIdSchema,
};