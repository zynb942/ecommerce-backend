const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  if (product.stock < quantity) {
    throw new ApiError(400, "Not enough stock");
  }
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }
  const existingItem = cart.items.find(
    (item) => item.product.toString() === product._id.toString(),
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images[0].url,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      quantity,
    });
  }
  product.stock -= quantity;
  await product.save();
  await cart.save();
  return sendResponse(res, 200, "Item added to cart successfully", {
  itemCount: cart.itemCount,
  subtotal: cart.subtotal,
  discountAmount: cart.discountAmount,
  total: cart.total,
  items: cart.items,
});
});
 
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
  addItemToCart,
};
