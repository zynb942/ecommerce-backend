const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return sendResponse(res, 200, "Login successful", {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});
module.exports = { sendRegisterOTP , login};