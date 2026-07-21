const express = require("express");

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");

const { addToCartSchema } = require("../validation/cart.validation");

const router = express.Router();

const { getCart, removeCoupon , addItemToCart, clearCart } = require("../controllers/cart.controller");


// Get current user's cart
router.get("/", protect, getCart);

router.post("/items", protect, validate(addToCartSchema), addItemToCart);

// Remove applied coupon
router.delete("/coupon", protect, removeCoupon);

//ClearCart
router.delete("/clear", protect, clearCart);

module.exports = router;
