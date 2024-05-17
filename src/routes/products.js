const express = require("express");

const {
  createProducts,
  getAllProducts,
  getDetailProduct,
  getAllProductsByStoresId,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require("../controllers/products");
const { protect, checkRole } = require("../middlewares/auth");

const route = express.Router();

route
  .post("/", protect, checkRole("store"), createProducts)
  .get("/", getAllProducts)
  .get("/:id", getDetailProduct)
  .get("/:id", getAllProductsByStoresId)
  .put("/:id", protect, checkRole("store"), updateProduct)
  .delete("/:id", checkRole("store"), deleteProduct)
  .delete("/:id", protect, checkRole("store"), deleteProduct)
  .get("/category/:category", getProductsByCategory);

module.exports = route;
