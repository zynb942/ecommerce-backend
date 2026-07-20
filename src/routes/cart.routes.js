const express = require("express");
const router = express.Router();
const { getCart } = require("../controllers/cart.controller");
const { protect } = require("../middlewares/auth.middleware"); 

// Add secure endpoint to fetch user specific cart
router.get("/", protect, getCart);

module.exports = router;