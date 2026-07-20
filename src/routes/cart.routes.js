const express = require("express");
const router = express.Router();
const { getCart, applyCoupon } = require("../controllers/cart.controller");
const { applyCouponSchema } = require("../validation/cart.validation");
const { protect } = require("../middlewares/auth.middleware"); 
const validate = require("../middlewares/validation.middleware");
// Add secure endpoint to fetch user specific cart
router.get("/", protect, getCart);

router.post(
  "/coupon",
  protect,
  validate(applyCouponSchema),
  applyCoupon
);
module.exports = router;