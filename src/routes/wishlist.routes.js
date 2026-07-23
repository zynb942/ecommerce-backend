const express = require("express");
const router = express.Router();

const { protect , allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { productIdSchema } = require("../validation/wishlist.validation");
const { removeFromWishlist , getAllWishlists  } = require("../controllers/wishlist.controller");

router.delete(
  "/remove/:productId",
  protect,
  validate(productIdSchema, "params"),
  removeFromWishlist
);

router.get("/admin/all", protect, allowTo("admin"), getAllWishlists);

module.exports = router;
