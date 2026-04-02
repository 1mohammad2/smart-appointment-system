const Appointment = require('../models/Appointment');
const { sendReminder } = require('../services/emailService');

// هذه الدالة تشتغل كل يوم — تدور على المواعيد اللي بكره
// وترسل reminder لكل واحد منها
const runReminderJob = async () => {
  try {
    // حدد نطاق الوقت: من بداية بكره لنهايته
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setHours(23, 59, 59, 999);

    // دور على المواعيد المؤكدة اللي بكره ولم يُرسل لها reminder
    const appointments = await Appointment.find({
      date: { $gte: tomorrow, $lte: dayAfter },
      status: 'confirmed',
      reminderSent: false,
    })
      .populate('customer', 'name email')
      .populate('staff', 'name')
      .populate('service', 'name price');

    console.log(`📧 Found ${appointments.length} appointments for tomorrow`);

    // أرسل reminder لكل موعد
    for (const appointment of appointments) {
      try {
        await sendReminder(appointment);
        // علّم الموعد أنه اتبعثله reminder
        await Appointment.findByIdAndUpdate(appointment._id, {
          reminderSent: true,
        });
        console.log(`✅ Reminder sent to ${appointment.customer.email}`);
      } catch (err) {
        console.error(`❌ Failed to send reminder: ${err.message}`);
      }
    }
  } catch (err) {
    console.error('Reminder job error:', err.message);
  }
};

module.exports = runReminderJob;