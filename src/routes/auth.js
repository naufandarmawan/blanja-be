const express = require("express");
const authController = require("../controllers/auth");
const { protect } = require("../middlewares/auth");
const route = express.Router();

route
  .post("/login", authController.login)
  .get("/logout", protect, authController.logout)
  .post("/refresh-token", authController.refreshToken)
  .get("/check-roles", protect, authController.checkRole);

module.exports = route;
