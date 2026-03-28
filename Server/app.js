const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// أنشئ تطبيق Express
const app = express();

// ── Middleware ──────────────────────────────────────

// Helmet: يضيف HTTP headers أمنية تحمي من هجمات شائعة
app.use(helmet());

// CORS: يسمح للـ frontend (على port 5173) يتكلم مع الـ backend (على port 5000)
// بدون هذا، المتصفح يرفض الـ requests تلقائياً
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body Parser: يحوّل الـ JSON القادم في الـ request إلى JavaScript object
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Morgan: يطبع في الـ terminal كل request مع status code والوقت
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Routes ──────────────────────────────────────────

// Health Check: تفتحه في المتصفح للتأكد أن السيرفر شغّال
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ── Error Handlers ───────────────────────────────────

// 404: لو طلب وصل لـ route غير موجود
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler: يمسك أي خطأ في أي مكان في التطبيق
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;