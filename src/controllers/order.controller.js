<<<<<<< HEAD
const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const sendEmail = require("../utils/sendEmail");

/**
 * @desc    Place a new Order from current User's active Cart
 * @route   POST /api/v1/orders
 * @access  Private
 */

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress, paymentMethod, customerNote } = req.body;

  // 1. get the current user's cart and ensure it has items
  const cart = await Cart.findOne({ user: userId });
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty. Cannot place an order.");
  }

  // 2. Start a Mongoose session for transaction management
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Prepare order items from cart items
    const orderItems = cart.items.map((item) => ({
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    // 3. Getting subtotal, discount from the cart
    const subtotal = cart.subtotal;
    const discount = cart.discountAmount || 0;

    // 4. Calculate shipping fee if subtotal is greater than 1000, shipping is free
    const shippingFee = subtotal >= 1000 ? 0 : 50;
    const tax = Number((subtotal * 0.14).toFixed(2));

    // 5. Calculate total price
    const totalPrice = Number(
      Math.max(0, subtotal + shippingFee + tax - discount).toFixed(2),
    );

    //6. Create the order document in the database within the transaction
    const [order] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          shippingAddress,
          paymentMethod: paymentMethod || "cash",
          subtotal,
          shippingFee,
          tax,
          discount,
          totalPrice,
          customerNote: customerNote || "",
          status: "pending",
          paymentStatus: paymentMethod === "cash" ? "pending" : "pending",
        },
      ],
      { session },
    );

    // 7. clear the user's cart and reset coupon
    cart.items = [];
    cart.coupon = null;
    await cart.save({ session });

    // 8. Commit the transaction and end the session
    await session.commitTransaction();
    session.endSession();

    // 9. Send order confirmation email to the user
    const itemsTableRows = orderItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
      )
      .join("");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2>Order Confirmation</h2>
        <p>Hello <strong>${shippingAddress.fullName}</strong>,</p>
        <p>Thank you for your order! Your order ID is <strong>#${order._id}</strong>.</p>

        <h3>Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Unit Price</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTableRows}
          </tbody>
        </table>

        <h3>Price Breakdown</h3>
        <table style="width: 100%; border-collapse: collapse; max-width: 300px;">
          <tr>
            <td style="padding: 4px 0;"><strong>Subtotal:</strong></td>
            <td style="padding: 4px 0; text-align: right;">$${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Shipping Fee:</strong></td>
            <td style="padding: 4px 0; text-align: right;">$${shippingFee.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Tax (14%):</strong></td>
            <td style="padding: 4px 0; text-align: right;">$${tax.toFixed(2)}</td>
          </tr>
          ${
            discount > 0
              ? `<tr>
                  <td style="padding: 4px 0; color: green;"><strong>Discount:</strong></td>
                  <td style="padding: 4px 0; text-align: right; color: green;">-$${discount.toFixed(2)}</td>
                </tr>`
              : ""
          }
          <tr style="border-top: 2px solid #333;">
            <td style="padding: 8px 0; font-size: 16px;"><strong>Total Price:</strong></td>
            <td style="padding: 8px 0; text-align: right; font-size: 16px;"><strong>$${totalPrice.toFixed(2)}</strong></td>
          </tr>
        </table>

        <br/>
        <p>We will notify you when your order status updates!</p>
      </div>
    `;

    try {
      if (req.user.email) {
        await sendEmail({
          to: req.user.email,
          subject: `Order Confirmation - #${order._id}`,
          html: emailHtml,
        });
      }
    } catch (emailError) {
      console.error("Order confirmation email failed to send:", emailError.message);
    }

    return sendResponse(res, 201, "Order placed successfully", {
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

module.exports = {
  createOrder,
=======
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
>>>>>>> origin/main
};
