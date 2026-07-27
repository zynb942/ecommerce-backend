const express = require("express");
const router = express.Router();
const { createOrder , getMyOrders} = require("../controllers/order.controller");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { createOrderSchema } = require("../validation/order.validation");
const { protect, allowTo } = require("../middlewares/auth.middleware");
const { getAdminOrderById } = require("../controllers/order.controller");

router.get("/admin/:id", protect, allowTo("admin"), getAdminOrderById);
router.get("/my", protect, getMyOrders);

router.post("/", protect, validate(createOrderSchema, "body"), createOrder);

module.exports = router;