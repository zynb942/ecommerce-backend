const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        image: {
            type: String,
            required: [true, "Image is required"],
        },

        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },

        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: 1,
        },

    },
    {
        _id: false,
    }
);


const shippingAddressSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },

        phone: {
            type: String,
            required: [true, "Phone is required"],
            trim: true,
        },

        country: {
            type: String,
            required: [true, "Country is required"],
            trim: true,
        },

        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
        },

        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },

        postalCode: {
            type: String,
            required: [true, "Postal code is required"],
            trim: true,
        },
    },
    {
        _id: false,
    }
);


const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        items: {
            type: [orderItemSchema],
            required: [true, "Order items are required"],
            validate: {
                validator: function (items) {
                    return items.length > 0;
                },
                message: "Order must contain at least one item",
            },
        },
        shippingAddress: {
            type: shippingAddressSchema,
            required: [true, "Shipping address is required"],
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "stripe", "paypal", "paymob"],
            default: "cash",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },
        transactionId: {
            type: String,
            trim: true,
            default: null
        },
        subtotal: {
            type: Number,
            required: [true, "Subtotal is required"],
            min: 0,
        },
        shippingFee: {
            type: Number,
            default: 0,
            min: 0,
        },
        tax: {
            type: Number,
            default: 0,
            min: 0,
        },
        discount: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalPrice: {
            type: Number,
            required: [true, "Total price is required"],
            min: 0,
        },
        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
            ],
            default: "pending",
        },
        paidAt: {
            type: Date,
        },
        deliveredAt: {
            type: Date,
        },
        cancelledAt: {
            type: Date,
        },
        customerNote: {
            type: String,
            trim: true,
            maxlength: [1000, "Customer note cannot exceed 1000 characters"],
            default: ""
        },
        adminNote: {
            type: String,
            trim: true,
            maxlength: [1000, "Admin note cannot exceed 1000 characters"],
            default: ""
        },

    },
    {
        timestamps: true,
    }
);


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

