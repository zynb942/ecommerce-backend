const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { clearWishlist } = require("../controllers/wishlist.controller");

const router = express.Router();

// Clear user's wishlist
router.delete("/clear", protect, clearWishlist);

module.exports = router;