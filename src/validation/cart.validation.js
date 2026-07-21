const Joi = require("joi");
const mongoose = require("mongoose");

// here we put our models schema

const cartProductIdSchema = Joi.object({
  productId: Joi.string().hex().length(24).required() .messages({
    "string.base": "Product ID must be a string",
    "string.empty": "Product ID is required",
    "string.hex": "Product ID must be a valid MongoDB ObjectId",
    "string.length": "Product ID must be 24 characters long",
    "any.required": "Product ID is required",
  })
});
const applyCouponSchema = Joi.object({
  code: Joi.string()
    .trim()
    .uppercase()
    .required()
    .messages({
      "string.base": "Coupon code must be a string",
      "string.empty": "Coupon code is required",
      "string.uppercase": "Coupon code must be uppercase",
      "any.required": "Coupon code is required",
      })
    })


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
})



/**
 * @description Updat Cart-item's schema
 */
const updateCartItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
      "string.base": "Product ID must be a string",
      "string.empty": "Product ID is required",
      "string.hex": "Product ID must be a valid MongoDB ObjectId",
      "string.length": "Product ID must be 24 characters long",
      "any.required": "Product ID is required",
    }),
  quantity: Joi.number().integer().positive().required().messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be a valid integer",
      "number.positive": "Quantity must be greater than zero",
      "any.required": "Quantity is required",
    }),
})



module.exports = {
  cartProductIdSchema,
  addToCartSchema,
  applyCouponSchema, 
  updateCartItemSchema,
};
