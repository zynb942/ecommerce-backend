const express = require("express");
const router = express.Router();

const {
  sendRegisterOTP,
  forgotPassword,
} = require("../controllers/auth.controller");

const validate = require("../middlewares/validation.middleware");

const {
  registerSchema,
  forgotPasswordSchema,
} = require("../validation/user.validation");

router.post(
  "/register/send-otp",
  validate(registerSchema),
  sendRegisterOTP
);

router.post(
  "/forgot-password/send-otp",
  validate(forgotPasswordSchema),
  forgotPassword
);

module.exports = router;