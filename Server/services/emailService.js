const nodemailer = require('nodemailer');

// أنشئ الـ transporter — هو المسؤول عن إرسال الإيميلات
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── إرسال تأكيد الحجز ─────────────────────────────────
exports.sendBookingConfirmation = async (appointment) => {
  const { customer, service, date, startTime, staff } = appointment;

  const mailOptions = {
    from: `"AppointPro" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: '✅ Appointment Confirmed — AppointPro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">📅 AppointPro</h1>
        </div>
        <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1e293b;">Appointment Confirmed!</h2>
          <p style="color: #64748b;">Hi <strong>${customer.name}</strong>, your appointment has been booked successfully.</p>
          
          <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #2563eb;">
            <p><strong>Service:</strong> ${service.name}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${startTime}</p>
            <p><strong>Staff:</strong> ${staff.name}</p>
            <p><strong>Price:</strong> AED ${service.price}</p>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            If you need to cancel or reschedule, please contact us at least 24 hours in advance.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ── إرسال reminder قبل الموعد بيوم ───────────────────
exports.sendReminder = async (appointment) => {
  const { customer, service, date, startTime, staff } = appointment;

  const mailOptions = {
    from: `"AppointPro" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: '⏰ Reminder: Your appointment is tomorrow — AppointPro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">📅 AppointPro</h1>
        </div>
        <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1e293b;">⏰ Reminder: Tomorrow's Appointment</h2>
          <p style="color: #64748b;">Hi <strong>${customer.name}</strong>, just a friendly reminder about your appointment tomorrow.</p>
          
          <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #f59e0b;">
            <p><strong>Service:</strong> ${service.name}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${startTime}</p>
            <p><strong>Staff:</strong> ${staff.name}</p>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">See you tomorrow! 👋</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ── إرسال إشعار إلغاء ─────────────────────────────────
exports.sendCancellationNotice = async (appointment) => {
  const { customer, service, date, startTime } = appointment;

  const mailOptions = {
    from: `"AppointPro" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: '❌ Appointment Cancelled — AppointPro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">📅 AppointPro</h1>
        </div>
        <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1e293b;">Appointment Cancelled</h2>
          <p style="color: #64748b;">Hi <strong>${customer.name}</strong>, your appointment has been cancelled.</p>
          
          <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc2626;">
            <p><strong>Service:</strong> ${service.name}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${startTime}</p>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            Feel free to book a new appointment anytime.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};