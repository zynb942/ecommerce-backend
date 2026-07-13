const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model.js");
const OTP = require("../models/OTP.model.js");
const ApiError = require("../utils/apiError.js");
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

const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const otpDoc = await OTP.findOne({ email });

  if (!otpDoc) {
    return next(new ApiError(404, "Invalid or expired OTP"));
  }

  if (otpDoc.expiresAt < new Date()) {
        await OTP.deleteMany({ email }); 
        throw new ApiError(400, "OTP has expired");
    }

    if (!otpDoc.userData) {
        throw new ApiError(400, "Invalid OTP data");
    }

  const isMatch = await bcrypt.compare(otp, otpDoc.otp);

  if (!isMatch) {
    return next(new ApiError(400, "Invalid OTP code"));
  }

  const user = await User.create({
  ...otpDoc.userData,
  isVerified: true,
});

  await OTP.deleteMany({ email });
  
  return sendResponse(res, 201, "User registered and verified successfully", { user });
});

module.exports = { 
  sendRegisterOTP,
  verifyOTP 
};