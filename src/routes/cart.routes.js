const express = require("express");
const router = express.Router();

const { removeCoupon } = require("../controllers/cart.controller");
const { protect } = require("../middlewares/auth.middleware");

router.delete("/coupon", protect, removeCoupon);

module.exports = router;