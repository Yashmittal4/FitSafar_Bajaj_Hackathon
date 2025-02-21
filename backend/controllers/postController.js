const Post = require("../models/Post")
const mongoose = require("mongoose")
const User = require("../models/User") // Import the User model

exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({
      userId: req.userId,
      caption: req.body.caption,
      tags: JSON.parse(req.body.tags || "[]"),
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    })

    await newPost.save()
    const populatedPost = await Post.findById(newPost._id).populate("userId", "name").lean()

    res.status(201).json(populatedPost)
  } catch (error) {
    console.error("Error creating post:", error)
    res.status(500).json({ message: "Error creating post" })
  }
}

exports.getAllPosts = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const search = req.query.search || ""
    const tag = req.query.tag || ""
    const userId = req.query.userId

    const query = {}

    if (search) {
      query.$or = [{ caption: { $regex: search, $options: "i" } }, { tags: { $regex: search, $options: "i" } }]
    }

    if (tag) {
      query.tags = { $regex: tag, $options: "i" }
    }

    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId)
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name")
      .populate("comments.userId", "name")
      .lean()

    const total = await Post.countDocuments(query)

    const userStats = await Post.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: { $size: "$likes" } },
          totalComments: { $sum: { $size: "$comments" } },
        },
      },
    ])

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      userStats: userStats[0] || { totalPosts: 0, totalLikes: 0, totalComments: 0 },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    })
  }
}

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) return res.status(404).json({ message: "Post not found" })

    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized to edit this post" })
    }

    const updates = {
      caption: req.body.caption,
      tags: req.body.tags ? JSON.parse(req.body.tags) : post.tags,
      updatedAt: Date.now(),
    }

    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, updates, { new: true }).populate(
      "userId",
      "name",
    )

    res.json(updatedPost)
  } catch (error) {
    console.error("Error updating post:", error)
    res.status(500).json({ message: "Error updating post" })
  }
}

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) return res.status(404).json({ message: "Post not found" })
    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    await Post.findByIdAndDelete(req.params.postId)
    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    res.status(500).json({ message: "Error deleting post" })
  }
}

exports.likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) return res.status(404).json({ message: "Post not found" })

    const likeIndex = post.likes.indexOf(req.userId)
    if (likeIndex === -1) {
      post.likes.push(req.userId)
    } else {
      post.likes.splice(likeIndex, 1)
    }

    await post.save()
    res.json(post)
  } catch (error) {
    console.error("Error liking/unliking post:", error)
    res.status(500).json({ message: "Error processing like" })
  }
}

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" })
    }

    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    post.comments.push({
      userId: req.userId,
      text: text,
      createdAt: new Date(),
    })

    await post.save()

    const updatedPost = await Post.findById(post._id)
      .populate("userId", "name")
      .populate("comments.userId", "name")
      .lean()

    res.json({
      success: true,
      data: updatedPost,
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    })
  }
}

exports.getUserStats = async (req, res) => {
  try {
    const stats = await Post.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: { $size: "$likes" } },
          totalComments: { $sum: { $size: "$comments" } },
        },
      },
    ])

    const user = await User.findById(req.params.userId) // Use the imported User model

    res.json({
      totalPosts: stats[0]?.totalPosts || 0,
      totalLikes: stats[0]?.totalLikes || 0,
      totalComments: stats[0]?.totalComments || 0,
      joinedDate: user.createdAt,
      lastActive: user.updatedAt,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    res.status(500).json({ message: "Error fetching user statistics" })
  }
}

