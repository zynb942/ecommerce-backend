const express = require("express");
const router = express.Router();

const { sendRegisterOTP , login} = require("../controllers/auth.controller");
const validate = require("../middlewares/validation.middlewares");
const { registerSchema , loginSchema } = require("../validation/user.validation");
router.post(
  "/register/send-otp",
  validate(registerSchema),
  sendRegisterOTP
);

router.post(
  "/login",
  validate(loginSchema),
  login
);
module.exports = router;