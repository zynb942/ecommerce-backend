const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const {
  getAllProducts,
  getProductReviews,
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  addReview,
  searchProducts,
  deleteReview,
} = require("../controllers/product.controller");

const { protect, allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");

const {
  productIdSchema,
  createProductSchema,
  updateProductSchema,
  addReviewSchema,
  reviewIdSchema,
} = require("../validation/product.validation");

// Public Route
router.get("/", getAllProducts);

// GET /products/search
router.get("/search", searchProducts);

router.get(
  "/:id/reviews",
  validate(productIdSchema, "params"),
  getProductReviews,
);

router.get("/:id", validate(productIdSchema, "params"), getProductById);

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
  updateProduct,
);

router.post(
  "/:id/reviews",
  protect,
  validate(productIdSchema, "params"),
  validate(addReviewSchema),
  addReview,
);

router.delete(
  "/:id",
  protect,
  allowTo("admin"),
  validate(productIdSchema, "params"),
  deleteProduct,
);

router.delete(
  "/:id/reviews/:reviewId",
  protect,
  validate(productIdSchema, "params"),
  validate(reviewIdSchema, "params"),
  deleteReview,
);

module.exports = router;
