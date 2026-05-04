const rateLimit = require('express-rate-limit');

// للـ Auth routes فقط — تسجيل دخول وتسجيل
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // تجاهل الـ health check
  skip: (req) => req.path === '/api/health',
});

// للـ API العام — أكثر تساهلاً
exports.generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500, // رفعنا الحد من 100 لـ 500
  message: {
    success: false,
    message: 'Too many requests, please slow down',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // تجاهل الـ health check تماماً
  skip: (req) => req.path === '/api/health',
});