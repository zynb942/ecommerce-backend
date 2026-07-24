const Wishlist = require("../models/wishlist.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

const clearWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  wishlist.products = [];

  await wishlist.save();
  return sendResponse(res, 200, "Wishlist cleared successfully",);
});

module.exports = {
  clearWishlist,
};