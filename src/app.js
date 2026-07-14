const express = require("express");
const authRoutes = require('./routes/auth.routes.js')
const errorHandler = require('./middlewares/errorHandler.js')

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes)

app.use(errorHandler);

module.exports = app;