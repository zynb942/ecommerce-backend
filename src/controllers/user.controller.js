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
  
  return sendResponse(
    res,
    201,
    "User created successfully",
    { user: userData }
  );
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 });

  return sendResponse(
    res,
    200,
    "Users fetched successfully",
    {
      count: users.length,
      users,
    }
  );
});

module.exports = {
  addUser,
  getAllUsers,
};