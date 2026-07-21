const express = require("express");

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");

const {
  addToCartSchema,
  cartProductIdSchema,
} = require("../validation/cart.validation");

const router = express.Router();

const {
  getCart,
  removeCoupon,
  addItemToCart,
  removeCartItem,
} = require("../controllers/cart.controller");


// Get current user's cart
router.get("/", protect, getCart);

router.post("/items", protect, validate(addToCartSchema), addItemToCart);

router.delete(
  "/items/:productId",
  protect,
  validate(cartProductIdSchema, "params"),
  removeCartItem
);

// Remove applied coupon
router.delete("/coupon", protect, removeCoupon);

module.exports = router;
