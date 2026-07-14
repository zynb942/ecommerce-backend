const express = require('express')
const router = express.Router()

const validate = require("../middlewares/validation.middleware");
const { protect, allowTo } = require("../middlewares/auth.middleware");


const {
  sendRegisterOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  adminTest,
  login,
} = require("../controllers/auth.controller");


const {
  registerSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} = require("../validation/user.validation");


router.post("/register/send-otp", validate(registerSchema), sendRegisterOTP);

router.post(
    "/register/verify-otp",
    validate(verifyOtpSchema),
    verifyOTP
);

router.post(
  "/forgot-password/send-otp",
  validate(forgotPasswordSchema),
  forgotPassword,
);
router.post("/login", validate(loginSchema), login);
// resetting password route
router.post('/forgot-password/verify-otp', validate(resetPasswordSchema), resetPassword)

router.get("/admin-test", protect, allowTo("admin"), adminTest);

module.exports = router;
