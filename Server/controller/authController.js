const jwt = require('jsonwebtoken');
const User = require('../models/User');

// دالة مساعدة لإنشاء JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// دالة مساعدة لإرسال الـ response مع الـ token
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
};

// ── @route   POST /api/auth/register ──────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // تحقق أن الإيميل مش مكرر
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // أنشئ المستخدم (الـ password يتشفّر تلقائياً في الـ model)
    const user = await User.create({
      name,
      email,
      password,
      phone,
      // منع إنشاء admin من الـ API مباشرة
      role: role === 'admin' ? 'customer' : role || 'customer',
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   POST /api/auth/login ─────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // تحقق أن الإيميل والباسورد موجودين
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // دور على المستخدم وأرجع الـ password معه
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // تحقق من الـ password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   GET /api/auth/me ─────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @route   PUT /api/auth/updateprofile ──────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};