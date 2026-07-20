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
/**
 * @desc Apply coupon to cart
 * @route POST /api/v1/carts/coupon
 * @access Private
 */
const applyCoupon = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { code } = req.body;

  // Find user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Ensure cart is not empty
  if (!cart.items || cart.items.length === 0) {
    throw new ApiError(400, "Cannot apply coupon to empty cart");
  }

  // Normalize coupon code
  const normalizedCode = code.toUpperCase();

  // Supported coupons
  const coupons = {
    SAVE10: {
      discountType: "percentage",
      discountValue: 10,
    },
    SAVE20: {
      discountType: "percentage",
      discountValue: 20,
    },
    SAVE50: {
      discountType: "percentage",
      discountValue: 50,
    },
    SAVE80: {
      discountType: "percentage",
      discountValue: 80,
    },
    OFF50: {
      discountType: "fixed",
      discountValue: 50,
    },
  };

  // Validate coupon
  const couponData = coupons[normalizedCode];

  if (!couponData) {
    throw new ApiError(400, "Invalid or expired coupon code");
  }

  // Apply coupon
  cart.coupon = {
    code: normalizedCode,
    discountType: couponData.discountType,
    discountValue: couponData.discountValue,
  };

  await cart.save();

  return sendResponse(
    res,
    200,
    "Coupon applied successfully",
    {
      coupon: cart.coupon,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      total: cart.total,
      itemCount: cart.itemCount,
      items: cart.items,
    }
  );
});
module.exports = {
  getCart,
  applyCoupon,
};
