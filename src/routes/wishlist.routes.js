const express = require("express");
const router = express.Router();
const {
  getAllWishlists,
  addToWishlist,
} = require("../controllers/wishlist.controller");
const { productIdSchema } = require("../validation/wishlist.validation");
const { protect, allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
router.get("/admin/all", protect, allowTo("admin"), getAllWishlists);
router.post(
  "/add/:productId",
  protect,
  validate(productIdSchema, "params"),
  addToWishlist
);
module.exports = router;
