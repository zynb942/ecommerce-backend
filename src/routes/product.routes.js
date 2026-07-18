const express = require("express");
const router = express.Router();
const { getAllProducts } = require("../controllers/product.controller");
const { protect, allowTo } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { productIdSchema } = require("../validation/product.validation");
// Public Route
router.get("/", getAllProducts);

router.get(
  "/:id/reviews",
  validate(productIdSchema, "params"),
  getProductReviews,
);

module.exports = router;
