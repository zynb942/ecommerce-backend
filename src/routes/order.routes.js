const express = require("express");
<<<<<<< HEAD

const { protect } = require("../middlewares/auth.middleware");
const { getMyOrders } = require("../controllers/order.controller");

const router = express.Router();

router.get("/my", protect, getMyOrders);
=======
const router = express.Router();
const { createOrder } = require("../controllers/order.controller");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createOrderSchema } = require("../validations/order.validation");

// Place Order route (POST /api/v1/orders)
router.post("/", protect, validate(createOrderSchema, "body"), createOrder);
>>>>>>> f35341f (fix(order): address PR review comments for validation, route path, shipping logic, and email parameters)

module.exports = router;