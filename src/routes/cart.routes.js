const express = require("express");
const router = express.Router();

const { getCart, removeCoupon } = require("../controllers/cart.controller");
const { protect } = require("../middlewares/auth.middleware");

// Get current user's cart
router.get("/", protect, getCart);

// Remove applied coupon
router.delete("/coupon", protect, removeCoupon);

module.exports = router;