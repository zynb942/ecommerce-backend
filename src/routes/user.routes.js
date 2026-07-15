const express = require("express");
const router = express.Router();
const { addUser , getUserById} = require("../controllers/user.controller");
const { protect, allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { addUserSchema , userIdSchema} = require("../validation/user.validation");

router.post(
  "/add",
  protect,
  allowTo("admin"),
  validate(addUserSchema),
  addUser
);
router.get(
  "/:id",
  protect,
  allowTo("admin"),
  validate(userIdSchema, "params"),
  getUserById
);

module.exports = router;
