const Cart = require("../models/cart.model");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const ApiError = require("../utils/apiError");

/**
 desc :    Get current logged-in user's cart
 route:   GET /api/v1/carts
 access:  Private
 */
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Read the authenticated user's ID from req.user

  // Find the cart belonging to the user and populate product details within item array
  let cart = await Cart.findOne({ user: userId });

  // If no cart exists, return an empty cart template matching structural schemas
  if (!cart) {
    return sendResponse(res, 200, "cart retrieved successfully", {
      items: [],
      coupon: null,
      subtotal: 0,
      discountAmount: 0,
      total: 0,
      itemCount: 0,
    });
  }

  // Return existing cart populated.
  return sendResponse(res, 200, "cart retrieved successfully", {
    itemCount: cart.itemCount,
    subtotal: cart.subtotal,
    discountAmount: cart.discountAmount,
    total: cart.total,
    coupon: cart.coupon ? cart.coupon.code : null, 
    items: cart.items

  });
});

module.exports = {
  getCart,
};
