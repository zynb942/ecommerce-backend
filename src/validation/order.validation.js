const Joi = require("joi");
const mongoose = require("mongoose");

const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().trim().required().messages({
      "string.base": "Full name must be a string",
      "string.empty": "Full name is required",
      "any.required": "Full name is required",
    }),
    phone: Joi.string().trim().required().messages({
      "string.base": "Phone number must be a string",
      "string.empty": "Phone number is required",
      "any.required": "Phone number is required",
    }),
    country: Joi.string().trim().required().messages({
      "string.base": "Country must be a string",
      "string.empty": "Country is required",
      "any.required": "Country is required",
    }),
    city: Joi.string().trim().required().messages({
      "string.base": "City must be a string",
      "string.empty": "City is required",
      "any.required": "City is required",
    }),
    address: Joi.string().trim().required().messages({
      "string.base": "Address must be a string",
      "string.empty": "Address is required",
      "any.required": "Address is required",
    }),
    postalCode: Joi.string().trim().required().messages({
      "string.base": "Postal code must be a string",
      "string.empty": "Postal code is required",
      "any.required": "Postal code is required",
    }),
  })
    .required()
    .messages({
      "any.required": "Shipping address is required",
    }),

  paymentMethod: Joi.string()
    .valid("cash", "stripe", "paypal", "paymob")
    .default("cash")
    .required()
    .messages({
      "string.base": "Payment method must be a string",
      "any.only": "Payment method must be one of [cash, stripe, paypal, paymob]",
    }),

  customerNote: Joi.string().trim().max(1000).allow("").optional().messages({
    "string.base": "Customer note must be a string",
    "string.max": "Customer note cannot exceed 1000 characters",
  }),
});

module.exports = {
  createOrderSchema,
};