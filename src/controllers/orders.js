const createHttpError = require("http-errors");
const ordersModel = require("../models/orders");
// const productsModel = require("../models/products");
const authModel = require("../models/auth");

// Create order
const addMyOrder = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [order],
    } = await authModel.findByemail(email, { relation: "customers" });

    const { color, quantity, size } = req.body;
    if (!color || !quantity || !size) {
      return next(
        createHttpError(
          400,
          "All order details (color, quantity, size) are required"
        )
      );
    }

    const products_id = req.params.products_id;
    // const product = await productsModel.selectDetailProduct(product.products_id)
    const order_id = await ordersModel.createOrder(
      order.customers_id,
      products_id,
      color,
      quantity,
      size
    );

    res.status(200).json({
      success: true,
      message: "Order placed successfully.",
      data: { order_id, products_id, color, quantity, size },
    });
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};
// Get My Orders
const getMyOrder = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [customers],
    } = await authModel.findByemail(email, { relation: "customers" });
    console.log(customers);
    const { rows: orders } = await ordersModel.getOrdersByCustomerId(
      customers.customers_id
    );

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      data: orders,
    });
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

const getAllMyOrders = async (req, res, next) => {
  try {
    const { orders } = await ordersModel.getAllOrders();
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const updateMyOrder = async (req, res, next) => {
  try {
    const order_id = req.params.id;
    const { color, quantity, size } = req.body;
    await ordersModel.updateOrder(order_id, color, quantity, size);
    res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      data: { order_id: order_id, color, quantity, size },
    });
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

const deleteMyOrder = async (req, res, next) => {
  try {
    const order_id = req.params.id;
    await ordersModel.deleteOrder(order_id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

module.exports = {
  addMyOrder,
  getMyOrder,
  getAllMyOrders,
  updateMyOrder,
  deleteMyOrder,
};
