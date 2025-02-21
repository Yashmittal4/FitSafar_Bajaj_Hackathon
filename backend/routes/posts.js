const express = require("express")
const router = express.Router()
const postController = require("../controllers/postController")
const verifyToken = require("../middleware/auth")
const upload = require("../middleware/upload")

router.post("/", verifyToken, upload, postController.createPost)
router.get("/", verifyToken, postController.getAllPosts)
router.put("/:postId", verifyToken, upload, postController.updatePost)
router.delete("/:postId", verifyToken, postController.deletePost)
router.post("/:postId/like", verifyToken, postController.likeUnlikePost)
router.post("/:postId/comments", verifyToken, postController.addComment)
router.get("/users/:userId/stats", verifyToken, postController.getUserStats)

module.exports = router

