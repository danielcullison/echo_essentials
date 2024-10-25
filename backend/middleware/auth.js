const { findUserWithToken } = require("../db/users/users.js");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Authorization token required" });
    }
    req.user = await findUserWithToken(token);
    next();
  } catch (ex) {
    next(ex);
  }
};

const checkUserAuthorization = (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return res.status(401).json({ error: "not authorized" });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Forbidden: Admin access required" });
};

module.exports = {
  isLoggedIn,
  checkUserAuthorization,
  isAdmin,
};
