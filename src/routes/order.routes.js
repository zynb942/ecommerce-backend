const express = require("express");
const router = express.Router();
const { createOrder , getMyOrders,cancelMyOrder} = require("../controllers/order.controller");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { createOrderSchema } = require("../validation/order.validation");

router.get("/my", protect, getMyOrders);

router.patch("/my/:id/cancel", protect, cancelMyOrder);

router.post("/", protect, validate(createOrderSchema, "body"), createOrder);

module.exports = router;