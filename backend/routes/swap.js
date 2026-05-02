const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SwapRequest = require('../models/SwapRequest');

// @route POST /swap/request
router.post('/request', auth, async (req, res) => {
  try {
    const { toUserId } = req.body;
    const existingRequest = await SwapRequest.findOne({
      fromUser: req.user.id,
      toUser: toUserId,
      status: 'pending'
    });

    if (existingRequest) return res.status(400).json({ message: 'Request already sent' });

    const newRequest = new SwapRequest({
      fromUser: req.user.id,
      toUser: toUserId
    });

    await newRequest.save();
    res.json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route PUT /swap/:id/accept
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const request = await SwapRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.toUser.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

    request.status = 'accepted';
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route PUT /swap/:id/reject
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const request = await SwapRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.toUser.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

    request.status = 'rejected';
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /swap/my
router.get('/my', auth, async (req, res) => {
  try {
    const sent = await SwapRequest.find({ fromUser: req.user.id }).populate('toUser', 'name email');
    const received = await SwapRequest.find({ toUser: req.user.id }).populate('fromUser', 'name email');
    res.json({ sent, received });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
