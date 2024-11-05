// Import required modules and routes
const express = require("express");
const cors = require('cors');
const client = require("../db/client.js");
const authRoutes = require("../routes/auth");
const productRoutes = require("../routes/products");
const userRoutes = require("../routes/users");
const cartRoutes = require("../routes/cart");
const adminRoutes = require("../routes/admin");
const orderRoutes = require("../routes/orders");

// Initialize Express app
const app = express();

// Connect to the database
client.connect();

// Middleware to parse JSON requests
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS) for handling cross-origin requests
app.use(cors());

// Route handling for various endpoints
app.use("/api/auth", authRoutes);  // Authentication routes (signup, login, etc.)
app.use("/api/products", productRoutes);  // Product-related routes (GET, POST, PUT, DELETE)
app.use("/api/users", userRoutes);  // User-related routes (profile, orders, etc.)
app.use("/api/cart", cartRoutes);  // Cart-related routes (add, update, delete items)
app.use("/api/admin", adminRoutes);  // Admin routes for managing users, products, etc.
app.use("/api/orders", orderRoutes);  // Order-related routes (create, view, etc.)

// Default route to check server status
app.get("/", (req, res) => {
  res.send("Hello World!");  // Respond with a simple message for root route
});

// Set the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // Log the port on which the server is running
