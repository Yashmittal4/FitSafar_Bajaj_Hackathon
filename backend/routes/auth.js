const express = require("express")
const router = express.Router()
const { body } = require("express-validator")
const authController = require("../controllers/authController")

const validateSignup = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("phoneNumber").isMobilePhone().withMessage("Invalid phone number"),
  body("gender").isIn(["male", "female", "other"]).withMessage("Invalid gender"),
  body("age").isInt({ min: 1, max: 120 }).withMessage("Age must be between 1 and 120"),
  body("height").isFloat({ min: 1, max: 300 }).withMessage("Height must be between 1 and 300 cm"),
  body("weight").isFloat({ min: 1, max: 500 }).withMessage("Weight must be between 1 and 500 kg"),
]

router.post("/signup", validateSignup, authController.signup)
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login,
)
router.put("/:id", authController.updateUser);
module.exports = router

