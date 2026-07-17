const Product = require("../models/product.model");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/sendResponse");

/**
 * @desc Create new product
 * @route POST /api/products
 * @access Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  let {
    name,
    shortDescription,
    description,
    price,
    discountPrice,
    stock,
    sku,
    category,
    subcategory,
    brand,
    tags,
    featured,
    isActive,
  } = req.body;

  // Default values
  discountPrice ??= 0;
  featured ??= false;
  isActive ??= true;
  tags ??= [];

  // Convert tags from string to array if needed
  if (typeof tags === "string") {
    try {
      tags = JSON.parse(tags);
    } catch {
      tags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  }

  // Validate uploaded images
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one product image is required");
  }

  // Upload images to Cloudinary
  const uploadedImages = await Promise.all(
    req.files.map((file) => uploadToCloudinary(file, "products"))
  );

  // Create product
  const product = await Product.create({
    name,
    shortDescription,
    description,
    price,
    discountPrice,
    stock,
    sku,
    category,
    subcategory,
    brand,
    tags,
    featured,
    isActive,
    images: uploadedImages,
    createdBy: req.user._id,
  });

  // Send response
  return sendResponse(res, 201, "Product created successfully", {
    product,
  });
});

module.exports = {
  createProduct,
};