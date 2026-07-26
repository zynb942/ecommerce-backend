const express = require("express");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const errorHandler = require("./middlewares/errorHandler.js");
const cartRoutes = require("./routes/cart.routes");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist.routes.js");
// orderRoutes is not defined in this file.
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const webhookRoutes = require('./routes/webhook.routes.js')


const app = express();

app.use('/api/payments', webhookRoutes) // it must be here before express.json() to prevent converting the Request Body into Object then failed the checking of Signature
app.use(express.json());

app.use("/api/auth", authRoutes);   
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use(errorHandler);
module.exports = app;


