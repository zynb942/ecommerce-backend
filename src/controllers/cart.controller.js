const Cart = require("../models/cart.model");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const ApiError = require("../utils/apiError");

/**
 * desc : Get current logged-in user's cart
 * route: GET /api/v1/carts
 * access: Private
 */
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId });

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

  return sendResponse(res, 200, "cart retrieved successfully", {
    itemCount: cart.itemCount,
    subtotal: cart.subtotal,
    discountAmount: cart.discountAmount,
    total: cart.total,
    coupon: cart.coupon ? cart.coupon.code : null,
    items: cart.items,
  });
});

/**
 * desc : Remove applied coupon from user's cart
 * route: DELETE /api/v1/carts/coupon
 * access: Private
 */
const removeCoupon = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.coupon = null;

  await cart.save();

return sendResponse(res, 200, "Coupon removed", {
  subtotal: cart.subtotal,
  total: cart.total,
});
});
module.exports = {
  getCart,
  removeCoupon,
};