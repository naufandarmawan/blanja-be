const express = require("express");
const {
  profileCustomers,
  putCustomers,
  updatePhotoProfile,
} = require("../controllers/customers");
const { protect, checkRole } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const route = express.Router();

route
  .get("/profile", protect, checkRole("customer"), profileCustomers)
  .put("/profile", protect, checkRole("customer"), putCustomers)
  .put(
    "/profile/photo",
    protect,
    upload.single("photo"),
    checkRole("customer"),
    updatePhotoProfile
  );

module.exports = route;
