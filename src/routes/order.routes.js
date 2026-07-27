const express = require("express");
const router = express.Router();
const { createOrder , getMyOrders , getAllOrders , cancelMyOrder} = require("../controllers/order.controller");
const { protect , allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { createOrderSchema , getAllOrdersSchema} = require("../validation/order.validation");

router.get("/my", protect, getMyOrders);

router.get("/admin" , protect , allowTo("admin") ,validate(getAllOrdersSchema , "query") , getAllOrders);

router.patch("/my/:id/cancel", protect, cancelMyOrder);

router.post("/", protect, validate(createOrderSchema, "body"), createOrder);

module.exports = router;