const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (bearerToken && bearerToken.startsWith("Bearer")) {
      const token = bearerToken.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
      req.decoded = decoded;
      next();
    } else {
      next(createHttpError(401, "Unauthorized: Token is required"));
    }
  } catch (error) {
    next(createHttpError(401, "Unauthorized: Invalid or expired token"));
  }
};

const checkRole = (roleName) => {
  return (req, res, next) => {
    const role = req.decoded.role;
    if (role !== roleName) {
      next(createHttpError(403, `Forbidden: ${roleName} only`));
      return;
    }
    next();
  };
};
module.exports = {
  protect,
  checkRole,
};
