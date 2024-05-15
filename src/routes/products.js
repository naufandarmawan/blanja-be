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

const route = express.Router();

route
  .post("/", createProducts)
  .get("/", getAllProducts)
  .get("/:id", getDetailProduct)
  .get("/:id", getAllProductsByStoresId)
  .put("/:id", updateProduct)
  .delete("/:id", deleteProduct)
  .get("/category/:category", getProductsByCategory);

module.exports = route;
