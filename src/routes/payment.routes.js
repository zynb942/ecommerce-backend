const express = require("express");

const { protect } = require("../middlewares/auth.middleware");
const { createPaymentIntent } = require("../controllers/payment.controller");

const router = express.Router();

router.post(
  "/create-intent/:orderId",
  protect,
  createPaymentIntent
);

module.exports = router;