const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getMyOrderById,
} = require("../controllers/order.controller");

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { createOrderSchema } = require("../validation/order.validation");

router.get("/my/:id", protect, getMyOrderById);
router.get("/my", protect, getMyOrders);

router.post("/", protect, validate(createOrderSchema, "body"), createOrder);

module.exports = router;