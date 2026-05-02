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
    const { skillsOffered, skillsWanted } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skillsOffered, skillsWanted },
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
    
    // Logic: Find users who offer what I want AND want what I offer
    const matches = await User.find({
      _id: { $ne: currentUser._id },
      skillsOffered: { $in: currentUser.skillsWanted },
      skillsWanted: { $in: currentUser.skillsOffered }
    }).select('-password');

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
