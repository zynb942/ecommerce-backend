const mongoose = require("mongoose");

// OTP schema definition
const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String,
            required: [true, "OTP is required"],
        },
        expiresAt: {
            type: Date,
            required: [true, "Expiration date is required"],
        },
        userData: {
            type: Object,
            default: null
        },
    },
    {
        timestamps: true,
    }
);


otpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

// Create the OTP model from the defined schema
const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;