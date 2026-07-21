const mongoose = require("mongoose")
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
 * @desc Get current logged-in user's cart
 * @access Private
 * @route GET /api/v1/carts
 */
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Read the authenticated user's ID from req.user

  // Find the cart belonging to the user
  let cart = await Cart.findOne({ user: userId });

  // If no cart exists, return an empty cart template
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

  // Return existing cart
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
 * @desc Remove applied coupon from user's cart
 * @access Private
 * @route DELETE /api/v1/carts/coupon
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
const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    throw new ApiError(404, "Item not found in cart");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.stock += item.quantity;
  await product.save();

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();

  return sendResponse(res, 200, "Item removed from cart successfully",  {
        itemCount: cart.itemCount,
        subtotal: cart.subtotal,
        discountAmount: cart.discountAmount,
        total: cart.total,
        coupon: cart.coupon?.code || null,
        items: cart.items,
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
    `Coupon applied - you save ${
    cart.coupon.discountType === "percentage"
      ? `${cart.coupon.discountValue}%`
      : cart.coupon.discountValue
  }`,
    {
  itemCount: cart.itemCount,
  subtotal: cart.subtotal,
  discountAmount: cart.discountAmount,
  total: cart.total,
  coupon: cart.coupon.code, 
}
  );
});


 /**
 * @desc Clear user's cart and restore product stocks
 * @route DELETE /api/carts/clear
 * @access Private
 */
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
   const cart = await Cart.findOne({  user: userId });

    if (!cart) {
        return next(
            new ApiError(404, "Cart not found")
        );
    }
  
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  cart.items = [];
  cart.coupon = null;

  await cart.save();

  return sendResponse(res, 200, "Cart cleared successfully");
});


//#region Update Cart Item Quantity
/**
 * @description Update quantity of an item in the user's cart
 * @route PATCH /carts/items
 * @access PRIVATE
 * @param { Object } Express request object
 * @param { Object } Express response object
 * @param { NextFunction } Express next middleware function for error handling
 * @returns { Object } Success message after updating cart item
 */
const updateCartItem = asyncHandler(async (request, response, next)=>{
  const { productId, quantity: newQuantity } = request.body
  const userId = request.user.id

  // Start MongoDB Session and Transaction (to ensure atomic updates between product and cart)
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    // Find user cart with active session
    const cart = await Cart.findOne({ user: userId }).session(session)
    if (!cart) {
      await session.abortTransaction()
      session.endSession()
      return sendResponse(response, 404, "Cart not found.")
    }
    // Find cart item index
    const itemIndex = findCartItemIndex(cart, productId);
    if (itemIndex === -1) {
      await session.abortTransaction()
      session.endSession()
      return sendResponse(response, 404, "Item not found in cart.")
    }

    const currentItem = cart.items[itemIndex]
    const oldQuantity = currentItem.quantity

    // Find product with active session
    const product = await Product.findById(productId).session(session)
    if (!product) {
      await session.abortTransaction()
      session.endSession()
      return sendResponse(response, 404, "Product not found.")
    }

    // Update stock and cart item quantity
    updateProductStock(product, oldQuantity, newQuantity)
    currentItem.quantity = newQuantity

    await product.save({ session })
    await cart.save({ session })

    // Commit transaction and end session
    await session.commitTransaction()
    session.endSession()

    return sendResponse(response, 200, 'Cart item quantity updated successfully..', {
      itemCount: cart.itemCount,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      total: cart.total,
      coupon: cart.coupon?.code || null,
      items: cart.items
    })
  }catch (error) {
    // Abort transaction on any failure
    await session.abortTransaction()
    session.endSession()
    throw new ApiError(500, error.message || "Transaction failed")
  }
})
//#endregion



module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
};
