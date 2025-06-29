const { query } = require("../utils/database");
const bcrypt = require("bcryptjs");
const followModel = require("./follow");

/**
 * User model for database operations
 */

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async ({ username, email, password, full_name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (username, email, password_hash, full_name, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, username, email, full_name, created_at`,
    [username, email, hashedPassword, full_name],
  );

  return result.rows[0];
};

/**
 * Find user by username
 * @param {string} username - Username to search for
 * @returns {Promise<Object|null>} User object or null
 */
const getUserByUsername = async (username) => {
  const result = await query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  return result.rows[0] || null;
};

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} User object or null
 */
const getUserById = async (id) => {
  const result = await query(
    "SELECT id, username, email, full_name, created_at FROM users WHERE id = $1",
    [id],
  );

  return result.rows[0] || null;
};

/**
 * Verify user password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} Password match result
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Find users by (partial) name, with pagination
async function findUsersByName({ name, limit = 20, offset = 0 }) {
  const result = await query(
    `SELECT id, username, email, full_name FROM users WHERE full_name ILIKE $1 AND is_deleted = FALSE ORDER BY full_name ASC LIMIT $2 OFFSET $3`,
    [`%${name}%`, limit, offset]
  );
  return result.rows;
}

// Get user profile with follower/following counts
async function getUserProfile(userId) {
  const userResult = await query(
    `SELECT id, username, email, full_name, created_at FROM users WHERE id = $1 AND is_deleted = FALSE`,
    [userId]
  );
  const user = userResult.rows[0];
  if (!user) return null;
  const counts = await followModel.getFollowCounts(userId);
  return { ...user, ...counts };
}

// Update user profile (full_name, email)
async function updateUserProfile({ userId, full_name, email }) {
  const result = await query(
    `UPDATE users SET full_name = COALESCE($1, full_name), email = COALESCE($2, email), updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND is_deleted = FALSE RETURNING id, username, email, full_name, created_at`,
    [full_name, email, userId]
  );
  return result.rows[0];
}

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
  findUsersByName,
  getUserProfile,
  updateUserProfile,
};
