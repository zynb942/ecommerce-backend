const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // هذا الحقل يجعل الـ OTP ينتهي تلقائياً بعد 5 دقائق (300 ثانية)
        expires: 300 
    }
});

module.exports = mongoose.model('OTP', otpSchema);