const client = require("../client.js");

/**
 * Create a new category in the database.
 * @param {string} name - The name of the category to be created.
 * @returns {object} - Result of the operation, indicating success or an error message.
 */
const createCategory = async (name) => {
  try {
    // Insert the new category into the categories table
    await client.query(
      `
            INSERT INTO categories (name)
            VALUES ($1);
        `,
      [name] // Value for the query placeholder
    );
    // Return success status if the operation is successful
    return { success: true };
  } catch (error) {
    console.error("ERROR CREATING CATEGORY: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

const getCategories = async () => {
  try {
   const { rows } = await client.query(`
      SELECT * FROM categories;
    `);
    return { success: true, categories: rows };
  } catch (error) {
    console.error("ERROR FETCHING CATEGORIES: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

// Export the createCategory function to be used in other modules
module.exports = {
  createCategory,
  getCategories
};
