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

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(xss());

// Routes
app.use("/register", registerRoutes);
app.use("/auth", authRoutes);
app.use("/customer", customerRoutes);
app.use("/store", storeRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const messageError = error.message || "Internal Server Error";
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: messageError,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
