const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const _config = require('../config/env')

const protect = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized, no token provided");
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
        decoded = jwt.verify(token, _config.JWT_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new ApiError(401, "User no longer exists");
    }

    req.user = user;

    next();


});


module.exports = {
    protect,
};

