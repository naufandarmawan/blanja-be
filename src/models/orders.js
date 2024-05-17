const { v4: uuidv4 } = require("uuid");
const db = require("../configs/db");

// Create order
const createOrder = async (customers_id, color, quantity, size) => {
  const order_id = uuidv4();
  await db.query(
    `INSERT INTO "order" (order_id, customers_id, color, quantity, size) VALUES ($1, $2, $3, $4, $5)`,
    [order_id, customers_id, color, quantity, size]
  );
  return order_id;
};

const getOrdersByCustomerId = async (customers_id) => {
  return await db.query(`SELECT * FROM "order" WHERE customers_id = $1`, [
    customers_id,
  ]);
};

const getAllOrders = async () => {
  return await db.query('SELECT * FROM "order"');
};

const updateOrder = async (order_id, color, quantity, size) => {
  await db.query(
    `UPDATE "order" SET color = $2, quantity = $3, size = $4 WHERE order_id = $1`,
    [order_id, color, quantity, size]
  );
};

const deleteOrder = async (order_id) => {
  await db.query(`DELETE FROM "order" WHERE order_id = $1`, [order_id]);
};

const findCustomers = async (email) => {
  return await db.query("SELECT customers_id FROM customers WHERE email = $1", [
    email,
  ]);
};

module.exports = {
  createOrder,
  getOrdersByCustomerId,
  findCustomers,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
