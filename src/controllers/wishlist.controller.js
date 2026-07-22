const Wishlist = require("../models/wishlist.model");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/sendResponse");
const { getPagination } = require("./helpers");
const getAllWishlists = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);

  const [totalWishlists, wishlists] = await Promise.all([
    Wishlist.countDocuments(),
    Wishlist.find()
      .populate("user")
      .populate("products")
      .skip(skip)
      .limit(limit),
  ]);
  const totalPages = Math.ceil(totalWishlists / limit);

  return sendResponse(res, 200, "Wishlists retrieved successfully", {
    totalWishlists,
    currentPage: page,
    totalPages,
    wishlists,
  });
});

module.exports = { getAllWishlists };
