const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {
  register, login, getMe,
  updateProfile, forgotPassword, resetPassword,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin } = require('../middleware/validate');

// Auth
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);
router.post('/forgotpassword', authLimiter, forgotPassword);
router.put('/resetpassword/:token', resetPassword);

// Staff listing للـ booking form
router.get('/staff', protect, async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff', isActive: true })
      .select('name email');
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin — جلب كل المستخدمين
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('name email role isActive createdAt');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin — ترقية/تخفيض مستخدم
router.put('/make-staff/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const newRole = user.role === 'staff' ? 'customer' : 'staff';
    user.role = newRole;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin — تفعيل/تعطيل مستخدم
router.put('/users/:id/toggle', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;