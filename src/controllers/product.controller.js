const Product = require("../models/product.model");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/sendResponse");
const { getSortQuery, getPagination, addRegexFilter, addTagsFilter, addPriceFilter } = require('./helpers.js')


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
  let sortCriteria = { createdAt: -1 }; 

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

/**
 * @desc Add a review to a product
 * @route POST /api/products/:id/reviews
 * @access Private
 */
const addReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    throw new ApiError(400, "Already reviewed");
  }

  const review = {
    user: req.user._id,
    username: req.user.username,
    rating,
    comment,
  };

  product.reviews.push(review);
  product.calcAverageRating();

  await product.save();

  const createdReview = product.reviews[product.reviews.length - 1];

  return sendResponse(res, 201, "Review added successfully", {
    review: createdReview,
    averageRating: product.averageRating,
    numReviews: product.numReviews,
  });
});



//#region Search Products Controller
/**
 * @description Search & filter Products
 * @route GET /products/search
 * @access Public
 * @param { Object } Express request object
 * @param { Object } Express response object
 * @param { NextFunction } Express next middleware function for error handling
 * @returns { Promise<object> } Express response JSON object with products and pagination data
 */
const searchProducts = asyncHandler(async (request, response)=>{
  const { search, category, subcategory, brand, tags, minPrice,
    maxPrice, sort, page = 1, limit = 10 } = request.query
  
  // Only active products
  const filter = { isActive: true }

  // Text Search Filter ($or with case-insensitive regex)
  if(search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' }},
      { description: { $regex: search, $options: 'i' }},
      { brand: { $regex: search, $options: 'i' }}
    ]
  }

  // Regex filters
  addRegexFilter(filter, 'category', category)
  addRegexFilter(filter, 'subcategory', subcategory)
  addRegexFilter(filter, 'brand', brand)
  

  // Tags Filter & convert string Text to Array: 'wireless,audio' => ['wireless', 'audio']
  addTagsFilter(filter, tags)
  addPriceFilter(filter, minPrice, maxPrice)

  // Resolve Sorting Query using the local helper
  const sortQuery = getSortQuery(sort)

  // Pagination Setup
  const { currentPage, limitPerPage, skip } = getPagination(page, limit)

  // Fetch products (Optimized with lean())
  const [totalProducts, products] = await Promise.all([
    Product.countDocuments(filter), 
    Product.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitPerPage)
      .lean()
  ])

  const totalPages = Math.ceil(totalProducts / limitPerPage)

  return sendResponse(response, 200, 'Products fetched successfully..', {
    totalProducts,
    currentPage,
    totalPages, 
    products
  })
})
//#endregion

module.exports = {
  getAllProducts,
  getProductReviews,
  createProduct,
  addReview,
  searchProducts
};