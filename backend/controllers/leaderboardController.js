const User = require("../models/User")
const UserProgress = require("../models/UserProgress")

exports.getLeaderboard = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = "totalXP", search = "" } = req.query

    const users = await User.find({
      name: search ? { $regex: search, $options: "i" } : { $exists: true },
    }).select("name")

    const userIds = users.map((user) => user._id)
    const progressData = await UserProgress.find({
      userId: { $in: userIds },
    }).populate("userId", "name")

    const leaderboardData = progressData.map((progress) => ({
      userId: progress.userId._id,
      name: progress.userId.name,
      totalXP: progress.stats.totalXP || 0,
      totalCoins: progress.stats.totalCoins || 0,
      levelsCleared: progress.clearedLevels?.length || 0,
    }))

    leaderboardData.sort((a, b) => b[sortBy] - a[sortBy])

    leaderboardData.forEach((data, index) => {
      data.rank = index + 1
    })

    const userPosition = leaderboardData.findIndex((data) => data.userId.toString() === req.userId.toString())

    const userPage = Math.ceil((userPosition + 1) / limit)

    const targetPage = page === "1" && !search ? userPage : Number.parseInt(page)

    const startIndex = (targetPage - 1) * limit
    const endIndex = targetPage * limit
    const paginatedData = leaderboardData.slice(startIndex, endIndex)

    res.json({
      leaderboard: paginatedData,
      totalPages: Math.ceil(leaderboardData.length / limit),
      currentPage: targetPage,
      totalUsers: leaderboardData.length,
      userRank: userPosition + 1,
    })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    res.status(500).json({ message: "Server error" })
  }
}

