const express = require("express");
const authRoutes = require('./routes/auth.routes.js');
const authRoutes = require("./routes/auth.routes");
const errorHandler = require('./middlewares/errorHandler.js');



const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.use(errorHandler);

module.exports = app;