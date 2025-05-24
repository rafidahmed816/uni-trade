const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");
const auth = require("../middleware/authMiddleware");

// Get messages for a conversation
router.get("/", auth, async (req, res) => {
  const { sellerId, listingId } = req.query;
  const buyerId = req.user.id;
  const messages = await ChatMessage.find({
    sellerId,
    buyerId,
    listingId,
  }).sort("createdAt");
  res.json(messages);
});

// Send a message
router.post("/", auth, async (req, res) => {
  const { sellerId, listingId, text } = req.body;
  const buyerId = req.user.id;
  const senderId = req.user.id;
  const msg = await ChatMessage.create({
    sellerId,
    buyerId,
    listingId,
    senderId,
    text,
  });
  res.json(msg);
});

module.exports = router;