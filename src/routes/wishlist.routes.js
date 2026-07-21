const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { productIdSchema } = require("../validation/wishlist.validation");
const { removeFromWishlist } = require("../controllers/wishlist.controller");

router.delete(
  "/remove/:productId",
  protect,
  validate(productIdSchema, "params"),
  removeFromWishlist
);

module.exports = router;