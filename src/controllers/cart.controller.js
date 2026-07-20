const Cart = require("../models/cart.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const removeCoupon = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.coupon = null;

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Coupon removed successfully",
    data: cart,
  });
});

module.exports = {
  removeCoupon,
};