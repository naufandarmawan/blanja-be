const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const dotenv = require("dotenv");

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
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
