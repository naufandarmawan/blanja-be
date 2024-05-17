const express = require("express");
const { protect, checkRole } = require("../middlewares/auth");
const {
  addAddress,
  getAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/address");
const route = express.Router();

route
  .post("/", protect, checkRole("customer"), addAddress)
  .get("/", protect, checkRole("customer"), getAddress)
  .put("/:id", protect, checkRole("customer"), updateAddress)
  .delete("/:id", protect, checkRole("customer"),  deleteAddress);

module.exports = route;
