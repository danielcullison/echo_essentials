// Importing required modules and functions
const express = require("express");
const { createUser, authenticate } = require("../db/users/users.js");
const { isLoggedIn } = require("../middleware/auth");

const router = express.Router();

// Route to handle user signup
router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body; // Destructure user data from request body
  try {
    const user = await createUser(username, password, email); // Create a new user
    res.status(201).json(user); // Return created user with status 201
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors with a relevant message
  }
});

// Route to handle user login
router.post("/login", async (req, res, next) => {
  try {
    const tokenResponse = await authenticate(req.body); // Authenticate user and get token
    res.json(tokenResponse); // Return token response
  } catch (ex) {
    next(ex); // Pass the error to the next middleware for centralized error handling
  }
});

// Route to get current user's information, accessible only by logged-in users
router.get("/me", isLoggedIn, (req, res) => {
  res.json(req.user); // Return the logged-in user's information
});

// Export the router to be used in other parts of the application
module.exports = router;
