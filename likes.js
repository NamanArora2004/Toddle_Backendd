const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const likesController = require("../controllers/likes");

const router = express.Router();

/**
 * Likes routes
 * TODO: Implement like routes when like functionality is added
 */

// TODO: POST /api/likes - Like a post
// TODO: DELETE /api/likes/:post_id - Unlike a post
// TODO: GET /api/likes/post/:post_id - Get likes for a post
// TODO: GET /api/likes/user/:user_id - Get posts liked by a user

// Like a post
router.post("/", authenticateToken, likesController.likePost);

// Check if the authenticated user has liked a specific post
router.get("/check/:post_id", authenticateToken, likesController.checkUserLike);

// Unlike a post
router.delete("/:post_id", authenticateToken, likesController.unlikePost);

// Get likes for a post
router.get("/post/:post_id", likesController.getPostLikes);

// Get likes by the authenticated user
router.get("/user/me", authenticateToken, likesController.getMyLikes);

// Get posts liked by a user
router.get("/user/:user_id", likesController.getUserLikes);

// Get all likes (optionally paginated)
router.get("/", likesController.getAllLikes);

// Get the number of likes for a post
router.get("/count/:post_id", likesController.getPostLikeCount);

module.exports = router;
