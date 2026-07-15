const express = require("express");
const router = express.Router();
const { addUser } = require("../controllers/user.controller");
const { protect, allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { addUserSchema } = require("../validation/user.validation");

router.post(
  "/add",
  protect,
  allowTo("admin"),
  validate(addUserSchema),
  addUser
);

module.exports = router;
