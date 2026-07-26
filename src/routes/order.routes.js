const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const {
  createOrderSchema,
  updateOrderStatusSchema,
} = require("../validation/order.validation");

router.get("/my", protect, getMyOrders);

router.post("/", protect, validate(createOrderSchema, "body"), createOrder);

router.patch(
  "/:id/status",
  protect,
  allowTo("admin"),
  validate(updateOrderStatusSchema, "body"),
  updateOrderStatus,
);

module.exports = router;
