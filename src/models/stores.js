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
    [dataWorkers.id, dataWorkers.user_id, dataWorkers.store_name, dataWorkers.phone]
  );
};

module.exports = {
  postUsers,
  postStores,
};
