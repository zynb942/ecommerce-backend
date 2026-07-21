const express = require("express");

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { addToCartSchema , applyCouponSchema ,cartProductIdSchema, updateCartItemSchema} = require("../validation/cart.validation");
const { getCart, removeCoupon , addItemToCart , applyCoupon, removeCartItem , clearCart, updateCartItem } = require("../controllers/cart.controller");

const router = express.Router();



// Get current user's cart
router.get("/", protect, getCart);

// Cart items
router.post("/items", protect, validate(addToCartSchema), addItemToCart);
  // PATCH /carts/items
router.patch('/items', protect, validate(updateCartItemSchema), updateCartItem)
router.delete("/items/:productId", protect, validate(cartProductIdSchema, "params"), removeCartItem);

//ClearCart
router.delete("/clear", protect, clearCart);

// coupon
router.post( "/coupon", protect, validate(applyCouponSchema), applyCoupon);
router.delete("/coupon", protect, removeCoupon);

module.exports = router;
