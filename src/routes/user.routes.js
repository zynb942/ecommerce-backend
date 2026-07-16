const express = require("express");
const router = express.Router();
const {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { protect, allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const {
  addUserSchema,
  updateUserSchema,
  userIdSchema,
} = require("../validation/user.validation");

router.post(
  "/add",
  protect,
  allowTo("admin"),
  validate(addUserSchema),
  addUser,
);

router.get("/all", protect, allowTo("admin"), getAllUsers);

router.patch("/:id", protect, validate(updateUserSchema), updateUser);

router.delete(
  "/:id",
  protect,
  allowTo("admin"),
  validate(userIdSchema),
  deleteUser,
);

module.exports = router;
