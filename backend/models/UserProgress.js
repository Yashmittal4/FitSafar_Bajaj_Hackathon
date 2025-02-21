const mongoose = require("mongoose")

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  clearedLevels: [Number],
  stats: {
    totalXP: { type: Number, default: 0 },
    totalCoins: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    highestStreak: { type: Number, default: 0 },
  },
})

module.exports = mongoose.model("UserProgress", userProgressSchema)

