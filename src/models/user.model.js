const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const addressSchema = new mongoose.Schema(
    {
        fullName: String,
        phone: String,
        country: String,
        city: String,
        address: String,
        postalCode: String,
    },
    {
        _id: false,
    }
);

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        phone: {
            type: String,
        },

        avatar: {
            type: String,
            default: "https://res.cloudinary.com/no625vlt/image/upload/v1785078789/Screenshot_2026-07-26_181048_mzehzd.png",
        },

        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
        addresses: [addressSchema],
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: {
            type: String,
        },

        resetPasswordExpire: {
            type: Date,
        },

    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};



const User = mongoose.model("User", userSchema);

module.exports = User;
