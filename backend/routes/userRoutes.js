// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// Get all users (admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 }); // omit password
    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete user by ID (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update user details by ID (admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true, select: '-password' }
    );
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
