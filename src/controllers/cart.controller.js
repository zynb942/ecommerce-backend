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
    cart,
  });
});

module.exports = {
  addItemToCart,
};
