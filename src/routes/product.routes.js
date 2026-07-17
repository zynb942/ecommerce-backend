const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const validate = require("../middlewares/validation.middleware");
const { createProductSchema } = require("../validation/product.validation");
const { protect, allowTo } = require("../middlewares/auth.middleware");

const { createProduct } = require("../controllers/product.controller");

router.post(
  "/",
  protect,
  allowTo("admin"),
  upload.array("images", 5),
  validate(createProductSchema),
  createProduct
);

module.exports = router;
