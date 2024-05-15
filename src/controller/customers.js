const { v4: uuidv4 } = require("uuid");
const { response } = require("../helper/common");
const newError = require("http-errors");
const { findByemail } = require("../models/auth");
const {
  postUsers,
  postCustomers,
  updateCustomers,
} = require("../models/customers");

// Add Customers
const bcrypt = require("bcrypt");
const saltRounds = 10;

const addCustomers = async (req, res, next) => {
  const { email, password, name } = req.body;
  const userId = uuidv4();
  const id = uuidv4();
  const {
    rows: [user],
  } = await findByemail(email);
  if (user) {
    return next(newError(403, "User Already Registered"));
  }

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    if (err) {
      return next(newError(500, "Error hashing password"));
    }

    const dataUsers = {
      user_id: userId,
      email,
      password: hash,
      role: "customer",
    };
    const dataCustomers = {
      id: id,
      user_id: dataUsers.user_id,
      name,
    };

    try {
      await postUsers(dataUsers);
      await postCustomers(dataCustomers);
      response(res, null, 200, "Users successfully Added!");
    } catch (error) {
      console.log(error);
      next(new newError.InternalServerError());
    }
  });
};
// Add Customers

// Get Profile Customers
const profileCustomers = async (req, res, next) => {
  try {
    const email = req.decoded.email;

    const {
      rows: [user],
    } = await findByemail(email, { relation: "customers" });

    delete user.password;
    response(res, user, 200, "get profile success");
  } catch (error) {
    console.log(error);
    next(new newError.InternalServerError());
  }
};
// Get Profile Customers

// Update Customers
const putCustomers = async (req, res, next) => {
  const email = req.decoded.email;
  const { name, phone, gender, date_of_birth } = req.body;

  const dataCustomers = {
    name,
    phone,
    gender,
    date_of_birth,
  };
  try {
    await updateCustomers(dataCustomers, email);
    response(res, dataCustomers, 200, "Data successfully Added!");
  } catch (error) {
    console.log(error);
    next(new newError.InternalServerError());
  }
};
// Update Customers

module.exports = {
  addCustomers,
  profileCustomers,
  putCustomers,
};
