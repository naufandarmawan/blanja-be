const express = require("express");
const {
  addMyOrder,
  getMyOrder,
  getAllMyOrders,
  updateMyOrder,
  deleteMyOrder,
} = require("../controllers/orders");
const { protect, checkRole } = require("../middlewares/auth");

const route = express.Router();

route
  .post("/:products_id", protect, checkRole("customer"), addMyOrder)
  .get("/", protect, checkRole("customer"), getAllMyOrders)
  .get("/my-order", protect, checkRole("customer"), getMyOrder)
  .put("/:id", protect, checkRole("customer"), updateMyOrder)
  .delete("/:id", protect, checkRole("customer"), deleteMyOrder);

module.exports = route;
