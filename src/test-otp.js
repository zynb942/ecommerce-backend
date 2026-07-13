require('dotenv').config(); // لقراءة الرابط من ملف .env
const mongoose = require('mongoose');
const OTP = require('./models/OTP.model'); // استدعاء الموديل الخاص بكِ

async function testOTP() {
    try {
        // 1. الاتصال بقاعدة البيانات
        await mongoose.connect(process.env.MONGO_URI);
        console.log("تم الاتصال بقاعدة البيانات بنجاح!");

        // 2. محاولة إنشاء تجربة للـ OTP
        const testOTP = new OTP({
            email: "test@example.com",
            otp: "123456"
        });

        await testOTP.save();
        console.log("تم حفظ الـ OTP بنجاح في قاعدة البيانات!");

        // 3. إنهاء الاتصال
        await mongoose.disconnect();
    } catch (error) {
        console.error("حدث خطأ:", error);
    }
}

testOTP();