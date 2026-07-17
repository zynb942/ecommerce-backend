const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

// get all products with filtering, search, pagination, and sorting
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
      { brand: { $regex: req.query.search, $options: "i" } }
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
      .lean()
  ]);

  const totalPages = Math.ceil(totalProducts / limit);

  // Send the response with products and pagination info
  return sendResponse(res, 200, "Products retrieved successfully", {
    totalProducts,
    currentPage: page,
    totalPages,
    products
  });
});

module.exports = {
  getAllProducts
};