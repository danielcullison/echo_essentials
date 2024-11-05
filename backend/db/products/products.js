// Importing the database client to interact with PostgreSQL
const client = require("../client.js");

/**
 * Create a new product in the database.
 * @param {string} name - The name of the product.
 * @param {string} description - A description of the product.
 * @param {number} price - The price of the product.
 * @param {number} category_id - The category ID the product belongs to.
 * @param {string} image_url - The URL of the product's image.
 * @returns {Object} - The result of the operation (success or error) and the created product's details.
 */
const createProduct = async (name, description, price, category_id, image_url) => {
  try {
    // Insert a new product into the products table
    const { rows } = await client.query(
      `
      INSERT INTO products (name, description, price, category_id, image_url) 
      VALUES ($1, $2, $3, $4, $5) RETURNING id, name, description, price, category_id, image_url, created_at, updated_at;
      `,
      [name, description, price, category_id, image_url] // Values for query placeholders
    );

    // Return the created product details if successful
    return { success: true, product: rows[0] };
  } catch (error) {
    console.error("ERROR CREATING PRODUCT: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

/**
 * Fetch all products from the database.
 * @returns {Object} - The result of the operation (success or error) and the list of products.
 */
const getProducts = async () => {
  try {
    // Query the database to fetch all products
    const { rows } = await client.query(`
      SELECT * FROM products
      ORDER BY created_at DESC;
    `);

    // Return the list of products if successful
    return { success: true, products: rows };
  } catch (error) {
    console.error("ERROR FETCHING PRODUCTS: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

/**
 * Fetch a single product by its ID.
 * @param {number} product_id - The ID of the product to fetch.
 * @returns {Object} - The result of the operation (success or error) and the found product.
 */
const getSingleProduct = async (product_id) => {
  try {
    // Query the database to fetch a product by its ID
    const { rows } = await client.query(
      `
      SELECT * FROM products
      WHERE id = $1;
      `,
      [product_id] // Query parameter
    );

    // If no product is found, return an error message
    if (rows.length === 0) {
      console.error("Item not found");
      return { success: false, error: "Item not found" };
    }

    // Return the found product if successful
    return { success: true, item: rows[0] };
  } catch (error) {
    console.error("ERROR FETCHING PRODUCT: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

/**
 * Update an existing product in the database.
 * @param {number} product_id - The ID of the product to update.
 * @param {Object} data - An object containing the fields to update (e.g., name, description, price).
 * @returns {Object} - The result of the operation (success or error) and the updated product.
 */
const updateProduct = async (product_id, data) => {
  try {
    // Initialize arrays for dynamically building the query
    const fields = [];
    const values = [];

    // Check and add fields to be updated
    if (data.name) {
      fields.push(`name = $${fields.length + 1}`);
      values.push(data.name);
    }
    if (data.description) {
      fields.push(`description = $${fields.length + 1}`);
      values.push(data.description);
    }
    if (data.price) {
      if (data.price <= 0) {
        return { success: false, error: "Price must be a positive number." };
      }
      fields.push(`price = $${fields.length + 1}`);
      values.push(data.price);
    }
    if (data.category_id) {
      fields.push(`category_id = $${fields.length + 1}`);
      values.push(data.category_id);
    }
    if (data.image_url) {
      fields.push(`image_url = $${fields.length + 1}`);
      values.push(data.image_url);
    }

    // Ensure at least one field is provided for updating
    if (fields.length === 0) {
      return { success: false, error: "No fields to update." };
    }

    // Create the SQL update query
    const query = `
      UPDATE products 
      SET ${fields.join(", ")} 
      WHERE id = $${fields.length + 1} 
      RETURNING id, name, description, price, category_id, image_url, created_at, updated_at;
    `;
    values.push(product_id); // Add product ID to the query values

    // Execute the update query
    const { rows } = await client.query(query, values);

    // If no rows are returned, the product wasn't found
    if (rows.length === 0) {
      return { success: false, error: "Product not found." };
    }

    // Return the updated product details if successful
    return { success: true, product: rows[0] };
  } catch (error) {
    console.error("ERROR UPDATING PRODUCT: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

/**
 * Delete a product from the database.
 * @param {number} product_id - The ID of the product to delete.
 * @returns {Object} - The result of the operation (success or error).
 */
const deleteProduct = async (product_id) => {
  try {
    // Execute the delete query
    const { rowCount } = await client.query(
      `
      DELETE FROM products 
      WHERE id = $1;
      `,
      [product_id] // Query parameter
    );

    // Check if any rows were affected (product was deleted)
    if (rowCount === 0) {
      return { success: false, error: "Product not found." }; // Return error if product not found
    }

    // Return success status if the product was deleted
    return { success: true };
  } catch (error) {
    console.error("ERROR DELETING PRODUCT: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

// Export the functions for use in other modules
module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
};
