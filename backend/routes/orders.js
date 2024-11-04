const express = require("express");
const { isLoggedIn } = require("../middleware/auth");
const { createOrder, getOrders, getAllOrders } = require("../db/orders/orders");

const router = express.Router();

// Create a new order
router.post("/", isLoggedIn, async (req, res) => {
    const { total_amount, status } = req.body;
    const user_id = req.user.id;

    const result = await createOrder(user_id, total_amount, status);
    if (result.success) {
        return res.status(201).json({ message: "Order created successfully." });
    }
    return res.status(500).json({ error: result.error });
});

// Get orders for the logged-in user
router.get("/", isLoggedIn, async (req, res) => {
    const user_id = req.user.id;

    const orders = await getOrders(user_id);
    return res.json(orders);
});

// Get all orders (admin only)
router.get("/all", isLoggedIn, async (req, res) => {
    const result = await getAllOrders();
    if (result.success) {
        return res.json(result.orders);
    }
    return res.status(500).json({ error: result.error });
});

module.exports = router;
