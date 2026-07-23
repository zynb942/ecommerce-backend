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


/**
 * @desc Remove a product from the logged-in user's wishlist
 * @route DELETE /api/wishlists/remove/:productId
 * @access Private
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  
  const productIndex = wishlist.products.findIndex(
    (product) => product._id.toString() === productId
  );

  if (productIndex === -1) {
    throw new ApiError(404, "Product not found in wishlist");
  }

  wishlist.products.splice(productIndex, 1);
  await wishlist.save();
  await wishlist.populate("products");
  return sendResponse(
    res,
    200,
    "Product removed from wishlist successfully",
    {
      wishlist,
    }
  );
});



module.exports = {  removeFromWishlist, getAllWishlists };
