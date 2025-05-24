const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get user by ID (public, no auth required)
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ name: user.name });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;