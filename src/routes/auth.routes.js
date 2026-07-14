const express = require("express");
const router = express.Router();

const {
  sendRegisterOTP,
  forgotPassword,
  changeRole
} = require("../controllers/auth.controller");

const validate = require("../middlewares/validation.middleware");
const { protect, allowTo } = require("../middlewares/auth.middleware"); 

const {
  registerSchema,
  forgotPasswordSchema,
  changeRoleSchema
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
router.patch(
  "/change-role",
  protect,             
  allowTo("admin"),   
  validate(changeRoleSchema), 
  changeRole           
);

module.exports = router;