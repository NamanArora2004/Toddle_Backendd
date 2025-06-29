const { query } = require("../utils/database");
const logger = require("../utils/logger");

/**
 * Follow model - handles user follow/unfollow relationships
 */
class Follow {
	/**
	 * Follow a user
	 * @param {number} followerId - ID of the user who wants to follow
	 * @param {number} followingId - ID of the user to be followed
	 * @returns {Promise<Object>} Follow relationship data
	 */
	static async create(followerId, followingId) {
		try {
			// Prevent self-following
			if (followerId === followingId) {
				throw new Error("Users cannot follow themselves");
			}

			// Check if user exists and is not deleted
			const userCheck = await query(
				"SELECT id FROM users WHERE id = $1 AND is_deleted = FALSE",
				[followingId]
			);

			if (userCheck.rows.length === 0) {
				throw new Error("User to follow not found");
			}

			// Check if already following
			const existingFollow = await query(
				"SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2",
				[followerId, followingId]
			);

			if (existingFollow.rows.length > 0) {
				throw new Error("Already following this user");
			}

			// Create follow relationship
			const result = await query(
				"INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) RETURNING *",
				[followerId, followingId]
			);

			logger.verbose(`User ${followerId} started following user ${followingId}`);
			return result.rows[0];
		} catch (error) {
			logger.critical("Error creating follow relationship:", error);
			throw error;
		}
	}

	/**
	 * Unfollow a user
	 * @param {number} followerId - ID of the user who wants to unfollow
	 * @param {number} followingId - ID of the user to be unfollowed
	 * @returns {Promise<boolean>} Success status
	 */
	static async delete(followerId, followingId) {
		try {
			const result = await query(
				"DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING id",
				[followerId, followingId]
			);

			if (result.rows.length === 0) {
				throw new Error("Follow relationship not found");
			}

			logger.verbose(`User ${followerId} unfollowed user ${followingId}`);
			return true;
		} catch (error) {
			logger.critical("Error deleting follow relationship:", error);
			throw error;
		}
	}

	/**
	 * Check if a user is following another user
	 * @param {number} followerId - ID of the potential follower
	 * @param {number} followingId - ID of the potential following
	 * @returns {Promise<boolean>} True if following, false otherwise
	 */
	static async isFollowing(followerId, followingId) {
		try {
			const result = await query(
				"SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2",
				[followerId, followingId]
			);

			return result.rows.length > 0;
		} catch (error) {
			logger.critical("Error checking follow relationship:", error);
			throw error;
		}
	}

	/**
	 * Get users that a user follows
	 * @param {number} userId - ID of the user
	 * @param {number} limit - Number of results to return
	 * @param {number} offset - Number of results to skip
	 * @returns {Promise<Array>} Array of users being followed
	 */
	static async getFollowing(userId, limit = 20, offset = 0) {
		try {
			const result = await query(
				`SELECT u.id, u.username, u.full_name, f.created_at as followed_at
				 FROM follows f
				 JOIN users u ON f.following_id = u.id
				 WHERE f.follower_id = $1 AND u.is_deleted = FALSE
				 ORDER BY f.created_at DESC
				 LIMIT $2 OFFSET $3`,
				[userId, limit, offset]
			);

			return result.rows;
		} catch (error) {
			logger.critical("Error getting following list:", error);
			throw error;
		}
	}

	/**
	 * Get users that follow a user
	 * @param {number} userId - ID of the user
	 * @param {number} limit - Number of results to return
	 * @param {number} offset - Number of results to skip
	 * @returns {Promise<Array>} Array of followers
	 */
	static async getFollowers(userId, limit = 20, offset = 0) {
		try {
			const result = await query(
				`SELECT u.id, u.username, u.full_name, f.created_at as followed_at
				 FROM follows f
				 JOIN users u ON f.follower_id = u.id
				 WHERE f.following_id = $1 AND u.is_deleted = FALSE
				 ORDER BY f.created_at DESC
				 LIMIT $2 OFFSET $3`,
				[userId, limit, offset]
			);

			return result.rows;
		} catch (error) {
			logger.critical("Error getting followers list:", error);
			throw error;
		}
	}

	/**
	 * Get follow statistics for a user
	 * @param {number} userId - ID of the user
	 * @returns {Promise<Object>} Object with following and followers counts
	 */
	static async getStats(userId) {
		try {
			const followingResult = await query(
				"SELECT COUNT(*) as count FROM follows WHERE follower_id = $1",
				[userId]
			);

			const followersResult = await query(
				"SELECT COUNT(*) as count FROM follows WHERE following_id = $1",
				[userId]
			);

			return {
				following: parseInt(followingResult.rows[0].count),
				followers: parseInt(followersResult.rows[0].count)
			};
		} catch (error) {
			logger.critical("Error getting follow stats:", error);
			throw error;
		}
	}
}

module.exports = Follow;
