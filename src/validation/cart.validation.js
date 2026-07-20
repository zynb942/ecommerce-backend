const Joi = require("joi");

const addToCartSchema = Joi.object({
  productId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.base": "Product ID must be a string",
      "string.empty": "Product ID is required",
      "string.hex": "Invalid product ID",
      "string.length": "Invalid product ID",
      "any.required": "Product ID is required",
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Quantity must be at least 1",
      "any.required": "Quantity is required",
    }),
}).options({
  abortEarly: false,
  allowUnknown: false,
});

module.exports = {
  addToCartSchema,
};