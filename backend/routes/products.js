// Importing required modules and functions
const express = require("express");
const {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../db/products/products.js");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Route to get all products
router.get("/", async (req, res) => {
  try {
    const products = await getProducts(); // Fetch all products
    res.json(products); // Return products as JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle unexpected errors
  }
});

// Route to get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await getSingleProduct(req.params.id); // Fetch product by ID
    if (!product) {
      return res.status(404).json({ error: "Product not found" }); // Handle product not found
    }
    res.json(product); // Return the product as JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle unexpected errors
  }
});

// Route to create a new product, accessible only by logged-in admins
router.post("/", isLoggedIn, isAdmin, async (req, res) => {
  const { name, description, price, category_id, image_url } = req.body; // Destructure product data

  // Validate required fields
  if (!name || !description || !price) {
    return res.status(400).json({ error: "Name, description, and price are required." });
  }

  // Validate price
  if (price <= 0) {
    return res.status(400).json({ error: "Price must be a positive number." });
  }

  try {
    const result = await createProduct(name, description, price, category_id, image_url); // Create a new product
    res.status(201).json(result.product); // Return created product
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle unexpected errors
  }
});

// Route to update an existing product by ID, accessible only by logged-in admins
router.put("/:id", isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params; // Get product ID from request parameters
  const { name, description, price, category_id, image_url } = req.body; // Get updated product data

  try {
    const result = await updateProduct(id, {
      name,
      description,
      price,
      category_id,
      image_url,
    }); // Update the product

    if (result.success) {
      res.status(200).json(result.product); // Return updated product
    } else {
      res.status(404).json({ error: result.error }); // Handle product not found
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle unexpected errors
  }
});

// Route to delete a product by ID, accessible only by logged-in admins
router.delete("/:id", isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params; // Get product ID from request parameters

  try {
    const result = await deleteProduct(id); // Attempt to delete the product
    if (result.success) {
      res.status(204).send(); // No content response for successful deletion
    } else {
      res.status(404).json({ error: result.error }); // Handle product not found
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle unexpected errors
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
