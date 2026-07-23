const express = require("express");

const { protect } = require("../middlewares/auth.middleware");
const { getMyOrders } = require("../controllers/order.controller");

const router = express.Router();

router.get("/my", protect, getMyOrders);

module.exports = router;