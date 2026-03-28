// dotenv لازم يكون أول سطر - يقرأ ملف .env ويحمّل المتغيرات
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// الخطوات عند تشغيل السيرفر:
// 1. اتصل بـ MongoDB
// 2. لو نجح، شغّل السيرفر
// 3. لو فشل، اطبع الخطأ وأوقف البرنامج

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // أوقف البرنامج بكود خطأ
  });