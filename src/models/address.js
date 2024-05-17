const pool = require("../configs/db");

const postAddress = (dataAddress, email) => {
  return pool.query(
    `INSERT INTO address (
        address_id,
        save_address, 
        recipient_name, 
        recipient_phone, 
        recipient_address, 
        postal_code, 
        city, 
        customers_id
    ) SELECT $1, $2, $3, $4, $5, $6, $7, customers.customers_id FROM customers JOIN users ON customers.user_id = users.user_id WHERE users.email = $8`,
    [
      dataAddress.address_id,
      dataAddress.save_address,
      dataAddress.recipient_name,
      dataAddress.recipient_phone,
      dataAddress.recipient_address,
      dataAddress.postal_code,
      dataAddress.city,
      email,
    ]
  );
};

const readAddress = (email) => {
  return pool.query(
    "SELECT address.address_id, address.save_address, address.recipient_name, address.recipient_phone, address.recipient_address, address.postal_code, address.city FROM address JOIN customers ON address.customers_id = customers.customers_id JOIN users ON customers.user_id = users.user_id WHERE users.email = $1",
    [email]
  );
};

const putAddress = (dataAddress, id) => {
  return pool.query(
    "UPDATE address SET save_address = $1, recipient_name = $2, recipient_phone = $3, recipient_address = $4, postal_code = $5, city = $6 WHERE address_id = $7",
    [
      dataAddress.save_address,
      dataAddress.recipient_name,
      dataAddress.recipient_phone,
      dataAddress.recipient_address,
      dataAddress.postal_code,
      dataAddress.city,
      id,
    ]
  );
};

const dropAddress = (id) => {
  return pool.query("DELETE FROM address WHERE address_id = $1", [id]);
};

module.exports = {
  postAddress,
  readAddress,
  putAddress,
  dropAddress,
};
