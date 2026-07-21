const Joi = require("joi");

const productIdSchema = Joi.object({
  productId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.base": "Product ID must be a string",
      "string.empty": "Product ID is required",
      "string.hex": "Invalid Product ID format (must be a valid MongoDB ObjectId)",
      "string.length": "Product ID must be exactly 24 characters",
      "any.required": "Product ID is required",
    }),
});

module.exports = {
  productIdSchema,
};