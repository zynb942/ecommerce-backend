const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const errorHandler = require("./middlewares/errorHandler.js");
const cartRoutes = require("./routes/cart.routes");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist.routes.js");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const webhookRoutes = require('./routes/webhook.routes.js')
const adminDashboardRoutes = require('./routes/admin-dashboard.routes.js')

const app = express();

app.use('/api/payments', webhookRoutes) // it must be here before express.json() to prevent converting the Request Body into Object then failed the checking of Signature
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use('/api/orders/admin', adminDashboardRoutes)
app.use(errorHandler);
module.exports = app;


