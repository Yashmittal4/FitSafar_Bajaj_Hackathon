const UserProgress = require("../models/UserProgress")

exports.getUserProgress = async (req, res) => {
  try {
    let userProgress = await UserProgress.findOne({ userId: req.userId })

    if (!userProgress) {
      userProgress = new UserProgress({
        userId: req.userId,
        clearedLevels: [],
        stats: {
          totalXP: 0,
          totalCoins: 0,
          currentStreak: 0,
          highestStreak: 0,
        },
      })
      await userProgress.save()
    }

    res.json({ progress: userProgress })
  } catch (error) {
    console.error("Error fetching user progress:", error)
    res.status(500).json({ message: "Server error" })
  }
}

