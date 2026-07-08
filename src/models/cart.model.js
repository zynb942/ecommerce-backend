const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"]
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        default: 1,
        min: 1
    }
}, { _id: false });

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixed"]
    },
    discountValue: {
        type: Number,
        default: 0,
        min: 0
    }
}, { _id: false });

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
            unique: true
        },
        items: {
            type: [cartItemSchema],
            default: []
        },
        coupon: {
            type: couponSchema,
            default: null
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// =============================================
// 1. Virtual: subtotal
// =============================================
cartSchema.virtual('subtotal').get(function () {
    if (!this.items || this.items.length === 0) return 0;

    return this.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
});

// =============================================
// 2. Virtual: discountAmount
// =============================================
cartSchema.virtual('discountAmount').get(function () {
    if (!this.coupon || !this.coupon.code) return 0;

    const subtotal = this.subtotal;
    if (subtotal === 0) return 0;

    const { discountType, discountValue } = this.coupon;

    if (discountType === 'percentage') {
        return (subtotal * discountValue) / 100;
    } else if (discountType === 'fixed') {
        return Math.min(discountValue, subtotal);
    }

    return 0;
});

// =============================================
// 3. Virtual: total
// =============================================
cartSchema.virtual('total').get(function () {
    return Math.max(0, this.subtotal - this.discountAmount);
});

// =============================================
// 4. Virtual: itemCount
// =============================================
cartSchema.virtual('itemCount').get(function () {
    if (!this.items || this.items.length === 0) return 0;

    return this.items.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;