const express = require("express");
const router = express.Router();

const {
  sendRegisterOTP,
  forgotPassword,
  logout,
} = require("../controllers/auth.controller");

const { protect } = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validation.middleware");

const {
  registerSchema,
  forgotPasswordSchema,
} = require("../validation/user.validation");

router.post("/register/send-otp", validate(registerSchema), sendRegisterOTP);

router.post(
  "/forgot-password/send-otp",
  validate(forgotPasswordSchema),
  forgotPassword,
);

router.post("/auth/logout", protect, logout);

module.exports = router;
