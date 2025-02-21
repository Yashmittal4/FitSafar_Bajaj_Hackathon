const express = require("express")
const router = express.Router()
const userProgressController = require("../controllers/userProgressController")
const verifyToken = require("../middleware/auth")

router.get("/", verifyToken, userProgressController.getUserProgress)

module.exports = router

