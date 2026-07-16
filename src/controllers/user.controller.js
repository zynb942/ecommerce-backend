const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

const addUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const user = await User.create({
    username,
    email: email.toLowerCase(),
    password,
    phone,
    isVerified: true,
    role: "customer",
  });

  const userData = user.toObject();
  delete userData.password;

  return sendResponse(res, 201, "User created successfully", {
    user: userData,
  });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!req.user._id.equals(id)) {
    throw new ApiError(403, "You are not allowed to update this profile");
  }
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.username = req.body.username ?? user.username;
  user.phone = req.body.phone ?? user.phone;
  user.avatar = req.body.avatar ?? user.avatar;

  await user.save();
  const UserData = user.toObject();
  delete UserData.password;

  return sendResponse(res, 200, "Success", {
    user: UserData,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  return sendResponse(res, 200, "Users fetched successfully", {
    count: users.length,
    users,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // if (!req.user._id.equals(id)) {
  //   throw new ApiError(403, "You are not allowed to delete this profile");
  // }
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await user.deleteOne();

  return sendResponse(res, 200, "User deleted successfully");
});

module.exports = {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
