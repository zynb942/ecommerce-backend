const express = require("express");
const router = express.Router();
const { getAllProducts } = require("../controllers/product.controller");

// Public Route
router.get("/", getAllProducts);

module.exports = router;