const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {
  register,
  login,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);

// Staff listing — يحتاجه الـ frontend عند إنشاء موعد جديد
router.get('/staff', protect, async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff', isActive: true })
      .select('name email');
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;