const { v4: uuidv4 } = require("uuid");
const newError = require("http-errors");
const { response } = require("../helper/common");
const {
  postAddress,
  readAddress,
  putAddress,
  dropAddress,
} = require("../models/address");

// Add Address
const addAddress = async (req, res, next) => {
  const email = req.decoded.email;
  const {
    save_address,
    recipient_name,
    recipient_phone,
    recipient_address,
    postal_code,
    city,
  } = req.body;
  const id = uuidv4();
  const dataAddress = {
    address_id: id,
    save_address,
    recipient_name,
    recipient_phone,
    recipient_address,
    postal_code,
    city,
  };

  try {
    await postAddress(dataAddress, email);
    response(res, dataAddress, 200, "Address successfully Added!");
  } catch (error) {
    console.log(error);
    next(new newError.InternalServerError());
  }
};
// Add Address

// Get Address
const getAddress = async (req, res, next) => {
  try {
    const email = req.decoded.email;

    const { rows } = await readAddress(email);

    if (rows == 0) {
      return next(new newError.NotFound("Address Not Found"));
    }
    response(res, rows, 200, "get Address success");
  } catch (error) {
    console.log(error);
    next(new newError.InternalServerError());
  }
};
// Get Address

// Update Address
const updateAddress = async (req, res, next) => {
  const id = req.params.id;
  const {
    save_address,
    recipient_name,
    recipient_phone,
    recipient_address,
    postal_code,
    city,
  } = req.body;
  const dataAddress = {
    save_address,
    recipient_name,
    recipient_phone,
    recipient_address,
    postal_code,
    city,
  };
  try {
    await putAddress(dataAddress, id);
    response(res, dataAddress, 200, "Address successfully Updated!");
  } catch (error) {
    console.log(error);
    next(new newError.InternalServerError());
  }
};
// Update Address

// Delete Address
const deleteAddress = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  try {
    await dropAddress(id);
    response(res, { id }, 200, "Address Succesfully Deleted!!!");
  } catch (error) {
    console.log(error);
    next(new newError.InternalServerError());
  }
};
// Delete Address

module.exports = {
  addAddress,
  getAddress,
  updateAddress,
  deleteAddress,
};
