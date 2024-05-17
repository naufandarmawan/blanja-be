require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const dotenv = require("dotenv");

// Routes
const registerRoutes = require("./src/routes/register");
const authRoutes = require("./src/routes/auth");
const customerRoutes = require("./src/routes/customers");
const storeRoutes = require("./src/routes/stores");
const productsRouter = require("./src/routes/products");
const orderRouter = require("./src/routes/order");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(xss());

app.use("/register", registerRoutes);
app.use("/auth", authRoutes);
app.use("/customer", customerRoutes);
app.use("/store", storeRoutes);
app.use("/products", productsRouter);
app.use("/order", orderRouter);

app.use((error, req, res, next) => {
  console.log(error);
  const messageError = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: messageError,
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
