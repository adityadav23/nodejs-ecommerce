const express = require("express");
const {
  loginUser,
  logoutUser,
  createUser,
} = require("../controllers/authController");
const {
  authMiddleware,
  superAdminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.post("/register", createUser);
// Example of a protected route for super admins
router.get("/admin", authMiddleware, superAdminMiddleware, (req, res) => {
  res.json({ message: "Welcome, Super Admin!" });
});

module.exports = router;
