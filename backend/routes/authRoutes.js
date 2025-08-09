const express = require("express");
const { signUp, signIn, signOut } = require("../controllers/authController");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
