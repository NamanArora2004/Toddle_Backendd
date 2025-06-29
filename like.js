const { query } = require("../utils/database");

/**
 * Like model for managing post likes
 * TODO: Implement this model for the like functionality
 */

// TODO: Implement likePost function
// TODO: Implement unlikePost function
// TODO: Implement getPostLikes function
// TODO: Implement getUserLikes function
// TODO: Implement hasUserLikedPost function

// Like a post
async function likePost({ postId, userId }) {
	const result = await query(
		`INSERT INTO likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
		[postId, userId]
	);
	return result.rows[0];
}

// Unlike a post
async function unlikePost({ postId, userId }) {
	const result = await query(
		`DELETE FROM likes WHERE post_id = $1 AND user_id = $2 RETURNING *`,
		[postId, userId]
	);
	return result.rows[0];
}

// Get all likes for a post
async function getPostLikes(postId) {
	const result = await query(
		`SELECT * FROM likes WHERE post_id = $1`,
		[postId]
	);
	return result.rows;
}

// Get all posts liked by a user
async function getUserLikes(userId, limit = 20, offset = 0) {
	const result = await query(
		`SELECT * FROM likes WHERE user_id = $1 ORDER BY created_at ASC LIMIT $2 OFFSET $3`,
		[userId, limit, offset]
	);
	return result.rows;
}

// Check if a user has liked a post
async function hasUserLikedPost({ postId, userId }) {
	const result = await query(
		`SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2`,
		[postId, userId]
	);
	return result.rowCount > 0;
}

// Get all likes (optionally paginated)
async function getAllLikes({ limit = 20, offset = 0 }) {
	const result = await query(
		`SELECT * FROM likes ORDER BY created_at ASC LIMIT $1 OFFSET $2`,
		[limit, offset]
	);
	return result.rows;
}

// Get the number of likes for a post
async function getPostLikeCount(postId) {
	const result = await query(
		`SELECT COUNT(*) AS count FROM likes WHERE post_id = $1`,
		[postId]
	);
	return parseInt(result.rows[0].count, 10);
}

module.exports = {
	likePost,
	unlikePost,
	getPostLikes,
	getUserLikes,
	hasUserLikedPost,
	getAllLikes,
	getPostLikeCount,
};
