const mongoose = require("mongoose")

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["BicepCurl", "Planks", "Pushups", "JumpingJack", "Squats"],
    required: true,
  },
  reps: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
})

const levelSchema = new mongoose.Schema({
  levelNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  aim: {
    type: String,
    default: "Complete all exercises to advance",
  },
  exercises: [exerciseSchema],
  status: {
    type: String,
    enum: ["pending", "active"],
    default: "pending",
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  rewards: {
    coins: { type: Number, default: 50 },
    xp: { type: Number, default: 25 },
  },
})

const Level = mongoose.model("Level", levelSchema)

module.exports = Level

