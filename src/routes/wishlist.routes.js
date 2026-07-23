const express = require("express");

const router = express.Router();

const { protect , allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { productIdSchema } = require("../validation/wishlist.validation");
const { getMyWishlist, removeFromWishlist , getAllWishlists, getWishlistStats  } = require("../controllers/wishlist.controller");


router.get("/admin/all", protect, allowTo("admin"), getAllWishlists);

// GET /api/wihshlists/admin/stats
router.get('/admin/stats', protect, allowTo('admin'), getWishlistStats)

router.get("/my", protect, getMyWishlist);

router.delete(
  "/remove/:productId",
  protect,
  validate(productIdSchema, "params"),
  removeFromWishlist
);



module.exports = router;