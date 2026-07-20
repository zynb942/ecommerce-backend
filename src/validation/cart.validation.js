const Joi = require("joi");

// here we put our models schema
const cartSchema = Joi.object({});
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
    }),
}).options({
  abortEarly: false,
  allowUnknown: false,
});
module.exports = { userSchema ,applyCouponSchema };
