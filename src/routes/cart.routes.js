const express = require("express");

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { addToCartSchema , applyCouponSchema ,cartProductIdSchema, updateCartItemSchema} = require("../validation/cart.validation");
const { getCart, removeCoupon , addItemToCart , applyCoupon, removeCartItem , clearCart, updateCartItem } = require("../controllers/cart.controller");

const router = express.Router();



router.get("/", protect, getCart);

router.post("/items", protect, validate(addToCartSchema), addItemToCart);
router.patch('/items', protect, validate(updateCartItemSchema), updateCartItem)
router.delete("/items/:productId", protect, validate(cartProductIdSchema, "params"), removeCartItem);

router.delete("/clear", protect, clearCart);

router.post( "/coupon", protect, validate(applyCouponSchema), applyCoupon);
router.delete("/coupon", protect, removeCoupon);

module.exports = router;
