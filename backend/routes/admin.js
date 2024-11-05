// Importing required modules and functions
const express = require("express");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../db/products/products.js");
const { getUsers } = require("../db/users/users.js");
const { getAllOrders } = require("../db/orders/orders.js");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Route to get all users, accessible only by logged-in admins
router.get("/users", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const users = await getUsers(); // Fetch users from DB
    res.json(users); // Return users as JSON response
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" }); // Handle errors
  }
});

// Route to get all products, accessible only by logged-in admins
router.get("/products", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const products = await getProducts(); // Fetch products from DB
    res.json(products); // Return products as JSON response
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" }); // Handle errors
  }
});

// Route to create a new product, accessible only by logged-in admins
router.post("/products", isLoggedIn, isAdmin, async (req, res) => {
  const { name, description, price, category_id, image_url } = req.body; // Destructure product data from the request body
  try {
    const result = await createProduct(name, description, price, category_id, image_url); // Create a new product
    if (result.success) {
      return res.status(201).json(result.product); // Return created product
    }
    return res.status(400).json({ error: result.error || "Error creating product" }); // Handle error in product creation
  } catch (error) {
    res.status(500).json({ error: "Error creating product" }); // Handle unexpected errors
  }
});

// Route to update an existing product by ID, accessible only by logged-in admins
router.put("/products/:id", isLoggedIn, isAdmin, async (req, res) => {
  const productId = parseInt(req.params.id); // Parse the product ID from the request parameters
  const data = req.body; // Get updated product data from the request body

  try {
    const result = await updateProduct(productId, data); // Update the product in the DB
    if (result.success) {
      return res.json(result.product); // Return updated product
    }
    return res.status(400).json({ error: result.error || "Error updating product" }); // Handle error in updating product
  } catch (error) {
    res.status(500).json({ error: "Error updating product" }); // Handle unexpected errors
  }
});

// Route to delete a product by ID, accessible only by logged-in admins
router.delete("/products/:id", isLoggedIn, isAdmin, async (req, res) => {
  const productId = parseInt(req.params.id); // Parse the product ID from the request parameters
  try {
    const result = await deleteProduct(productId); // Attempt to delete the product from the DB
    if (result.success) {
      return res.status(204).send(); // No content response for successful deletion
    }
    return res.status(404).json({ error: result.error || "Product not found" }); // Handle product not found error
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" }); // Handle unexpected errors
  }
});

// Route to get all orders, accessible only by logged-in admins
router.get("/orders", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const orders = await getAllOrders(); // Fetch orders from DB
    res.json(orders); // Return orders as JSON response
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" }); // Handle errors
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
