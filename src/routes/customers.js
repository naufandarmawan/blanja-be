const express = require("express");
const { profileCustomers, putCustomers } = require("../controller/customers");
const { protect, checkRole } = require("../middlewares/auth");
const route = express.Router();

route
  .get("/profile", protect, checkRole("customer"), profileCustomers)
  .put("/profile", protect, checkRole("customer"), putCustomers);

module.exports = route;
