const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(200)
    .required()
    .messages({
      "string.empty": "Product name is required",
      "string.max": "Product name cannot exceed 200 characters",
      "any.required": "Product name is required",
    }),

  shortDescription: Joi.string()
    .trim()
    .max(500)
    .required()
    .messages({
      "string.empty": "Short description is required",
      "string.max": "Short description cannot exceed 500 characters", 
      "any.required": "Short description is required",
    }),

  description: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
    }),

  price: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
      "any.required": "Price is required",
    }),

  discountPrice: Joi.number()
    .min(0)
    .optional()
    .messages({
      "number.base": "Discount price must be a number",
      "number.min": "Discount price cannot be negative",
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "number.min": "Stock cannot be negative",
      "any.required": "Stock is required",
    }),

  sku: Joi.string()
    .trim()
    .optional(),

  category: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Category is required",
      "any.required": "Category is required",
    }),

  subcategory: Joi.string()
    .trim()
    .optional(),

  brand: Joi.string()
    .trim()
    .optional(),

  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()),
    Joi.string()
  ).optional(),

  featured: Joi.boolean().optional(),

  isActive: Joi.boolean().optional(),
})
.custom((value, helpers) => {
  if (
    value.discountPrice !== undefined &&
    value.discountPrice > value.price
  ) {
    return helpers.message(
      "Discount price cannot exceed product price"
    );
  }

  return value;
})
.options({
  abortEarly: false,
  allowUnknown: false,
});
const productIdSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.base": "Product id must be a string",
      "string.empty": "Product id is required",
      "string.hex": "Invalid product id",
      "string.length": "Invalid product id",
      "any.required": "Product id is required",
    }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().max(200),

  shortDescription: Joi.string().trim().max(500),

  description: Joi.string().trim(),

  price: Joi.number().positive(),

  discountPrice: Joi.number().min(0),

  stock: Joi.number().integer().min(0),

  sku: Joi.string().trim(),

  category: Joi.string().trim(),

  subcategory: Joi.string().trim(),

  brand: Joi.string().trim(),

  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()),
    Joi.string()
  ),

  featured: Joi.boolean(),

  isActive: Joi.boolean(),

  deletedImages: Joi.array().items(Joi.string()),
})
.custom((value, helpers) => {
  if (
    value.discountPrice !== undefined &&
    value.price !== undefined &&
    value.discountPrice > value.price
  ) {
    return helpers.message(
      "Discount price cannot exceed product price"
    );
  }

  return value;
})
.options({
  abortEarly: false,
  allowUnknown: false,
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
};