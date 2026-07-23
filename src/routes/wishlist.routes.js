const express = require("express");

const router = express.Router();

const {
  getAllWishlists,
  getMyWishlist,
} = require("../controllers/wishlist.controller");

const {
  protect,
  allowTo,
} = require("../middlewares/auth.middleware");

router.get("/admin/all", protect, allowTo("admin"), getAllWishlists);

router.get("/my", protect, getMyWishlist);

module.exports = router;