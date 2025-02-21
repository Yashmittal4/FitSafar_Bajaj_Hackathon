const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
const connectDB = require("./config/database")
const authRoutes = require("./routes/auth")
const levelRoutes = require("./routes/levels")
const userProgressRoutes = require("./routes/userProgress")
const leaderboardRoutes = require("./routes/leaderboard")
const postRoutes = require("./routes/posts")
const periodRoutes = require("./routes/periodRoutes")
const reviewRoutes = require("./routes/reviews")




const app = express()

app.use(express.json())
app.use(cors())
app.use("/uploads", express.static("uploads"))

connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/levels", levelRoutes)
app.use("/api/user-progress", userProgressRoutes)
app.use("/api/leaderboard", leaderboardRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/period", periodRoutes)
app.use("/api/reviews", reviewRoutes)



const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("exercise_progress", (data) => {
    socket.broadcast.emit("exercise_update", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

module.exports = app

