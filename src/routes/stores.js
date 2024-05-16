const express = require("express");
const { protect, checkRole } = require("../middlewares/auth");
const { profileStores, putStores } = require("../controller/stores");
const route = express.Router();

route
  .get("/profile", protect, checkRole("store"), profileStores)
  .put("/profile", protect, checkRole("store"), putStores);

module.exports = route;
