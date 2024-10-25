const express = require("express");
const { createUser, authenticate } = require("../db/users/users.js");
const { isLoggedIn } = require("../middleware/auth");

const router = express.Router();

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

router.post("/login", async (req, res, next) => {
  try {
    const tokenResponse = await authenticate(req.body);
    res.json(tokenResponse);
  } catch (ex) {
    next(ex);
  }
});

router.get("/me", isLoggedIn, (req, res) => {
  res.json(req.user);
});

module.exports = router;
