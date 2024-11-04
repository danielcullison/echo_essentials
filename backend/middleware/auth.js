const { findUserWithToken } = require("../db/users/users.js");

const isLoggedIn = async (req, res, next) => {
  try {
    // Check if the Authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1]; // Assuming the format is "Bearer token"
    if (!token) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    // Find the user associated with the token
    const user = await findUserWithToken(token);
    
    // Check if the user was found
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log("Authenticated user:", user);
    
    // Attach the user to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (ex) {
    console.error("Authentication error: ", ex);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const checkUserAuthorization = (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return res.status(401).json({ error: "not authorized" });
  }
  next();
};

const isAdmin = (req, res, next) => {
  console.log("Checking admin for user:", req.user);
  if (req.user && req.user.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Forbidden: Admin access required" });
};

module.exports = {
  isLoggedIn,
  checkUserAuthorization,
  isAdmin
};
