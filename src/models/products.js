const db = require("../configs/db");

// Create product
const insertProduct = (data) => {
  const {
    products_id,
    name,
    image,
    price,
    color,
    size,
    stock,
    condition,
    description,
    stores_id,
    category,
  } = data;

  return db.query(
    `INSERT INTO products (
      products_id,
      name,
      image,
      price,
      color,
      size,
      stock,
      condition,
      description,
      stores_id,
      category
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      products_id,
      name,
      image,
      price,
      color,
      size,
      stock,
      condition,
      description,
      stores_id,
      category,
    ]
  );
};

// Get all products
const selectAllProducts = ({ limit, offset, sort, sortBy, search }) => {
  let query = "SELECT * FROM products";
  const queryParams = [];

  if (search) {
    query += " WHERE name ILIKE $1";
    queryParams.push(`%${search}%`);
  }

  query += ` ORDER BY ${sort} ${sortBy}`;

  if (limit !== undefined) {
    query += ` LIMIT $${queryParams.length + 1}`;
    queryParams.push(limit);
    if (offset !== undefined) {
      query += ` OFFSET $${queryParams.length + 1}`;
      queryParams.push(offset);
    }
  }

  return db.query(query, queryParams);
};

const countDataProduct = (search) => {
  const queryParams = [];
  let query = "SELECT COUNT(*) AS total FROM products";

  if (search) {
    query += " WHERE name ILIKE $1";
    queryParams.push(`%${search}%`);
  }

  return db.query(query, queryParams);
};

// Get Detail Product
const selectDetailProduct = (products_id) => {
  return db.query("SELECT * FROM products WHERE products_id = $1", [
    products_id,
  ]);
};

// Get Products By stores_id
const selectProductByStoresId = (stores_id) => {
  return db
    .query("SELECT * FROM products WHERE stores_id = $1", [stores_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return {
          success: false,
          message: "You don't have any products",
          data: [],
        };
      }
      return {
        success: true,
        message: "Get products success",
        data: result.rows,
      };
    })
    .catch((err) => {
      return {
        success: false,
        message: `Get products failed: ${err}`,
      };
    });
};

// Update Product
const updateProduct = (data) => {
  const {
    products_id,
    name,
    image,
    price,
    color,
    size,
    stock,
    condition,
    description,
    category,
  } = data;

  return db.query(
    `UPDATE products SET
      name = $1,
      image = $2,
      price = $3,
      color = $4,
      size = $5,
      stock = $6,
      condition = $7,
      description = $8,
      category = $9
    WHERE products_id = $10`,
    [
      name,
      image,
      price,
      color,
      size,
      stock,
      condition,
      description,
      category,
      products_id,
    ]
  );
};

// Delete product
const deleteProduct = (products_id) => {
  return db.query("DELETE FROM products WHERE products_id = $1", [products_id]);
};

module.exports = {
  insertProduct,
  selectAllProducts,
  countDataProduct,
  selectDetailProduct,
  selectProductByStoresId,
  updateProduct,
  deleteProduct,
};
