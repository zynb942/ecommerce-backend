const express = require("express");
const router = express.Router();
const { sendRegisterOTP } = require("../controllers/auth.controller");

router.post("/register/send-otp", sendRegisterOTP);

module.exports = router;