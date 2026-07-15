const express = require("express");

const app = express();

const userRoutes = require("./routes/user.routes"); 
const authRoutes = require("./routes/auth.routes");

app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

module.exports = app;