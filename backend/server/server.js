const express = require("express");
const app = express();
const client = require("../db/client.js");
client.connect(); // Connect to the database client
const {
  createUser,
  authenticate,
  findUserWithToken,
  getUserInfo,
  updateUserInfo,
  getUsers,
} = require("../db/users/users.js");
const {
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../db/products/products.js");
const { getCategories } = require("../db/categories/categories.js");
const {
  getCart,
  createCart,
  updateCartItem,
  deleteCartItem,
} = require("../db/cart/cart.js");

const { getOrders, getAllOrders } = require("../db/orders/orders.js");

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

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next(); // Proceed if the user is an admin
  }
  return res.status(403).json({ error: "Forbidden: Admin access required" }); // Deny access if not an admin
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

// Route to update an item in the cart
app.put("/api/cart/:product_id", isLoggedIn, async (req, res) => {
  const { product_id } = req.params; // Get the product ID from the URL parameters
  const { quantity } = req.body; // Get the new quantity from the request body

  try {
    const updatedCartItem = await updateCartItem(req.user.id, product_id, {
      quantity,
    });

    res.json(updatedCartItem); // Respond with the updated cart item
  } catch (error) {
    console.error("ERROR UPDATING CART ITEM: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if updating fails
  }
});

// Route to remove an item from the cart
app.delete("/api/cart/:product_id", isLoggedIn, async (req, res) => {
  const { product_id } = req.params; // Get the product ID from the URL parameters

  try {
    await deleteCartItem(req.user.id, product_id);

    res.status(204).send(); // Respond with a 204 No Content status if the deletion was successful
  } catch (error) {
    console.error("ERROR DELETING CART ITEM: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if deletion fails
  }
});

// Route to retrieve user order history
app.get("/api/orders", isLoggedIn, async (req, res) => {
  try {
    const orders = await getOrders(req.user.id); // Fetch orders for the logged-in user

    res.json(orders); // Respond with the list of orders
  } catch (error) {
    console.error("ERROR FETCHING ORDERS: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if fetching fails
  }
});

// Route to view user profile
app.get(
  "/api/users/:id",
  isLoggedIn,
  checkUserAuthorization,
  async (req, res) => {
    const { id } = req.params; // Get the user ID from the URL parameters

    try {
      const user = await getUserInfo(id); // Fetch the user by ID

      if (!user) {
        return res.status(404).json({ error: "User not found" }); // Handle case where user doesn't exist
      }

      res.json(user); // Respond with the user profile
    } catch (error) {
      console.error("ERROR FETCHING USER PROFILE: ", error);
      res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if fetching fails
    }
  }
);

// Route to update user profile
app.put(
  "/api/users/:id",
  isLoggedIn,
  checkUserAuthorization,
  async (req, res) => {
    const { id } = req.params; // Get the user ID from the URL parameters
    const { username, email, password } = req.body; // Destructure user data from request body

    try {
      const updatedUser = await updateUserInfo(id, {
        username,
        email,
        password,
      });

      if (!updatedUser) {
        return res.status(400).json({ error: "No updates provided" }); // Handle case where no updates were made
      }

      res.json(updatedUser); // Respond with the updated user profile
    } catch (error) {
      console.error("ERROR UPDATING USER PROFILE: ", error);
      res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if updating fails
    }
  }
);

// Route to get all products for admin view
app.get("/api/admin/products", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const products = await getProducts(); // Fetch all products from the database
    res.json(products); // Respond with the list of products
  } catch (error) {
    console.error("ERROR FETCHING PRODUCTS: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if fetching fails
  }
});

// Route to create a new product as an admin
app.post("/api/admin/products", isLoggedIn, isAdmin, async (req, res) => {
  const { name, description, price, category_id, image_url } = req.body; // Destructure product data from request body

  // Validate incoming data
  if (!name || !description || !price) {
    return res
      .status(400)
      .json({ error: "Name, description, and price are required." }); // Respond with 400 if validation fails
  }

  if (price <= 0) {
    return res.status(400).json({ error: "Price must be a positive number." }); // Respond with 400 if price is invalid
  }

  try {
    const result = await createProduct(
      name,
      description,
      price,
      category_id,
      image_url
    ); // Call the createProduct function

    if (result.success) {
      res.status(201).json(result.product); // Respond with the created product and a 201 status
    } else {
      res.status(500).json({ error: result.error }); // Respond with a 500 status and error message if creation fails
    }
  } catch (error) {
    console.error("ERROR CREATING PRODUCT: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if unexpected error occurs
  }
});

// Route to update an existing product as an admin
app.put("/api/admin/products/:id", isLoggedIn, isAdmin, async (req, res) => {
  const productId = req.params.id; // Get the product ID from the route parameters
  const { name, description, price, category_id, image_url } = req.body; // Destructure product data from request body

  try {
    const result = await updateProduct(productId, {
      name,
      description,
      price,
      category_id,
      image_url,
    });

    if (result.success) {
      res.status(200).json(result.product); // Respond with the updated product and a 200 status
    } else {
      res.status(404).json({ error: result.error }); // Respond with 404 if product not found
    }
  } catch (error) {
    console.error("ERROR UPDATING PRODUCT: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if unexpected error occurs
  }
});

// Route to delete a product as an admin
app.delete("/api/admin/products/:id", isLoggedIn, isAdmin, async (req, res) => {
  const productId = req.params.id; // Get the product ID from the route parameters

  try {
    const result = await deleteProduct(productId); // Call the deleteProduct function

    if (result.success) {
      res.status(204).send(); // Respond with a 204 status indicating successful deletion
    } else {
      res.status(404).json({ error: result.error }); // Respond with 404 if product not found
    }
  } catch (error) {
    console.error("ERROR DELETING PRODUCT: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if unexpected error occurs
  }
});

// Route to get all users for admin view
app.get("/api/admin/users", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const result = await getUsers(); // Call the getUsers function
    if (result.success) {
      res.json(result.users); // Respond with the list of users
    } else {
      res.status(500).json({ error: result.error }); // Respond with a 500 status if fetching fails
    }
  } catch (error) {
    console.error("ERROR FETCHING USERS: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if unexpected error occurs
  }
});

// Route to get all orders for admin view
app.get("/api/admin/orders", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const result = await getAllOrders(); // Call the getAllOrders function
    if (result.success) {
      res.json(result.orders); // Respond with the list of orders
    } else {
      res.status(500).json({ error: result.error }); // Respond with a 500 status if fetching fails
    }
  } catch (error) {
    console.error("ERROR FETCHING ORDERS: ", error);
    res.status(500).json({ error: error.message }); // Respond with a 500 status and error message if unexpected error occurs
  }
});

// Set the server to listen on a specified port
const PORT = process.env.PORT || 3000; // Use the PORT from environment variables or default to 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // Log the port number when the server starts
