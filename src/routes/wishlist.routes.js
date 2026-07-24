const express = require("express");
const { protect , allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { productIdSchema } = require("../validation/wishlist.validation");
const { addToWishlist, getMyWishlist, removeFromWishlist , getAllWishlists  } = require("../controllers/wishlist.controller");
const { clearWishlist } = require("../controllers/wishlist.controller");


const router = express.Router();


router.delete(
  "/remove/:productId",
  protect,
  validate(productIdSchema, "params"),
  removeFromWishlist
);

router.delete(
  "/clear", 
  protect, 
  clearWishlist);


router.post(
  "/add/:productId",
  protect,
  validate(productIdSchema, "params"),
  addToWishlist
);

router.get("/admin/all", protect, allowTo("admin"), getAllWishlists);

router.get("/my", protect, getMyWishlist);

module.exports = router;
