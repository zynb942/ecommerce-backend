const User = require('../models/user.model.js')
const OTP = require('../models/OTP.model.js')
const ApiError = require('../utils/apiError.js')
const asyncHandler = require('../utils/asyncHandler.js')

/**
 * POST /api/reset-password
 * Reset user password after verifying OTP
 * @param { object } request Express request object
 * @param { object } response Express response object
 * @param { function } next Express next function
 */
const resetPassword = asyncHandler(async(request, response, next) =>{
  const { email, otp, newPassword } = request.body

  // check if otp exists and valid
  const otpRecord = await OTP.findOne({ email, otp })
  if(!otpRecord){
    throw new ApiError(400, 'Invalid or expired OTP code')
  }

  // check if user exists
  const user = await User.findOne({ email })
  if(!user){
    throw new ApiError(404, 'User not found')
  }

  user.password = newPassword
  await user.save()

  // Delete the used OTP from database for security
  await OTP.deleteOne({ _id: otpRecord._id })

  return response.status(200).json({
    success: true,
    message: 'Password reset successfully'
  })
})

module.exports = { resetPassword }