const pool = require("../configs/db");

const postUsers = (dataUsers) => {
  return pool.query(
    "INSERT INTO users (user_id, email, password, role) VALUES ($1, $2, $3, $4)",
    [dataUsers.user_id, dataUsers.email, dataUsers.password, dataUsers.role]
  );
};

const postStores = (dataWorkers) => {
  return pool.query(
    "INSERT INTO stores (stores_id, user_id, store_name, phone) VALUES ($1, $2, $3, $4)",
    [
      dataWorkers.id,
      dataWorkers.user_id,
      dataWorkers.store_name,
      dataWorkers.phone,
    ]
  );
};

const updateStores = (dataStores, email) => {
  return pool.query(
    "UPDATE stores SET store_name = $1, phone = $2, store_description = $3 FROM users WHERE stores.user_id = users.user_id AND users.email = $4",
    [
      dataStores.store_name,
      dataStores.phone,
      dataStores.store_description,
      email,
    ]
  );
};

module.exports = {
  postUsers,
  postStores,
  updateStores,
};
