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
        SELECT id, password
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
    return { success: true, token }; // Return the token
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
    SELECT id, username
    FROM users
    WHERE id = $1
  `;
  const response = await client.query(SQL, [id]);
  // If no user is found with the ID, return an unauthorized error
  if (!response.rows.length) {
    return { success: false, error: "not authorized" };
  }

  // Return user details if found
  return { success: true, user: response.rows[0] };
};

module.exports = {
  createUser,
  authenticate,
  findUserWithToken,
};
