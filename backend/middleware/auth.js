// Importing the function to find user by token
const { findUserWithToken } = require("../db/users/users.js");

// Middleware to check if the user is logged in
const isLoggedIn = async (req, res, next) => {
  try {
    // Check if the Authorization header is present in the request
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    // Extract the token from the Authorization header (Bearer token format)
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    // Find the user associated with the provided token
    const user = await findUserWithToken(token);
    
    // If no user is found, return an error
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Attach the user object to the request object for access in subsequent middleware/routes
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (ex) {
    // Log the error and return a server error response if something goes wrong
    console.error("Authentication error: ", ex);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware to check if the logged-in user is authorized to access the resource
const checkUserAuthorization = (req, res, next) => {
  // If the user ID from the request params doesn't match the logged-in user's ID, deny access
  if (req.params.id !== req.user.id) {
    return res.status(401).json({ error: "Not authorized" });
  }

  // Proceed if the user is authorized
  next();
};

// Middleware to check if the logged-in user is an admin
const isAdmin = (req, res, next) => {
  // If the logged-in user is an admin, proceed to the next middleware or route handler
  if (req.user && req.user.user.role === "admin") {
    return next();
  }

  // If the user is not an admin, return a forbidden error
  return res.status(403).json({ error: "Forbidden: Admin access required" });
};

// Export the middleware functions to use in routes
module.exports = {
  isLoggedIn,
  checkUserAuthorization,
  isAdmin,
};
