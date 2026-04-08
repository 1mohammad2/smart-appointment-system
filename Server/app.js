const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// ── استيراد الـ Routes ────────────────────────────────
// كل سطر هنا يقول "اجلب الـ routes من هذا الملف"
const authRoutes        = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const serviceRoutes     = require('./routes/serviceRoutes');

const app = express();
// مهم لـ Railway — يثق في الـ proxy
app.set('trust proxy', 1);

// ── Middleware ────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Routes ────────────────────────────────────────────
// الـ health check - للتأكد أن السيرفر شغّال
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ربط الـ routes:
// أي request يبدأ بـ /api/auth    → يروح لـ authRoutes
// أي request يبدأ بـ /api/appointments → يروح لـ appointmentRoutes
// أي request يبدأ بـ /api/services    → يروح لـ serviceRoutes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);

// ── Error Handlers ────────────────────────────────────
// 404: لو ما لقى أي route تطابق الـ request
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler: يمسك أي خطأ في التطبيق
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;