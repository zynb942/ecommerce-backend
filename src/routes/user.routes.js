const express = require("express");
const router = express.Router();
const {
  addUser,
  getAllUsers,
   updateUser,
} = require("../controllers/user.controller");
const { protect, allowTo } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { addUserSchema ,updateUserSchema } = require("../validation/user.validation");

router.post(
  "/add",
  protect,
  allowTo("admin"),
  validate(addUserSchema),
  addUser
);

router.get(
  "/all",
  protect,
  allowTo("admin"),
  getAllUsers
);

router.patch("/:id", protect, validate(updateUserSchema), updateUser);


module.exports = router;
