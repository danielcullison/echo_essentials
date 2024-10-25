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

// Route to create a new user
router.post("/", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const user = await createUser(username, password, email);
    res.status(201).json(user);
  } catch (error) {
    console.error("ERROR CREATING USER: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get user profile information
router.get("/:id", isLoggedIn, checkUserAuthorization, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserInfo(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("ERROR FETCHING USER PROFILE: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to update user profile
router.put("/:id", isLoggedIn, checkUserAuthorization, async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const updatedUser = await updateUserInfo(id, {
      username,
      email,
      password,
    });

    if (!updatedUser) {
      return res.status(400).json({ error: "No updates provided" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("ERROR UPDATING USER PROFILE: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to retrieve user order history
router.get(
  "/:id/orders",
  isLoggedIn,
  checkUserAuthorization,
  async (req, res) => {
    const { id } = req.params;

    try {
      const orders = await getOrders(id);
      res.json(orders);
    } catch (error) {
      console.error("ERROR FETCHING ORDERS: ", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Route to get all users (admin only)
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error("ERROR FETCHING USERS: ", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
