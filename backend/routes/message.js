const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// @route GET /messages/unread/count
// @desc Get total unread messages count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({ receiver: req.user.id, isRead: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /messages/:userId
// @desc Get chat history with a specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    // Mark messages as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route POST /messages/:userId
// @desc Send a message to a specific user
router.post('/:userId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const newMessage = new Message({
      sender: req.user.id,
      receiver: req.params.userId,
      text
    });
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
