const createHttpError = require("http-errors");
const ordersModel = require("../models/orders");
const authModel = require("../models/auth");
const { v4: uuidv4 } = require("uuid");
const db = require("../configs/db");

const addMyOrder = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const stores_id = 'c52b6f9a-ad6a-4b71-b150-a5a098579c80'
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
    const order_id = await ordersModel.createOrder(
      order.customers_id,
      products_id,
      stores_id,
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

const getMyOrder = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [customers],
    } = await authModel.findByemail(email, { relation: "customers" });
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
    const { rows: orders } = await ordersModel.getAllOrders();
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
      data: { order_id, color, quantity, size },
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

const checkout = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [customer],
    } = await authModel.findByemail(email, { relation: "customers" });

    if (!customer) {
      return next(createHttpError(404, "Customer not found"));
    }

    const { rows: orders } = await ordersModel.getOrdersByCustomerId(
      customer.customers_id
    );

    if (!orders.length) {
      return next(createHttpError(404, "No orders found for this customer"));
    }

    const total_price = orders.reduce(
      (acc, order) => acc + order.product_price * order.quantity,
      0
    );

    const paymentMethods = await ordersModel.getPaymentMethods();

    res.status(200).json({
      success: true,
      message: "Checkout information retrieved successfully.",
      data: {
        total_price,
        products: orders.map((order) => ({
          product_name: order.product_name,
          product_image: order.product_image,
          product_price: order.product_price,
          color: order.color,
          quantity: order.quantity,
          size: order.size,
        })),
        payment_methods: paymentMethods,
      },
    });
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

const getPaymentMethods = async (req, res, next) => {
  try {
    const { rows: paymentMethods } = await ordersModel.getPaymentMethods();
    res.status(200).json({
      success: true,
      message: "Payment methods retrieved successfully.",
      data: paymentMethods,
    });
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

const moveOrdersToHistory = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [customer],
    } = await authModel.findByemail(email, { relation: "customers" });

    if (!customer) {
      return next(createHttpError(404, "Customer not found"));
    }

    const { rows: orders } = await ordersModel.getOrdersByCustomerId(
      customer.customers_id
    );

    if (!orders.length) {
      return next(createHttpError(404, "No orders found for this customer"));
    }

    const { payment_method } = req.body;

    await db.query("BEGIN");

    for (const order of orders) {
      await ordersModel.addOrderToHistory(
        {
          ...order,
          history_id: uuidv4(),
        },
        payment_method
      );
    }

    await ordersModel.deleteOrdersByCustomerId(customer.customers_id);

    await db.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Orders successfully moved to history.",
    });
  } catch (error) {
    await db.query("ROLLBACK");
    return next(createHttpError(500, error.message));
  }
};

const getOrderHistoryByCustomerId = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    // console.log(email);
    const {
      rows: [customer],
    } = await authModel.findByemail(email, { relation: "customers" });

    if (!customer) {
      return next(createHttpError(404, "Customer not found"));
    }

    const { rows: history } = await ordersModel.getOrderHistoryByCustomerId(
      customer.customers_id
    );

    res.status(200).json({
      success: true,
      message: "Order history retrieved successfully.",
      data: history,
    });
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

const getOrderHistoryByStoresId = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [store],
    } = await authModel.findByemail(email, { relation: "stores" });

    if (!store) {
      return next(createHttpError(404, "Store not found"));
    }

    const { rows: history } = await ordersModel.getOrderHistoryByStoresId(
      store.stores_id
    );

    res.status(200).json({
      success: true,
      message: "Order history retrieved successfully.",
      data: history,
    });
  } catch (error) {
    return next(createHttpError(500, error.message));
  }
};

const buyNow = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [customer],
    } = await authModel.findByemail(email, { relation: "customers" });

    if (!customer) {
      return next(createHttpError(404, "Customer not found"));
    }

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
    const order_id = await ordersModel.createOrder(
      customer.customers_id,
      products_id,
      color,
      quantity,
      size
    );

    // Immediately move the order to history
    await ordersModel.addOrderToHistory(
      {
        history_id: uuidv4(),
        order_id,
        customers_id: customer.customers_id,
        products_id,
        stores_id: null,
        color,
        quantity,
        size,
      },
      null //payment method
    );

    res.status(200).json({
      success: true,
      message: "Order placed successfully and moved to history.",
      data: { order_id, products_id, color, quantity, size },
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
  checkout,
  moveOrdersToHistory,
  getOrderHistoryByCustomerId,
  getOrderHistoryByStoresId,
  getPaymentMethods,
  buyNow,
};
