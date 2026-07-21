const express = require("express");

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");

const { addToCartSchema , applyCouponSchema} = require("../validation/cart.validation");

const router = express.Router();

const { getCart, removeCoupon , addItemToCart , applyCoupon} = require("../controllers/cart.controller");


// Get current user's cart
router.get("/", protect, getCart);

router.post("/items", protect, validate(addToCartSchema), addItemToCart);

// Remove applied coupon
router.delete("/coupon", protect, removeCoupon);

router.post( "/coupon", protect, validate(applyCouponSchema), applyCoupon);

module.exports = router;
