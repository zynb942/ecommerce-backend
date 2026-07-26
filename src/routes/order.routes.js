const express = require("express");
// must be orderRoutes not router
const router = express.Router();
const { createOrder , getMyOrders} = require("../controllers/order.controller");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { createOrderSchema } = require("../validation/order.validation");

// must be orderRoutes not router
router.get("/my", protect, getMyOrders);
// must be orderRoutes not router
router.post("/", protect, validate(createOrderSchema, "body"), createOrder);
// must be orderRoutes not router
orderRouter.get("/admin/carts", protect, allowTo("admin"), getActiveCarts);
// must be orderRoutes
module.exports = router;