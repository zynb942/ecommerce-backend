const User = require("../models/user.model.js");
const ApiError = require("../utils/apiError.js");
const asyncHandler = require("../utils/asyncHandler.js");
const sendResponse = require("../utils/sendResponse.js");

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  if (req.user._id.toString() !== id) throw new ApiError(403, "Not authorized");

  user.username = req.body.username ?? user.username;
  user.phone = req.body.phone ?? user.phone;
  user.avatar = req.body.avatar ?? user.avatar;

  await user.save();
  return sendResponse(res, 200, "User profile updated successfully", { user });
});

module.exports = { updateUser };