const express = require("express");
const router = express.Router();

const { createOrder, getMyOrders } = require("../controllers/order.controller");
const { getActiveCarts } = require("../controllers/admin-cart.controller");
const { protect, allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { createOrderSchema } = require("../validation/order.validation");

router.get("/my", protect, getMyOrders);
router.post("/", protect, validate(createOrderSchema, "body"), createOrder);
router.get("/admin/carts", protect, allowTo("admin"), getActiveCarts);

module.exports = router;