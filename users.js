const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const usersController = require("../controllers/users");

const router = express.Router();

/**
 * User-related routes
 * TODO: Implement user routes when follow functionality is added
 */

// TODO: POST /api/users/follow - Follow a user
// TODO: DELETE /api/users/unfollow - Unfollow a user
// TODO: GET /api/users/following - Get users that current user follows
// TODO: GET /api/users/followers - Get users that follow current user
// TODO: GET /api/users/stats - Get follow stats for current user
// TODO: POST /api/users/search - Find users by name

// Follow a user
router.post("/follow", authenticateToken, usersController.follow);

// Unfollow a user
router.delete("/unfollow", authenticateToken, usersController.unfollow);

// Get users the current user is following
router.get("/following", authenticateToken, usersController.getMyFollowing);

// Get users that follow the current user
router.get("/followers", authenticateToken, usersController.getMyFollowers);

// Get follow stats for the current user
router.get("/stats", authenticateToken, usersController.getFollowCounts);

// Add user search route
router.post("/search", usersController.searchUsers);

// Add user search GET route
router.get("/search", usersController.searchUsersGet);

// Get user by ID
router.get("/:user_id", usersController.getUserById);

module.exports = router;
