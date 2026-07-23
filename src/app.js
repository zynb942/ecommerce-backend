const express = require("express");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const errorHandler = require("./middlewares/errorHandler.js");
const cartRoutes = require("./routes/cart.routes");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist.routes.js");
<<<<<<< HEAD
const orderRoutes = require("./routes/order.routes");
=======
const orderRouter = require("./routes/order.routes");
>>>>>>> f35341f (fix(order): address PR review comments for validation, route path, shipping logic, and email parameters)

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);   
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
<<<<<<< HEAD
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/orders", orderRoutes);
=======
app.use("/api/orders", orderRouter);
>>>>>>> f35341f (fix(order): address PR review comments for validation, route path, shipping logic, and email parameters)
app.use(errorHandler);
module.exports = app;
