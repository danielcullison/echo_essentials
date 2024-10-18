const client = require("../client.js");

/**
 * Create a new product in the database.
 * @param {string} name - The name of the product.
 * @param {string} description - The description of the product.
 * @param {number} price - The price of the product.
 * @param {number} category_id - The category ID of the product.
 * @param {string} image_url - The image URL of the product.
 * @returns {object} - Result of the operation, indicating success and the created product or error message.
 */
const createProduct = async (
  name,
  description,
  price,
  category_id,
  image_url
) => {
  try {
    // Insert the new product into the products table
    const { rows } = await client.query(
      `
      INSERT INTO products (name, description, price, category_id, image_url) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `,
      [name, description, price, category_id, image_url]
    );
    // Return success status and the created product details
    return { success: true, product: rows[0] };
  } catch (error) {
    console.error("ERROR CREATING PRODUCT: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

/**
 * Get all products from the database.
 * @returns {object} - Result of the operation, including success status and an array of products or error message.
 */
const getProducts = async () => {
  try {
    // Query the database to fetch all products
    const { rows } = await client.query(`
      SELECT * FROM products;
    `);
    // Return success status and the list of products
    return { success: true, products: rows };
  } catch (error) {
    console.error("ERROR FETCHING PRODUCTS: ", error);
    // Return error information if fetching fails
    return { success: false, error: error.message };
  }
};

/**
 * Get a single product by ID from the database.
 * @param {number} product_id - The ID of the product to retrieve.
 * @returns {object} - Result of the operation, including success status and the product or error message.
 */
const getSingleProduct = async (product_id) => {
  try {
    // Query the database to fetch a product by its ID
    const { rows } = await client.query(
      `
      SELECT * FROM products
      WHERE id = $1;
      `,
      [product_id]
    );

    // If no product is found, return an error message
    if (rows.length === 0) {
      console.error("Item not found");
      return { success: false, error: "Item not found" };
    }

    // Return success status and the found product
    return { success: true, item: rows[0] };
  } catch (error) {
    console.error("ERROR FETCHING PRODUCT: ", error);
    // Return error information if fetching fails
    return { success: false, error: error.message };
  }
};

// Export the functions to be used in other modules
module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
};
