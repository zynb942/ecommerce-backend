const crypto = require("crypto");
const User = require("../models/User");
const OTP = require("../models/OTP");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const sendEmail = require("../utils/sendEmail");
const { registerSchema } = require("../validation/auth.validation");

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendRegisterOTP = asyncHandler(async (req, res, next) => {
  
  const { error, value } = registerSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    throw new ApiError(400, message);
  }

  const { username, email, password } = value;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 دقايق

  await OTP.deleteMany({ email });

  await OTP.create({
    email,
    otp,
    expiresAt,
    userData: { username, email, password }, // password هيتشفّر لما نعمل User.create وقت الـ verify
  });

  await sendEmail({
    to: email,
    subject: "Verify your account - OTP Code",
    html: `<h2>Your verification code is: ${otp}</h2><p>This code expires in 10 minutes.</p>`,
  });

  sendResponse(res, 200, "OTP sent to your email successfully");
});

module.exports = { sendRegisterOTP };