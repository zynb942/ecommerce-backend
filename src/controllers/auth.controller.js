const User = require('../models/user.model.js')
const OTP = require('../models/OTP.model.js')
const ApiError = require('../utils/apiError.js')
const asyncHandler = require('../utils/asyncHandler.js')
const sendResponse = require('../utils/sendResponse.js')
const bcrypt = require('bcryptjs')

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

module.exports = { resetPassword }