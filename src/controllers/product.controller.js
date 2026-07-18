const Product = require("../models/product.model");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/sendResponse");
const ApiError = require("../utils/apiError");

const getAllProducts = asyncHandler(async (req, res) => {
  // pagination parameters with default values
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // dynamically build the filter object based on query parameters
  const filterObject = { isActive: true };

  // category filter
  if (req.query.category) {
    filterObject.category = { $regex: req.query.category, $options: "i" };
  }

  // brand filter
  if (req.query.brand) {
    filterObject.brand = { $regex: req.query.brand, $options: "i" };
  }

  // price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filterObject.price = {};
    if (req.query.minPrice) {
      filterObject.price.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      filterObject.price.$lte = Number(req.query.maxPrice);
    }
  }

  // search filter for name, description, and brand
  if (req.query.search) {
    filterObject.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
      { brand: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // sorting criteria based on query parameter
  let sortCriteria = { createdAt: -1 }; // الترتيب الافتراضي بالأحدث

  if (req.query.sort) {
    switch (req.query.sort) {
      case "price_asc":
        sortCriteria = { price: 1 };
        break;
      case "price_desc":
        sortCriteria = { price: -1 };
        break;
      case "rating":
        sortCriteria = { averageRating: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }
  }

  // Execute the query to get total count and paginated products
  const [totalProducts, products] = await Promise.all([
    Product.countDocuments(filterObject),
    Product.find(filterObject)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(totalProducts / limit);

  // Send the response with products and pagination info
  return sendResponse(res, 200, "Products retrieved successfully", {
    totalProducts,
    currentPage: page,
    totalPages,
    products,
  });
});

// get product reviews

const getProductReviews = asyncHandler(async (req, res) => {
  const { id } = req.params.id;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "product not found");
  }

  return sendResponse(res, 200, "reviews retrieved successfully", {
    averageRating: product.averageRating,
    numReviews: product.numReviews,
    reviews: product.reviews,
    products,
  });
});

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
    req.files.map((file) => uploadToCloudinary(file, "products")),
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
  getAllProducts,
  getProductReviews,
  createProduct,
};
