const express = require("express");
const {
  getCart,
  createCart,
  updateCartItem,
  deleteCartItem,
} = require("../db/cart/cart.js");
const { isLoggedIn } = require("../middleware/auth");

const router = express.Router();

// Route to retrieve the logged-in user's cart
router.get("/", isLoggedIn, async (req, res) => {
  const { user } = req.user;
  try {
    const cart = await getCart(user.id);
    res.json(cart);
  } catch (error) {
    console.error("ERROR FETCHING CART: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to create a cart
router.post("/", isLoggedIn, async (req, res) => {
  const { product_id, quantity } = req.body;
  const { user } = req.user;
  
  console.log("user", req.user);
  try {
    const cart = await createCart(
      user.id,
      product_id,
      quantity,
    );
    res.status(201).json(cart);
  } catch (error) {
    console.error("ERROR ADDING ITEM TO CART: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to update an item in the cart
router.put("/:product_id", isLoggedIn, async (req, res) => {
  const { product_id } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCartItem = await updateCartItem(req.user.id, product_id, {
      quantity,
    });
    res.json(updatedCartItem);
  } catch (error) {
    console.error("ERROR UPDATING CART ITEM: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to remove an item from the cart
router.delete("/:product_id", isLoggedIn, async (req, res) => {
  const { product_id } = req.params;

  try {
    await deleteCartItem(req.user.id, product_id);
    res.status(204).send(); // No content to return
  } catch (error) {
    console.error("ERROR DELETING CART ITEM: ", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
