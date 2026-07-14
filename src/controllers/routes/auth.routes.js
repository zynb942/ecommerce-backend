const express = require("express");
const router = express.Router();

const { sendRegisterOTP, verifyOTP, forgotPassword } = require("../controllers/auth.controller");
const validate = require("../middlewares/validation.middlewares");
const { registerSchema, verifyOtpSchema,forgotPasswordSchema } = require("../validation/user.validation");

router.post(
  "/register/send-otp",
  validate(registerSchema),
  sendRegisterOTP
);

router.post(
  "/register/verify-otp",
  validate(verifyOtpSchema),
  verifyOTP
);

router.post(
  "/forgot-password/send-otp",
  validate(forgotPasswordSchema),
  forgotPassword
);
module.exports = router;