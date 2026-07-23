const Wishlist = require("../models/wishlist.model");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/sendResponse");
const { getPagination } = require("./helpers");

const getAllWishlists = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);

  const [totalWishlists, wishlists] = await Promise.all([
    Wishlist.countDocuments(),
    Wishlist.find().populate("products").skip(skip).limit(limit),
  ]);

  const totalPages = Math.ceil(totalWishlists / limit);

  return sendResponse(res, 200, "Wishlists retrieved successfully", {
    totalWishlists,
    currentPage: page,
    totalPages,
    wishlists,
  });
});

const getMyWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({
    user: req.user._id,
  }).populate("products");

  if (!wishlist) {
    return next(new ApiError(404, "Wishlist not found"));
  }

  return sendResponse(res, 200, "Wishlist retrieved successfully", {
    totalProducts: wishlist.products.length,
    wishlist,
  });
});

module.exports = {
  getAllWishlists,
  getMyWishlist,
};