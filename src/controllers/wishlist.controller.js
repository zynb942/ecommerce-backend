const Wishlist = require("../models/wishlist.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

/**
 * @desc Remove a product from the logged-in user's wishlist
 * @route DELETE /api/wishlists/remove/:productId
 * @access Private
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  //  Find the wishlist for the current user
  const wishlist = await Wishlist.findOne({ user: userId });

  //  If no wishlist exists, return 404
  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  //  Check if the product exists in the wishlist
  const productIndex = wishlist.products.findIndex(
    (product) => product._id.toString() === productId
  );

  //  If product is not found, return 404
  if (productIndex === -1) {
    throw new ApiError(404, "Product not found in wishlist");
  }

  //  Remove the product from the wishlist
  wishlist.products.splice(productIndex, 1);

  //  Save the updated wishlist
  await wishlist.save();
  //  Return success response
  return sendResponse(
    res,
    200,
    "Product removed from wishlist successfully",
    {
      wishlist,
    }
  );
});

module.exports = {
  removeFromWishlist,
};
