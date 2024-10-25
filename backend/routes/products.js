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
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error("ERROR FETCHING PRODUCTS: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await getSingleProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("ERROR FETCHING SINGLE PRODUCT: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new product (admin only)
router.post("/", isLoggedIn, isAdmin, async (req, res) => {
  const { name, description, price, category_id, image_url } = req.body;

  // Validate incoming data
  if (!name || !description || !price) {
    return res
      .status(400)
      .json({ error: "Name, description, and price are required." });
  }

  if (price <= 0) {
    return res.status(400).json({ error: "Price must be a positive number." });
  }

  try {
    const result = await createProduct(
      name,
      description,
      price,
      category_id,
      image_url
    );
    res.status(201).json(result.product);
  } catch (error) {
    console.error("ERROR CREATING PRODUCT: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to update an existing product (admin only)
router.put("/:id", isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id, image_url } = req.body;

  try {
    const result = await updateProduct(id, {
      name,
      description,
      price,
      category_id,
      image_url,
    });

    if (result.success) {
      res.status(200).json(result.product);
    } else {
      res.status(404).json({ error: result.error });
    }
  } catch (error) {
    console.error("ERROR UPDATING PRODUCT: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a product (admin only)
router.delete("/:id", isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteProduct(id);
    if (result.success) {
      res.status(204).send(); // No content to return
    } else {
      res.status(404).json({ error: result.error });
    }
  } catch (error) {
    console.error("ERROR DELETING PRODUCT: ", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
