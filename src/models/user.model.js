const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


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
            default: "حط هنا مسار الصورة الافتراضية بعد منعمل upload للصور",
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


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);

    next();

});


userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};




const User = mongoose.model("User", userSchema);

module.exports = User;
