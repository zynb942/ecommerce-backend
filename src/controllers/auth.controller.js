const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model.js");
const OTP = require("../models/OTP.model.js");
const ApiError = require("../utils/apiError.js");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const sendEmail = require("../utils/sendEmail");

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

/**
 * @desc Reset user password after verifying OTP
 * @access Public
 * @route POST /api/auth/forgot-password/verify-otp
 * @param { import('express').Request } request Express request object
 * @param { import('express').Response } response Express response object
 * @param { import('express').NextFunction } next Express next function
 */
const resetPassword = asyncHandler(async(request, response, next) =>{
  const { email, otp, newPassword } = request.body

  // check if otp exists and valid
  const otpDocument = await OTP.findOne({ email })
  if(!otpDocument){
    throw new ApiError(400, 'Invalid or expired OTP code')
  }

  // check the expiration of OTP 
  if(otpDocument.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: otpDocument._id })
    throw new ApiError(400, "OTP has expired");
  }
  
  // compare the OTP with the hashed OTP in DB
  const isMatch = await bcrypt.compare(otp, otpDocument.otp)
  if(!isMatch) {
    throw new ApiError(400, 'Invalid or expired OTP code')
  } 

  // check if user exists and update the password
  const user = await User.findOne({ email })
  if(!user) {
    throw new ApiError(404, 'User not found')
  }
  user.password = newPassword
  await user.save()

  // Delete the used OTP from database for security
  await OTP.deleteOne({ _id: otpDocument._id })

  return sendResponse(response, 200, 'Password reset successfully')
})




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

  return sendResponse(res, 200, "OTP sent to your email successfully");
});
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const otp = generateOTP();
  const hashedOTP = await bcrypt.hash(otp, 10);
  await OTP.deleteMany({ email });
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  let otpDoc;

  try {
    otpDoc = await OTP.create({
      email,
      otp: hashedOTP,
      expiresAt,
    });

    await sendEmail({
      to: email,
      subject: "Reset Password - OTP Code",
      html: `<h2>Your password reset code is: ${otp}</h2><p>This code expires in 10 minutes.</p>`,
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


const changeRole = asyncHandler(async (req, res, next) => {
// data validation is already done in the middleware using Joi schema
  const { userId, role } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
// Ensure that the new role is different from the current role
  if (user.role === role) {
    throw new ApiError(400, `User already has the role: ${role}`);
  }

  const oldRole = user.role;
  user.role = role;

  // save changes to mongoDB
  await user.save();

  // Send email notification to the user about the role update.
  try {
    await sendEmail({
      to: user.email,
      subject: "Account Notice - Role Updated",
      html: `<h2>Hello ${user.username},</h2>
             <p>Your account role has been updated from <b>${oldRole}</b> to <b>${role}</b> by the administrator.</p>
             <p>If you did not request this change, please secure your account or contact support immediately.</p>`,
    });
  } catch (error) {
    console.error("Email notification failed to send:", error.message);
  }

  // Send response back to the client
  return sendResponse(res, 200, `User role updated successfully to ${role}`, {user});
  
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

const adminTest = asyncHandler(async (req, res) => {
  return sendResponse(
    res,
    200,
    "Welcome Admin"
  );
});


module.exports = { 
  sendRegisterOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  adminTest,
  changeRole
};

