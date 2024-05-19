const express = require("express");
const { protect, checkRole } = require("../middlewares/auth");
const { profileStores, putStores } = require("../controllers/stores");
const { getAllProductsByLogin } = require("../controllers/products");
const route = express.Router();

route
  .get("/profile", protect, checkRole("store"), profileStores)
  .put("/profile", protect, checkRole("store"), putStores)
  .get("/products", protect, getAllProductsByLogin);

module.exports = route;
