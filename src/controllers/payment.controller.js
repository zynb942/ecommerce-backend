const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const sendResponse = require("../utils/sendResponse");

const Order = require("../models/order.model");

const stripe = require("../config/stripe");

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  if (order.status === "cancelled") {
    throw new ApiError(400, "Cancelled order cannot be paid");
  }

  if (order.paymentStatus === "paid") {
    throw new ApiError(400, "Order already paid");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100),
    currency: "egp",

    metadata: {
      orderId: order._id.toString(),
      userId: req.user._id.toString(),
    },
  });
  order.transactionId = paymentIntent.id;

  await order.save();
  return sendResponse(res, 200, "Payment intent created successfully", {
    clientSecret: paymentIntent.client_secret,
  });
});
module.exports = {
  createPaymentIntent,
};
