const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route GET /users/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route PUT /users/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { skillsOffered, skillsWanted, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skillsOffered, skillsWanted, bio, avatar },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /users/match
router.get('/match', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    // 1. Find potential matches (people who have what you want OR want what you have)
    let matchedUsers = await User.find({
      _id: { $ne: currentUser._id },
      $or: [
        { skillsOffered: { $in: currentUser.skillsWanted } },
        { skillsWanted: { $in: currentUser.skillsOffered } }
      ]
    }).select('-password');

    // 2. Find "Discoverable" users (people who don't necessarily match but are on the platform)
    // We want to show a mix of matches and general users so discovery is possible
    const otherUsers = await User.find({
      _id: { $ne: currentUser._id, $not: { $in: matchedUsers.map(u => u._id) } }
    }).select('-password').limit(10);

    // Combine them, putting matches first
    const matches = [...matchedUsers, ...otherUsers];

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
