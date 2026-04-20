const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin } = require('../middleware/validate');

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);

// Forgot & Reset Password
router.post('/forgotpassword', authLimiter, forgotPassword);
router.put('/resetpassword/:token', resetPassword);

// Staff listing
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