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

// Route to get all users (admin only)
router.get("/users", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error("ERROR FETCHING USERS: ", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Route to get all products (admin only)
router.get("/products", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error("ERROR FETCHING PRODUCTS: ", error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Route to create a new product (admin only)
router.post("/products", isLoggedIn, isAdmin, async (req, res) => {
  const { name, description, price, category_id, image_url } = req.body;
  try {
    const result = await createProduct(name, description, price, category_id, image_url);
    if (result.success) {
      return res.status(201).json(result.product);
    }
    return res.status(400).json({ error: result.error || "Error creating product" });
  } catch (error) {
    console.error("ERROR CREATING PRODUCT: ", error);
    res.status(500).json({ error: "Error creating product" });
  }
});

// Route to update an existing product (admin only)
router.put("/products/:id", isLoggedIn, isAdmin, async (req, res) => {
  const productId = parseInt(req.params.id);
  const data = req.body;

  try {
    const result = await updateProduct(productId, data);
    if (result.success) {
      return res.json(result.product);
    }
    return res.status(400).json({ error: result.error || "Error updating product" });
  } catch (error) {
    console.error("ERROR UPDATING PRODUCT: ", error);
    res.status(500).json({ error: "Error updating product" });
  }
});

// Route to delete a product (admin only)
router.delete("/products/:id", isLoggedIn, isAdmin, async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const result = await deleteProduct(productId);
    if (result.success) {
      return res.status(204).send(); // No content to send back on successful delete
    }
    return res.status(404).json({ error: result.error || "Product not found" });
  } catch (error) {
    console.error("ERROR DELETING PRODUCT: ", error);
    res.status(500).json({ error: "Error deleting product" });
  }
});

// Route to get all orders (admin only)
router.get("/orders", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error("ERROR FETCHING ORDERS: ", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

module.exports = router;
