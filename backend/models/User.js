const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    phoneNumber: String,
    gender: String,
    age: Number,
    height: Number,
    weight: Number,
  },
  { timestamps: true },
)

module.exports = mongoose.model("User", userSchema)

