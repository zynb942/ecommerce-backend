const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const { getAllProducts,getProductReviews } = require("../controllers/product.controller");
const { protect, allowTo } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { productIdSchema } = require("../validation/product.validation");
// Public Route
router.get("/", getAllProducts);

router.get(
  "/:id/reviews",
  validate(productIdSchema, "params"),
  getProductReviews,
=======

const upload = require("../middlewares/upload.middleware");
const validate = require("../middlewares/validation.middleware");
const { createProductSchema } = require("../validation/product.validation");
const { protect, allowTo } = require("../middlewares/auth.middleware");

const { createProduct , getAllProducts } = require("../controllers/product.controller");

router.get("/", getAllProducts);

router.post(
  "/",
  protect,
  allowTo("admin"),
  upload.array("images", 5),
  validate(createProductSchema),
  createProduct
>>>>>>> 3d569624e826fb4bb7e77d19fb248066fff44ab7
);

module.exports = router;
