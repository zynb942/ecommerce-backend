const Joi = require("joi");
const mongoose = require("mongoose");

<<<<<<< HEAD
// here we put our models schema
const cartSchema = Joi.object({});

const cartProductIdSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
});

module.exports = {
  cartSchema,
  cartProductIdSchema,
=======
const addToCartSchema = Joi.object({
  productId: Joi.string()
    .required()
    .custom((value, helper) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helper.message("Invalid product id");
      }

      return value;
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
>>>>>>> main
};