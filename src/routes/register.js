const express = require("express");
const { addCustomers } = require("../controller/customers");
const { addStores } = require("../controller/stores");
const route = express.Router();

route.post("/customers", addCustomers);
route.post("/stores", addStores);

module.exports = route;
