const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");
const auth = require("../middleware/authMiddleware");

// Get messages for a conversation (for both buyer and seller)
router.get("/", auth, async (req, res) => {
  const { sellerId, listingId } = req.query;
  const userId = req.user.id;
  const messages = await ChatMessage.find({
    sellerId,
    listingId,
    $or: [{ buyerId: userId }, { sellerId: userId }],
  }).sort("createdAt");
  res.json(messages);
});

// Send a message (from buyer or seller)
router.post("/", auth, async (req, res) => {
  const { sellerId, listingId, text } = req.body;
  const senderId = req.user.id;

  // Find the buyerId for this chat
  let buyerId = senderId;
  if (senderId === sellerId) {
    // If sender is seller, get the buyerId from the latest message
    const lastMsg = await ChatMessage.findOne({ sellerId, listingId }).sort({
      createdAt: -1,
    });
    if (!lastMsg)
      return res.status(400).json({ msg: "No buyer found for this chat." });
    buyerId = lastMsg.buyerId;
  }

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