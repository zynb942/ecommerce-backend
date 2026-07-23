const Order = require("../models/order.model");

const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

const { getPagination } = require("./helpers");

const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const { currentPage, limitPerPage, skip } = getPagination(page, limit);
  const filter = {
    user: req.user._id,
  };
  if (status) {
    filter.status = status;
  }
  const [totalOrders, orders] = await Promise.all([
    Order.countDocuments(filter),

    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitPerPage),
  ]);
  const totalPages = Math.ceil(totalOrders  / limitPerPage);
  return sendResponse(res, 200, "Orders retrieved successfully", {
    totalOrders,
    currentPage,
    totalPages,
    orders,
  });
});

module.exports = {
  getMyOrders,
};
