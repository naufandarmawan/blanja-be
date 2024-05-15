const { v4: uuidv4 } = require("uuid");
const { response } = require("../helper/common");
const newError = require("http-errors");
const { findByemail } = require("../models/auth");
const { postUsers, postStores, updateStores } = require("../models/stores");

// Add Stores
const bcrypt = require("bcrypt");
const saltRounds = 10;

const addStores = async (req, res, next) => {
  const { email, password, store_name, phone } = req.body;
  const userId = uuidv4();
  const id = uuidv4();
  const {
    rows: [user],
  } = await findByemail(email);
  if (user) {
    return next(newError(403, "User Sudah terdaftar"));
  }

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    if (err) {
      return next(newError(500, "Error hashing password"));
    }

    const dataUsers = {
      user_id: userId,
      email,
      password: hash,
      role: "store",
    };
    const dataStores = {
      id: id,
      user_id: dataUsers.user_id,
      store_name,
      phone,
    };

    try {
      await postUsers(dataUsers);
      await postStores(dataStores);
      response(res, null, 200, "Users successfully Added!");
    } catch (error) {
      console.log(error);
      next(new newError.InternalServerError());
    }
  });
};
// Add Stores

// Get Profile Stores
const profileStores = async (req, res, next) => {
  try {
    const email = req.decoded.email;

    const {
      rows: [user],
    } = await findByemail(email, { relation: "stores" });

    delete user.password;
    response(res, user, 200, "get profile success");
  } catch (error) {
    console.log(error);
    next(new newError.InternalServerError());
  }
};
// Get Profile Stores

// Update Stores
const putStores = async (req, res, next) => {
  const email = req.decoded.email;
  const { store_name, phone, store_description } = req.body;

  const dataStores = {
    store_name,
    phone,
    store_description,
  };
  try {
    await updateStores(dataStores, email);
    response(res, dataStores, 200, "Data successfully Added!");
  } catch (error) {
    console.log(error);
    next(new newError.InternalServerError());
  }
};
// Update Stores

module.exports = {
  addStores,
  putStores,
  profileStores,
};
