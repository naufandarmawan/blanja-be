const pool = require("../configs/db");

const postUsers = (dataUsers) => {
  return pool.query(
    "INSERT INTO users (user_id, email, password, role) VALUES ($1, $2, $3, $4)",
    [dataUsers.user_id, dataUsers.email, dataUsers.password, dataUsers.role]
  );
};

const postStores = (dataStores) => {
  return pool.query(
    "INSERT INTO stores (stores_id, user_id, store_name, phone, name) VALUES ($1, $2, $3, $4, $5)",
    [
      dataStores.id,
      dataStores.user_id,
      dataStores.store_name,
      dataStores.phone,
      dataStores.name,
    ]
  );
};

const updateStores = (dataStores, email) => {
  return pool.query(
    "UPDATE stores SET store_name = $1, phone = $2, store_description = $3, image = $4 FROM users WHERE stores.user_id = users.user_id AND users.email = $5",
    [
      dataStores.store_name,
      dataStores.phone,
      dataStores.store_description,
      dataStores.image,
      email,
    ]
  );
};

const updatePhoto = (urlPhoto, id) => {
  return pool.query("UPDATE stores SET image = $1 WHERE user_id = $2", [
    urlPhoto,
    id,
  ]);
};

module.exports = {
  postUsers,
  postStores,
  updateStores,
  updatePhoto,
};
