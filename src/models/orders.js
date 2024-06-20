const { v4: uuidv4 } = require("uuid");
const db = require("../configs/db");

// Create order
const createOrder = async (
  customers_id,
  products_id,
  color,
  quantity,
  size
) => {
  const order_id = uuidv4();
  await db.query(
    `INSERT INTO "order" (order_id, customers_id, products_id, color, quantity, size) VALUES ($1, $2, $3, $4, $5, $6 )`,
    [order_id, customers_id, products_id, color, quantity, size]
  );
  return order_id;
};

const getOrdersByCustomerId = async (customers_id) => {
  const query = `
    SELECT 
      o.*,
      p.name AS product_name,
      p.image AS product_image,
      p.price AS product_price,
      p.condition AS product_condition,
      p.description AS product_description,
      SUM(p.price) OVER (PARTITION BY o.order_id) AS total_price
    FROM "order" o
    JOIN products p ON o.products_id = p.products_id
    WHERE o.customers_id = $1
  `;

  return await db.query(query, [customers_id]);
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
