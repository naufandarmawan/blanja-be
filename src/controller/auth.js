const newError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("../helper/common");
const { generateToken, generateRefreshToken } = require("../helper/auth");
const { findByemail } = require("../models/auth");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const {
      rows: [user],
    } = await findByemail(email);
    if (!user) {
      return next(newError(403, "email atau password salah"));
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return next(newError(403, "email atau password salah"));
    }
    delete user.password;
    const payload = {
      email: user.email,
      role: user.role,
    };
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);
    response(res, { ...user, token, refreshToken }, 200, "anda berhasil login");
  } catch (error) {
    console.log(error);
    next(new newError.InternalServerError());
  }
};

const refreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT);

  const payload = {
    email: decoded.email,
    role: decoded.role,
  };

  const data = {
    token: generateToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
  response(res, data, 200, "Refresh Token Success");
};

module.exports = {
  login,
  refreshToken,
};
