const express = require("express");
const { addCustomers } = require("../controllers/customers");
const { addStores } = require("../controllers/stores");
const route = express.Router();

route.post("/customers", addCustomers);
route.post("/stores", addStores);

module.exports = route;
