const express = require("express");
const router = express.Router();

const { sendRegisterOTP } = require("../controllers/auth.controller");
const validate = require("../middlewares/validation.middlewares");
const { registerSchema } = require("../validation/user.validation");

router.post(
  "/register/send-otp",
  validate(registerSchema),
  sendRegisterOTP
);

module.exports = router;