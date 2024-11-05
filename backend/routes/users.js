// Importing required modules and functions
const express = require("express");
const {
  createUser,
  getUserInfo,
  updateUserInfo,
  getUsers,
} = require("../db/users/users.js");
const { isLoggedIn, checkUserAuthorization } = require("../middleware/auth");
const { getOrders } = require("../db/orders/orders.js");

const router = express.Router();

// Route to get user information by ID, accessible only by the logged-in user or authorized users
router.get("/:id", isLoggedIn, checkUserAuthorization, async (req, res) => {
  const { id } = req.params; // Get user ID from request parameters

  try {
    const user = await getUserInfo(id); // Fetch user information
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Handle user not found
    }
    res.json(user); // Return user information as JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle unexpected errors
  }
});

// Route to update user information by ID, accessible only by the logged-in user or authorized users
router.put("/:id", isLoggedIn, checkUserAuthorization, async (req, res) => {
  const { id } = req.params; // Get user ID from request parameters
  const { username, email, password } = req.body; // Get updated user data from request body

  try {
    const updatedUser = await updateUserInfo(id, { username, email, password }); // Update user information

    if (!updatedUser) {
      return res.status(400).json({ error: "No updates provided" }); // Handle no updates
    }

    res.json(updatedUser); // Return updated user information
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle unexpected errors
  }
});

// Route to get orders associated with a user by ID, accessible only by the logged-in user or authorized users
router.get(
  "/:id/orders",
  isLoggedIn,
  checkUserAuthorization,
  async (req, res) => {
    const { id } = req.params; // Get user ID from request parameters

    try {
      const orders = await getOrders(id); // Fetch orders for the user
      res.json(orders); // Return orders as JSON
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle unexpected errors
    }
  }
);

// Route to get all users, accessible only by logged-in users
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const users = await getUsers(); // Fetch all users
    res.json(users); // Return users as JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle unexpected errors
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
