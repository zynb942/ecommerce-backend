const express = require('express')
const router = express.Router()

const validate = require("../middlewares/validation.middleware");
const { protect, allowTo } = require("../middlewares/auth.middleware");


const {
  sendRegisterOTP,
  forgotPassword,
  resetPassword,
  adminTest,
} = require("../controllers/auth.controller");


const {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validation/user.validation");




// resetting password route
router.post('/forgot-password/verify-otp', validate(resetPasswordSchema), resetPassword)


router.post("/register/send-otp", validate(registerSchema), sendRegisterOTP);

router.post(
  "/forgot-password/send-otp",
  validate(forgotPasswordSchema),
  forgotPassword,
);

router.get("/admin-test", protect, allowTo("admin"), adminTest);

module.exports = router;
