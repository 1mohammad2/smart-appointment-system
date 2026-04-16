const rateLimit = require('express-rate-limit');

// حد الـ requests للـ Auth routes
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 10, // أقصى 10 محاولات كل 15 دقيقة
  message: {
    success: false,
    message: 'Too many attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// حد الـ requests العام لكل الـ API
exports.generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 دقائق
  max: 100, // أقصى 100 request كل 10 دقائق
  message: {
    success: false,
    message: 'Too many requests, please slow down',
  },
  standardHeaders: true,
  legacyHeaders: false,
});