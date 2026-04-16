const User = require('../models/User');

const seedAdmin = async () => {
  try {
    // تحقق لو Admin موجود أصلاً
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('👤 Admin already exists');
      return;
    }

    // أنشئ Admin جديد من الـ environment variables
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@appointpro.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      phone: process.env.ADMIN_PHONE || '',
    });

    console.log('✅ Admin created successfully');
    console.log(`📧 Email: ${process.env.ADMIN_EMAIL || 'admin@appointpro.com'}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
  } catch (err) {
    console.error('❌ Admin seed failed:', err.message);
  }
};

module.exports = seedAdmin;