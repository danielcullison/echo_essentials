//require('dotenv').config();
const client = require("../client.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_ROUNDS = 10; // Number of rounds to use when hashing passwords
const JWT_SECRET = process.env.JWT || "shhh"; // Secret for signing JWT tokens, defaulting to "shhh"

/**
 * Create a new user in the database.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @param {string} email - The email of the user.
 * @returns {object} - Result of the operation containing success status and user details or error message.
 */
const createUser = async (username, password, email) => {
  try {
    // Check if all required fields are provided
    if (!username || !password || !email) {
      return { success: false, error: "All fields are required." };
    }

    // Hash the password for secure storage
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    // Insert the new user into the database
    const { rows } = await client.query(
      `
      INSERT INTO users (username, password, email)
      VALUES ($1, $2, $3) RETURNING *;
      `,
      [username, hashedPassword, email]
    );

    // Return the newly created user details
    return { success: true, user: rows[0] };
  } catch (error) {
    console.error("ERROR CREATING USER: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

/**
 * Authenticate a user with their username and password.
 * @param {Object} credentials - The user's credentials.
 * @param {string} credentials.username - The username of the user.
 * @param {string} credentials.password - The password of the user.
 * @returns {Object} - An object containing either a success flag and a JWT token, or an error message.
 */
const authenticate = async ({ username, password }) => {
  try {
    // Query the database to find the user by username
    const { rows } = await client.query(
      `
        SELECT id, username, password, email
        FROM users
        WHERE username = $1
      `,
      [username]
    );

    // If no user is found, return an unauthorized error
    if (!rows.length) {
      return { success: false, error: "not authorized" };
    }

    const user = rows[0];
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: "not authorized" };
    }

    // Generate a JWT token if authentication is successful
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    
    // Return the token and user information
    return { success: true, token, user: { id: user.id, username: user.username, email: user.email } }; // Include user details
  } catch (error) {
    console.error("AUTHENTICATION ERROR: ", error);
    // Return an error message if authentication fails
    return { success: false, error: "Authentication failed" };
  }
};

/**
 * Find a user based on a provided JWT token.
 * @param {string} token - The JWT token of the user.
 * @returns {Object} - An object containing either a success flag and user details, or an error message.
 */
const findUserWithToken = async (token) => {
  let id;
  try {
    // Verify the token and extract the user ID from its payload
    const payload = jwt.verify(token, JWT_SECRET);
    id = payload.id; // Extract the user ID
  } catch (ex) {
    // If token verification fails, return an unauthorized error
    return { success: false, error: "not authorized" };
  }

  // Query the database to find the user by ID
  const SQL = `
    SELECT id, username, email
    FROM users
    WHERE id = $1
  `;
  const response = await client.query(SQL, [id]);
  
  // If no user is found with the ID, return an unauthorized error
  if (!response.rows.length) {
    return { success: false, error: "not authorized" };
  }

  // Return user details including userId
  return { success: true, user: { id: response.rows[0].id, username: response.rows[0].username, email: response.rows[0].email } };
};


const getUserInfo = async (user_id) => {
  const { rows } = await client.query(
    `SELECT id, username, email
     FROM users 
     WHERE id = $1`,
    [user_id]
  );

  return rows[0]; // Return the user object or undefined if not found
};

const updateUserInfo = async (user_id, { username, email, password }) => {
  const updates = [];
  const values = [];

  if (username) {
    updates.push(`username = $${updates.length + 1}`);
    values.push(username);
  }

  if (email) {
    updates.push(`email = $${updates.length + 1}`);
    values.push(email);
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    updates.push(`password = $${updates.length + 1}`);
    values.push(hashedPassword);
  }

  // If no updates, return early
  if (updates.length === 0) {
    return null; // No fields to update
  }

  const result = await client.query(
    `UPDATE users
     SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${updates.length + 1}
     RETURNING id, username, email, created_at, updated_at`,
    [...values, user_id]
  );

  return result.rows[0]; // Return the updated user object
};

/**
 * Get all users from the database.
 * @returns {object} - Result of the operation, including success status and an array of users or error message.
 */
const getUsers = async () => {
  try {
    // Query the database to fetch all users
    const { rows } = await client.query(`
      SELECT id, username, email, created_at, updated_at 
      FROM users
      ORDER BY created_at DESC;
    `);
    // Return success status and the list of users
    return { success: true, users: rows };
  } catch (error) {
    console.error("ERROR FETCHING USERS: ", error);
    // Return error information if fetching fails
    return { success: false, error: error.message };
  }
};

module.exports = {
  createUser,
  authenticate,
  findUserWithToken,
  getUserInfo,
  updateUserInfo,
  getUsers
};
