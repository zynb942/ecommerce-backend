const Cart = require("../models/cart.model");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

/**
 * @desc    Get active carts for admin with pagination
 * @route   GET /orders/admin/carts
 * @access  Private (Admin only)
 */
const getActiveCarts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const query = { "items.0": { $exists: true } };

  // Get total count of non-empty carts for pagination metadata
  const total = await Cart.countDocuments(query);

  // Fetch carts with populated user info
  const carts = await Cart.find(query)
    .populate("user", "username email")
    .skip(skip)
    .limit(limit)
    .lean({ virtuals: true }); 

  const totalPages = Math.ceil(total / limit);

  const formattedCarts = carts.map((cart) => ({
    _id: cart._id,
    user: cart.user
      ? {
          username: cart.user.username,
          email: cart.user.email,
        }
      : null,
    items: cart.items,
    subtotal: cart.subtotal || 0,
    itemCount: cart.itemCount || 0,
  }));

  return sendResponse(res, 200, "Active carts retrieved successfully", {
    total,
    currentPage: page,
    totalPages,
    carts: formattedCarts,
  });
});

module.exports = {
  getActiveCarts,
};