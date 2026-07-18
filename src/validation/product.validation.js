const Joi = require("joi");

// here we put our models schema

const productIdSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid Product ID format",
    "any.required": "Product ID is required",
  }),
});

module.exports = {
  productIdSchema,
};