const express = require("express");
const router = express.Router();

const {
  sendRegisterOTP,
  verifyOTP,
  forgotPassword,
  login,
  logout,
  resetPassword,
  adminTest,
  changeRole,
} = require("../controllers/auth.controller");

const { protect } = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validation.middleware");
const { protect, allowTo } = require("../middlewares/auth.middleware");

const {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changeRoleSchema,
} = require("../validation/user.validation");

// ==================== Public Routes ====================

router.post("/register/send-otp", validate(registerSchema), sendRegisterOTP);

router.post("/register/verify-otp", validate(verifyOtpSchema), verifyOTP);

router.post("/forgot-password/send-otp", validate(forgotPasswordSchema), forgotPassword);

router.post("/forgot-password/verify-otp", validate(resetPasswordSchema), resetPassword);

router.post("/auth/logout", protect, logout);

router.post("/login", validate(loginSchema), login);

// ==================== Protected Admin Routes ====================

router.patch(
  "/change-role",
  protect,
  allowTo("admin"),
  validate(changeRoleSchema),
  changeRole
);

router.get("/admin-test", protect, allowTo("admin"), adminTest);

module.exports = router;
