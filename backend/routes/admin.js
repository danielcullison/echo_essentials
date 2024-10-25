const express = require("express");
const { getUsers } = require("../db/users/users.js");
const { getProducts } = require("../db/products/products.js");
const { getAllOrders } = require("../db/orders/orders.js");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Route to get all users (admin only)
router.get("/users", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error("ERROR FETCHING USERS: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get all products (admin only)
router.get("/products", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error("ERROR FETCHING PRODUCTS: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get all orders (admin only)
router.get("/orders", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error("ERROR FETCHING ORDERS: ", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
