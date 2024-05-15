const pool = require("../configs/db");

const findByemail = (email, { relation } = { relation: "" }) => {
  return pool.query(
    `SELECT users.user_id, users.email, users.password, users.role ${
      relation ? `, ${relation}.*` : ""
    } FROM users ${
      relation ? ` JOIN ${relation} ON users.user_id = ${relation}.user_id` : ""
    } WHERE email = $1`,
    [email]
  );
};

const findByemailProfile = (email) => {
  return pool.query(`SELECT users.email FROM users WHERE email = $1`, [email]);
};

module.exports = {
  findByemail,
  findByemailProfile,
};
