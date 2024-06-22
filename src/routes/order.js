const express = require("express");
const {
  addMyOrder,
  getMyOrder,
  getAllMyOrders,
  updateMyOrder,
  deleteMyOrder,
  checkout,
  moveOrdersToHistory,
  getOrderHistoryByCustomerId,
  getOrderHistoryByStoresId,
  getPaymentMethods,
  buyNow,
} = require("../controllers/orders");
const { protect, checkRole } = require("../middlewares/auth");

const router = express.Router();

router.get("/", protect, checkRole("customer"), getAllMyOrders);
router.get("/my-order", protect, checkRole("customer"), getMyOrder);
router.get("/checkout", protect, checkRole("customer"), checkout);
router.get(
  "/order-history",
  protect,
  checkRole("customer"),
  getOrderHistoryByCustomerId
);
router.get(
  "/store-order-history",
  protect,
  checkRole("store"),
  getOrderHistoryByStoresId
);
router.post(
  "/move-orders-to-history",
  protect,
  checkRole("customer"),
  moveOrdersToHistory
);
router.get(
  "/payment-methods",
  protect,
  checkRole("customer"),
  getPaymentMethods
);
router.post("/buy-now/:products_id", protect, checkRole("customer"), buyNow);
router.put("/:id", protect, checkRole("customer"), updateMyOrder);
router.delete("/:id", protect, checkRole("customer"), deleteMyOrder);
router.post("/:products_id", protect, checkRole("customer"), addMyOrder);

module.exports = router;
