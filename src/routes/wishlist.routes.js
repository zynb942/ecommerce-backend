const express = require("express");
const router = express.Router();
const { getAllWishlists } = require("../controllers/wishlist.controller");
const [protect, allowTo] = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");

router.get("/admin/all", protect, allowTo("admin"), getAllWishlists);

module.exports = router;
