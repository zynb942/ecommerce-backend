const express = require("express");
const router = express.Router();

const { sendRegisterOTP, verifyOTP } = require("../controllers/auth.controller");
const validate = require("../middlewares/validation.middlewares");
const { registerSchema, verifyOtpSchema } = require("../validation/user.validation");

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

module.exports = router;