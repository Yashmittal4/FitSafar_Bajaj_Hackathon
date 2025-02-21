const express = require("express")
const router = express.Router()
const levelController = require("../controllers/levelController")
const verifyToken = require("../middleware/auth")

router.get("/", levelController.getAllLevels)
router.get("/:levelNumber", verifyToken, levelController.getLevel)
router.post("/", levelController.createLevel)
router.post("/:levelNumber", levelController.updateLevel)
router.delete("/:levelNumber", levelController.deleteLevel)
router.post("/:levelId/complete", verifyToken, levelController.completeLevel)

module.exports = router

