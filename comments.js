const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const commentsController = require("../controllers/comments");

const router = express.Router();

/**
 * Comments routes
 * TODO: Implement comment routes when comment functionality is added
 */

// TODO: POST /api/comments - Create a comment on a post
// TODO: PUT /api/comments/:comment_id - Update a comment
// TODO: DELETE /api/comments/:comment_id - Delete a comment
// TODO: GET /api/comments/post/:post_id - Get comments for a post

// Create a comment on a post
router.post("/", authenticateToken, commentsController.createComment);

// Update a comment
router.put("/:comment_id", authenticateToken, commentsController.updateComment);

// Delete a comment
router.delete("/:comment_id", authenticateToken, commentsController.deleteComment);

// Get comments for a post
router.get("/post/:post_id", commentsController.getPostComments);

// Get all comments (optionally paginated)
router.get("/", commentsController.getAllComments);

// Get comments by the authenticated user
router.get("/user/me", authenticateToken, commentsController.getMyComments);

// Get a single comment by its ID
router.get("/:comment_id", commentsController.getCommentById);

module.exports = router;
