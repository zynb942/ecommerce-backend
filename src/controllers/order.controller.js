const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");
const { getPagination } = require("./helpers");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const sendEmail = require("../utils/sendEmail");

/**
 * @desc    Place a new Order from current User's active Cart
 * @route   POST /api/orders
 * @access  Private
 */

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress, paymentMethod, customerNote } = req.body;

  const session = await mongoose.startSession();

  let order;

  try {
    session.startTransaction();

    const cart = await Cart.findOne({
      user: userId,
    }).session(session);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty. Cannot place an order.");
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));

    const subtotal = Number(cart.subtotal.toFixed(2));

    const discount = Number(
      (cart.discountAmount || 0).toFixed(2),
    );

    const shippingFee = subtotal >= 1000 ? 0 : 50;

    const tax = Number(
      (subtotal * 0.14).toFixed(2),
    );

    const totalPrice = Number(
      Math.max(
        0,
        subtotal + shippingFee + tax - discount,
      ).toFixed(2),
    );

    [order] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          shippingAddress,

          paymentMethod: paymentMethod || "cash",

          paymentStatus: "pending",


          subtotal,
          shippingFee,
          tax,
          discount,
          totalPrice,

          customerNote: customerNote || "",

          status: "pending",
        },
      ],
      {
        session,
      },
    );

    cart.items = [];
    cart.coupon = null;

    await cart.save({
      session,
    });

    await session.commitTransaction();
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }


  const itemsTableRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${item.name}
          </td>

          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
            ${item.quantity}
          </td>

          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">
            ${Number(item.price).toFixed(2)} EGP
          </td>

          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">
            ${(item.price * item.quantity).toFixed(2)} EGP
          </td>
        </tr>
      `,
    )
    .join("");

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">

      <h2>Order Confirmation</h2>

      <p>
        Hello <strong>${shippingAddress.fullName}</strong>,
      </p>

      <p>
        Thank you for your order!
        Your order ID is
        <strong>#${order._id}</strong>.
      </p>

      <h3>Order Items</h3>

      <table
        style="
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        "
      >
        <thead>
          <tr style="background-color: #f2f2f2;">

            <th style="padding: 8px; border: 1px solid #ddd;">
              Product
            </th>

            <th style="padding: 8px; border: 1px solid #ddd;">
              Qty
            </th>

            <th style="padding: 8px; border: 1px solid #ddd;">
              Unit Price
            </th>

            <th style="padding: 8px; border: 1px solid #ddd;">
              Subtotal
            </th>

          </tr>
        </thead>

        <tbody>
          ${itemsTableRows}
        </tbody>
      </table>

      <h3>Price Breakdown</h3>

      <table
        style="
          width: 100%;
          border-collapse: collapse;
          max-width: 400px;
        "
      >

        <tr>
          <td style="padding: 4px 0;">
            <strong>Subtotal:</strong>
          </td>

          <td style="padding: 4px 0; text-align: right;">
            ${order.subtotal.toFixed(2)} EGP
          </td>
        </tr>

        <tr>
          <td style="padding: 4px 0;">
            <strong>Shipping Fee:</strong>
          </td>

          <td style="padding: 4px 0; text-align: right;">
            ${order.shippingFee.toFixed(2)} EGP
          </td>
        </tr>

        <tr>
          <td style="padding: 4px 0;">
            <strong>Tax (14%):</strong>
          </td>

          <td style="padding: 4px 0; text-align: right;">
            ${order.tax.toFixed(2)} EGP
          </td>
        </tr>

        ${order.discount > 0
      ? `
              <tr>
                <td style="padding: 4px 0; color: green;">
                  <strong>Discount:</strong>
                </td>

                <td style="padding: 4px 0; text-align: right; color: green;">
                  -${order.discount.toFixed(2)} EGP
                </td>
              </tr>
            `
      : ""
    }

        <tr style="border-top: 2px solid #333;">

          <td style="padding: 8px 0; font-size: 16px;">
            <strong>Total Price:</strong>
          </td>

          <td style="padding: 8px 0; text-align: right; font-size: 16px;">
            <strong>
              ${order.totalPrice.toFixed(2)} EGP
            </strong>
          </td>

        </tr>

      </table>

      <br />

      <p>
        We will notify you when your order status updates!
      </p>

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
    console.error(
      "Order confirmation email failed to send:",
      emailError.message,
    );
  }

  return sendResponse(
    res,
    201,
    "Order placed successfully",
    {
      order,
    },
  );
});

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
  const totalPages = Math.ceil(totalOrders / limitPerPage);
  return sendResponse(res, 200, "Orders retrieved successfully", {
    totalOrders,
    currentPage,
    totalPages,
    orders,
  });
});


const getMyOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return sendResponse(res, 200, "Order retrieved successfully", {
    order,
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    paymentStatus,
    from,
    to,
    sortBy = "createdAt",
    sortDir = "desc",
  } = req.query;

  const { currentPage, limitPerPage, skip } = getPagination(page, limit);

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  if (from || to) {
    filter.createdAt = {};

    if (from) {
      filter.createdAt.$gte = new Date(from);
    }

    if (to) {
      const endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = endDate;
    }
  }

  const sort = {
    [sortBy]: sortDir === "asc" ? 1 : -1,
  };

  const [total, orders] = await Promise.all([
  Order.countDocuments(filter),
  Order.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limitPerPage),
]);
  return sendResponse(res, 200, "Orders retrieved successfully", {
    total,
    currentPage,
    totalPages: Math.ceil(total / limitPerPage),
    orders,
  });
});

/**
 * @desc    Cancel Order by Current User
 * @route   PATCH /api/orders/my/:id/cancel
 * @access  Private
 */
const cancelMyOrder = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingOrder = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).session(session);

    if (!existingOrder) {
      throw new ApiError(404, "Order not found");
    }

    if (!["pending", "confirmed"].includes(existingOrder.status)) {
      throw new ApiError(
        400,
        "Cannot cancel order in current status"
      );
    }

    const order = await Order.findOneAndUpdate({
      _id: req.params.id,
      user: req.user._id,
      status: {
        $in: ["pending", "confirmed"],
      },
    },
      {
        $set: {
          status: "cancelled",
          cancelledAt: new Date(),
        },
      },
      {
        new: true,
        session,
      }
    );

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    for (const item of order.items) {
      if (item.product) {
        const product = await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              stock: item.quantity,
            },
          },
          { new: true, session }
        );

        if (!product) {
          throw new ApiError(404, `Product not found: ${item.product}`);
        }
      }
    }
    await session.commitTransaction();

    try {
      await sendEmail({
        to: req.user.email,
        subject: `Order Cancelled - #${order._id}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2>Order Cancelled</h2>
            <p>Hello <strong>${req.user.username}</strong>,</p>
            <p>Your order <strong>#${order._id}</strong> has been cancelled successfully.</p>
            <p>If you did not request this cancellation, please contact support immediately.</p>
            <br/>
            <p>Thank you,</p>
            <p><strong>E-Commerce Team</strong></p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Cancellation email failed:", emailError.message);
    }

    return sendResponse(res, 200, "Order cancelled successfully", {
      order,
    });

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
});

module.exports = {
  getMyOrders,
  getMyOrderById,
  createOrder,
  getAllOrders,
  cancelMyOrder,
};
