const Level = require("../models/Level")
const UserProgress = require("../models/UserProgress")

exports.getAllLevels = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, difficulty } = req.query
    const query = {}

    if (status) query.status = status
    if (difficulty) query.difficulty = difficulty

    const levels = await Level.find(query)
      .sort({ levelNumber: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Level.countDocuments(query)

    res.json({
      levels,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
      totalLevels: total,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.getLevel = async (req, res) => {
  try {
    const levelId = Number.parseInt(req.params.levelNumber)

    const level = await Level.findOne({ levelNumber: levelId })
    if (!level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      })
    }

    const userProgress = await UserProgress.findOne({ userId: req.userId })

    res.json({
      success: true,
      data: {
        level: {
          ...level.toObject(),
          isCompleted: userProgress?.clearedLevels.includes(levelId) || false,
          isUnlocked: levelId <= 3 || userProgress?.clearedLevels.includes(levelId - 1) || false,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching level:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.createLevel = async (req, res) => {
  try {
    const { levelNumber, exercises, difficulty, rewards, aim } = req.body

    if (!levelNumber || levelNumber < 1) {
      return res.status(400).json({ message: "Invalid level number" })
    }

    const existingLevel = await Level.findOne({ levelNumber })
    if (existingLevel) {
      return res.status(400).json({ message: "Level number already exists" })
    }

    const newLevel = new Level({
      levelNumber,
      exercises: exercises || [],
      difficulty: difficulty || "beginner",
      rewards: rewards || { coins: 50, xp: 25 },
      aim: aim || "Level aim not set",
      status: exercises?.length > 0 ? "active" : "pending",
    })

    await newLevel.save()
    res.status(201).json(newLevel)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

exports.updateLevel = async (req, res) => {
  try {
    const { exercises, difficulty, rewards, aim } = req.body
    const levelNumber = Number.parseInt(req.params.levelNumber)

    const level = await Level.findOne({ levelNumber })
    if (!level) {
      return res.status(404).json({ message: "Level not found" })
    }

    level.exercises = exercises
    level.difficulty = difficulty
    level.rewards = rewards
    level.aim = aim
    level.status = exercises?.length > 0 ? "active" : "pending"

    await level.save()
    res.json(level)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.deleteLevel = async (req, res) => {
  try {
    const level = await Level.findOneAndDelete({ levelNumber: req.params.levelNumber })
    if (!level) return res.status(404).json({ message: "Level not found" })
    res.json({ message: "Level deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.completeLevel = async (req, res) => {
  try {
    const levelId = req.params.levelId
    const userId = req.userId

    let userProgress = await UserProgress.findOne({ userId })

    if (!userProgress) {
      userProgress = new UserProgress({
        userId,
        clearedLevels: [],
        stats: { totalXP: 0, totalCoins: 0, currentStreak: 0, highestStreak: 0 },
      })
    }

    const level = await Level.findOne({ levelNumber: levelId })
    if (!level) {
      return res.status(404).json({ message: "Level not found" })
    }

    if (!userProgress.clearedLevels.includes(Number(levelId))) {
      userProgress.clearedLevels.push(Number(levelId))
      userProgress.stats.totalXP += level.rewards.xp
      userProgress.stats.totalCoins += level.rewards.coins
      userProgress.stats.currentStreak += 1
      userProgress.stats.highestStreak = Math.max(userProgress.stats.currentStreak, userProgress.stats.highestStreak)
    }

    await userProgress.save()

    res.json({
      message: "Level completed successfully",
      progress: userProgress,
    })
  } catch (error) {
    console.error("Error completing level:", error)
    res.status(500).json({ message: "Server error" })
  }
}

