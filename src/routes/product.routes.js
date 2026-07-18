const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");

const {
  getAllProducts,
  getProductReviews,
  createProduct,
  updateProduct,
} = require("../controllers/product.controller");

const { protect, allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");

const {
  productIdSchema,
  createProductSchema,
  updateProductSchema,
} = require("../validation/product.validation");
// Public Route
router.get("/", getAllProducts);

router.get(
  "/:id/reviews",
  validate(productIdSchema, "params"),
  getProductReviews,
);

router.post(
  "/",
  protect,
  allowTo("admin"),
  upload.array("images", 5),
  validate(createProductSchema),
  createProduct,
);

router.patch(
  "/update/:id",
  protect,
  allowTo("admin"),
  upload.array("images", 5),
  validate(productIdSchema, "params"),
  validate(updateProductSchema),
  updateProduct
);

module.exports = router;
