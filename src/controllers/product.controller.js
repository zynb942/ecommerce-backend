const Product = require("../models/product.model");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("../config/cloudinary");
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
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "product not found");
  }

  return sendResponse(res, 200, "reviews retrieved successfully", {
    averageRating: product.averageRating,
    numReviews: product.numReviews,
    reviews: product.reviews,
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

const getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("createdBy", "username email avatar");
  
    if (!product) {
    throw new ApiError(404, "Product not found");
  }
  
   return sendResponse(res, 200,"Product retrieved successfully", { product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
   const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

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
    deletedImages,
  } = req.body;

  // convert tags to array
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

  // update only sent fields
  product.name = name ?? product.name;
  product.shortDescription = shortDescription ?? product.shortDescription;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.discountPrice = discountPrice ?? product.discountPrice;
  product.stock = stock ?? product.stock;
  product.sku = sku ?? product.sku;
  product.category = category ?? product.category;
  product.subcategory = subcategory ?? product.subcategory;
  product.brand = brand ?? product.brand;
  product.tags = tags ?? product.tags;
  product.featured = featured ?? product.featured;
  product.isActive = isActive ?? product.isActive;
  
   // upload new images  
  if (req.files && req.files.length > 0) {
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file, "products"))
    );

    product.images.push(...uploadedImages);
  }
 
  // delete selected images
  let imagesToDelete = deletedImages;

  if (typeof imagesToDelete === "string") {
  try {
    imagesToDelete = JSON.parse(imagesToDelete);
  } catch {
    throw new ApiError(
      400,
      "deletedImages must be a valid JSON array"
    );
  }
}
if (Array.isArray(imagesToDelete)) {
  for (const publicId of imagesToDelete) {
    const imageExists = product.images.some(
      (img) => img.public_id === publicId
    );

    if (!imageExists) continue;

    await cloudinary.uploader.destroy(publicId);

    product.images = product.images.filter(
      (img) => img.public_id !== publicId
    );
  }
}
  
   if ( product.discountPrice > product.price) {
  throw new ApiError(
    400,
    "Discount price cannot exceed product price"
  );
}

  if (product.images.length === 0) {
  throw new ApiError(
    400,
    "Product must have at least one image"
  );
}

  await product.save();

  return sendResponse(res, 200, "Product updated successfully", {
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
        rating: req.body.rating,
        comment: req.body.comment,
    };

    product.reviews.push(review);

    product.calcAverageRating();

    await product.save();

  return sendResponse(res, 201, "Review added successfully", {
        review,
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



/**
 * @desc Delete product by ID (Admin only)
 * @route DELETE /api/products/:id
 * @access Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  // Get product id from request params
  const { id } = req.params;

  // Check if product exists
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Delete all product images from Cloudinary first
  if (product.images?.length) {
    try {
      await Promise.all(
        product.images.map((image) =>
          cloudinary.uploader.destroy(image.public_id)
        )
      );
    } catch (error) {
      console.error(error);
      throw new ApiError(500, "Failed to delete product images");
    }
  }

  // Delete product from database
  await product.deleteOne();

  // Return success response
  return sendResponse(res, 200, "Product deleted successfully");
});
module.exports = {
  getAllProducts,
  getProductReviews,
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  addReview,
  searchProducts
};
