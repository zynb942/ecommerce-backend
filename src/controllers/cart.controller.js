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
  let cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name price images stock category brand",
  });

  // If no cart exists, return an empty cart template matching structural schemas
  if (!cart) {
    return sendResponse(res, 200, "cart retrieved successfully", {
      user: userId,
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
    _id: cart._id,
    user: cart.user,
    items: cart.items,
    coupon: cart.coupon,
    subtotal: cart.subtotal,
    discountAmount: cart.discountAmount,
    total: cart.total,
    itemCount: cart.itemCount,
  });
});

module.exports = {
  getCart,
};
