const pool = require("../configs/db");

const postUsers = (dataUsers) => {
  return pool.query(
    "INSERT INTO users (user_id, email, password, role) VALUES ($1, $2, $3, $4)",
    [dataUsers.user_id, dataUsers.email, dataUsers.password, dataUsers.role]
  );
};

const postCustomers = (dataCustomers) => {
  return pool.query(
    "INSERT INTO customers (customers_id, user_id, name) VALUES ($1, $2, $3)",
    [dataCustomers.id, dataCustomers.user_id, dataCustomers.name]
  );
};

const updateUsers = (dataUsers, Cemail) => {
  return pool.query("UPDATE users SET email = $1 WHERE email = $2", [
    dataUsers.email,
    Cemail,
  ]);
};

const updateCustomers = (dataCustomers, Cemail) => {
  return pool.query(
    "UPDATE customers SET name = $1, phone = $2, gender = $3, date_of_birth = $4 FROM users WHERE customers.user_id = users.user_id AND users.email = $5",
    [
      dataCustomers.name,
      dataCustomers.phone,
      dataCustomers.gender,
      dataCustomers.date_of_birth,
      Cemail,
    ]
  );
};

module.exports = {
  postUsers,
  postCustomers,
  updateCustomers,
  updateUsers,
};
