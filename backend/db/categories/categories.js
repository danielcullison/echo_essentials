// Importing the database client to interact with PostgreSQL
const client = require("../client.js");

/**
 * Create a new category in the categories table.
 * @param {string} name - The name of the category to be created.
 * @returns {Object} - The result of the operation (success or error).
 */
const createCategory = async (name) => {
  try {
    // Insert the new category into the categories table
    await client.query(
      `
        INSERT INTO categories (name)
        VALUES ($1);
      `,
      [name] // Passing the category name as the query parameter
    );

    // Return success status if the operation is successful
    return { success: true };
  } catch (error) {
    console.error("ERROR CREATING CATEGORY: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

/**
 * Retrieve all categories from the categories table.
 * @returns {Object} - The result of the operation (success with categories or error).
 */
const getCategories = async () => {
  try {
    // Query to select all categories from the categories table
    const { rows } = await client.query(`
      SELECT * FROM categories;
    `);

    // Return the retrieved categories
    return { success: true, categories: rows };
  } catch (error) {
    console.error("ERROR FETCHING CATEGORIES: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

// Export the functions to be used in other parts of the application
module.exports = {
  createCategory,
  getCategories,
};
