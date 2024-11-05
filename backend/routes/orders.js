// Importing required modules and functions
const express = require("express");
const { isLoggedIn } = require("../middleware/auth");
const { createOrder, getOrders, getAllOrders } = require("../db/orders/orders");

const router = express.Router();

// Route to create a new order, accessible only by logged-in users
router.post("/", isLoggedIn, async (req, res) => {
  const { total_amount, status } = req.body; // Destructure order details from request body
  const user_id = req.user.id; // Get the logged-in user's ID

  try {
    const result = await createOrder(user_id, total_amount, status); // Create the order
    if (result.success) {
      return res.status(201).json({ message: "Order created successfully." }); // Return success message
    }
    return res.status(500).json({ error: result.error }); // Handle order creation failure
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Handle unexpected errors
  }
});

// Route to get orders for the logged-in user
router.get("/", isLoggedIn, async (req, res) => {
  const user_id = req.user.id; // Get the logged-in user's ID

  try {
    const orders = await getOrders(user_id); // Fetch orders for the user
    return res.json(orders); // Return orders as JSON
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Handle unexpected errors
  }
});

// Route to get all orders, accessible only by logged-in users
router.get("/all", isLoggedIn, async (req, res) => {
  try {
    const result = await getAllOrders(); // Fetch all orders
    if (result.success) {
      return res.json(result.orders); // Return all orders
    }
    return res.status(500).json({ error: result.error }); // Handle failure to fetch orders
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Handle unexpected errors
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
