const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const OTP = require("../models/OTP");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const sendEmail = require("../utils/sendEmail");

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendRegisterOTP = asyncHandler(async (req, res, next) => {
  // Validation بقت في الـ middleware
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const otp = generateOTP();
  const hashedOTP = await bcrypt.hash(otp, 10);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OTP.deleteMany({ email });

  let otpDoc;

  try {
    otpDoc = await OTP.create({
      email,
      otp: hashedOTP,
      expiresAt,
      userData: {
        username,
        email,
        password,
      },
    });

    await sendEmail({
      to: email,
      subject: "Verify your account - OTP Code",
      html: `<h2>Your verification code is: ${otp}</h2><p>This code expires in 10 minutes.</p>`,
    });
  } catch (error) {
    if (otpDoc) {
      await OTP.findByIdAndDelete(otpDoc._id);
    }

    throw error;
  }

  return sendResponse(
    res,
    200,
    "OTP sent to your email successfully"
  );
});

module.exports = { sendRegisterOTP };