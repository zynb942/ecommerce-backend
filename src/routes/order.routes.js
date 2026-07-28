const express = require("express");
const router = express.Router();
const {updateOrderStatus , getAdminOrderById , getMyOrderById, createOrder , getMyOrders , getAllOrders , cancelMyOrder} = require("../controllers/order.controller");
const { getActiveCarts } = require("../controllers/admin-cart.controller");
const { protect , allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { updateOrderStatusSchema, createOrderSchema , getAllOrdersSchema} = require("../validation/order.validation");

router.get("/my/:id", protect, getMyOrderById);

router.get("/admin/:id", protect, allowTo("admin"), getAdminOrderById);
router.get("/my", protect, getMyOrders);

router.get("/admin" , protect , allowTo("admin") ,validate(getAllOrdersSchema , "query") , getAllOrders);

router.patch("/my/:id/cancel", protect, cancelMyOrder);

router.post("/", protect, validate(createOrderSchema, "body"), createOrder);
router.get("/admin/carts", protect, allowTo("admin"), getActiveCarts);

router.patch(
  "/:id/status",
  protect,
  allowTo("admin"),
  validate(updateOrderStatusSchema, "body"),
  updateOrderStatus,
);

module.exports = router;
