const express = require("express");
const { protect, checkRole } = require("../middlewares/auth");
const {
  profileStores,
  putStores,
  updatePhotoProfile,
} = require("../controllers/stores");
const { getAllProductsByLogin } = require("../controllers/products");
const upload = require("../middlewares/upload");
const route = express.Router();

route
  .get("/profile", protect, checkRole("store"), profileStores)
  .put("/profile", protect, checkRole("store"), putStores)
  .get("/products", protect, getAllProductsByLogin)
  .put(
    "/profile/photo",
    protect,
    upload.single("photo"),
    checkRole("store"),
    updatePhotoProfile
  );

module.exports = route;
