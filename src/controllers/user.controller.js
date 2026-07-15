const User = require("../models/user.model.js");
const ApiError = require("../utils/apiError.js");
const asyncHandler = require("../utils/asyncHandler.js");
const sendResponse = require("../utils/sendResponse.js");

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!req.user._id.equals(id)){
    throw new ApiError(403, "You are not allowed to update this profile");
  }
  const user = await User.findById(id);
  user.username = req.body.username ?? user.username;
  user.phone = req.body.phone ?? user.phone;
  user.avatar = req.body.avatar ?? user.avatar;

  await user.save();
  const UserData = user.toObject();
  delete UserData.password;

  return sendResponse(res,200,"Success", {
    user : UserData,
  })
});

module.exports = { updateUser };