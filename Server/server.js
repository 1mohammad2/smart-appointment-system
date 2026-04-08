const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const app = require('./app');
const runReminderJob = require('./utils/reminderJob');

// Railway يعطي الـ PORT تلقائياً
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    runReminderJob();
    setInterval(runReminderJob, 24 * 60 * 60 * 1000);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📋 Health check: /api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });