const express = require("express");
const router = express.Router();

const { sendRegisterOTP } = require("../controllers/auth.controller");
const validate = require("../middleware/validation.middleware");
const { registerSchema } = require("../validation/auth.validation");

router.post(
  "/register/send-otp",
  validate(registerSchema),
  sendRegisterOTP
);

module.exports = router;