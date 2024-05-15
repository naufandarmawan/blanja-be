const express = require("express");
const authController = require("../controller/auth");
const route = express.Router();

route
  .post("/login", authController.login)
  .post("/refresh-token", authController.refreshToken);

module.exports = route;
