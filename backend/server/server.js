const express = require("express");
const app = express();
const client = require("../db/client.js");
client.connect(); // Connect to the database client
const {
  createUser,
  authenticate,
  findUserWithToken,
} = require("../db/users/users.js");
const { getProducts, getSingleProduct } = require("../db/products/products.js");
const { getCategories } = require("../db/categories/categories.js");
const { getCart, createCart } = require("../db/cart/cart.js");

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to check if the user is logged in by verifying the authorization token
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Retrieve token from the authorization header
    if (!token) {
      return res.status(401).json({ error: "Authorization token required" }); // Respond with 401 if token is missing
    }
    req.user = await findUserWithToken(token); // Find user associated with the token
    next(); // Proceed to the next middleware or route handler
  } catch (ex) {
    next(ex); // Pass the error to the next middleware for handling
  }
};

// Middleware to check if the user is authorized to access certain resources
const checkUserAuthorization = (req, res, next) => {
  if (req.params.id !== req.user.id) {
    // Compare the user ID in params with the authenticated user ID
    return res.status(401).json({ error: "not authorized" }); // Respond with 401 if not authorized
  }
  next(); // Proceed to the next middleware or route handler
};

// Root route that returns a simple message
app.get("/", (req, res, next) => {
  res.send("Hello World!"); // Responds with "Hello World!" when accessed
});

// Route to get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await getProducts(); // Fetch products from the database
    res.json(products); // Responds with the products in JSON format
  } catch (error) {
    console.error("ERROR FETCHING PRODUCTS: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if fetching fails
  }
});

// Route to get a single product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const product_id = req.params.id; // Get the product ID from the URL parameters
    const product = await getSingleProduct(product_id); // Fetch the product from the database
    res.json(product); // Responds with the product in JSON format
  } catch (error) {
    console.error("ERROR FETCHING SINGLE PRODUCT: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if fetching fails
  }
});

// Route to create a new user
app.post("/api/users", async (req, res) => {
  const { username, password, email } = req.body; // Destructure user data from request body

  try {
    const user = await createUser(username, password, email); // Create a new user
    res.status(201).json(user); // Respond with the created user and a 201 status
  } catch (error) {
    console.error("ERROR CREATING USER: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if user creation fails
  }
});

// Route for user login
app.post("/api/auth/login", async (req, res) => {
  try {
    const tokenResponse = await authenticate(req.body); // Authenticate user and retrieve token
    res.json(tokenResponse); // Respond with the token
  } catch (ex) {
    next(ex); // Pass any error to the next middleware for handling
  }
});

// Route to get the currently logged-in user's information
app.get("/api/auth/me", isLoggedIn, (req, res) => {
  res.json(req.user); // Respond with the authenticated user's information
});

// Route to get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await getCategories(); // Fetch categories from the database
    res.json(categories); // Responds with the categories in JSON format
  } catch (error) {
    console.error("ERROR FETCHING CATEGORIES: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if fetching fails
  }
});

// Route to retrieve the logged-in user's cart
app.get("/api/cart", isLoggedIn, async (req, res) => {
  try {
    const cart = await getCart(req.user.id); // Fetch the cart for the logged-in user
    res.json(cart); // Respond with the cart in JSON format
  } catch (error) {
    console.error("ERROR FETCHING CART: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if fetching fails
  }
});

// Route to add an item to the cart
app.post("/api/cart", isLoggedIn, async (req, res) => {
  const { product_id, quantity } = req.body; // Get product_id and quantity from the request body

  try {
    const cartItem = await createCart({
      // Add the item to the cart
      user_id: req.user.id, // Use the logged-in user's ID
      product_id,
      quantity,
    });
    res.status(201).json(cartItem); // Respond with the created cart item and a 201 status
  } catch (error) {
    console.error("ERROR ADDING ITEM TO CART: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if adding fails
  }
});

// Set the server to listen on a specified port
const PORT = process.env.PORT || 3000; // Use the PORT from environment variables or default to 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // Log the port number when the server starts
