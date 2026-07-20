const express = require("express");

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");

const { addToCartSchema } = require("../validation/cart.validation");
const { addItemToCart } = require("../controllers/cart.controller");

const router = express.Router();

router.post("/items", protect, validate(addToCartSchema), addItemToCart);

module.exports = router;
