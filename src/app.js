const express = require("express");
const authRoutes = require('./routes/auth.routes.js')
const userRoutes = require('./routes/user.routes.js');
const errorHandler = require('./middlewares/errorHandler.js')
const productRoutes = require("./routes/product.routes");

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);
app.use(errorHandler);
app.use("/api/products", productRoutes);

module.exports = app;