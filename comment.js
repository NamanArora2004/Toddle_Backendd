const { query } = require("../utils/database");

/**
 * Comment model for managing post comments
 * TODO: Implement this model for the comment functionality
 */

// Create a new comment
async function createComment({ postId, userId, content }) {
	const result = await query(
		`INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`,
		[postId, userId, content]
	);
	return result.rows[0];
}

// Update a comment's content (only by the owner)
async function updateComment({ commentId, userId, content }) {
	const result = await query(
		`UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 AND is_deleted = FALSE RETURNING *`,
		[content, commentId, userId]
	);
	return result.rows[0];
}

// Soft delete a comment (only by the owner)
async function deleteComment({ commentId, userId }) {
	const result = await query(
		`UPDATE comments SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE RETURNING *`,
		[commentId, userId]
	);
	return result.rows[0];
}

// Get all comments for a post (optionally paginated)
async function getPostComments({ postId, limit = 20, offset = 0 }) {
	const result = await query(
		`SELECT * FROM comments WHERE post_id = $1 AND is_deleted = FALSE ORDER BY created_at ASC LIMIT $2 OFFSET $3`,
		[postId, limit, offset]
	);
	return result.rows;
}

// Get a comment by its ID
async function getCommentById(commentId) {
	const result = await query(
		`SELECT * FROM comments WHERE id = $1 AND is_deleted = FALSE`,
		[commentId]
	);
	return result.rows[0];
}

// Get all comments (optionally paginated)
async function getAllComments({ limit = 20, offset = 0 }) {
	const result = await query(
		`SELECT * FROM comments WHERE is_deleted = FALSE ORDER BY created_at ASC LIMIT $1 OFFSET $2`,
		[limit, offset]
	);
	return result.rows;
}

// Get comments by a specific user (optionally paginated)
async function getCommentsByUser({ userId, limit = 20, offset = 0 }) {
	const result = await query(
		`SELECT * FROM comments WHERE user_id = $1 AND is_deleted = FALSE ORDER BY created_at ASC LIMIT $2 OFFSET $3`,
		[userId, limit, offset]
	);
	return result.rows;
}

module.exports = {
	createComment,
	updateComment,
	deleteComment,
	getPostComments,
	getCommentById,
	getAllComments,
	getCommentsByUser,
};
