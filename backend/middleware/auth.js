const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const decoded = jwt.verify(token, "your_jwt_secret")
    req.userId = decoded.id
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

module.exports = verifyToken

