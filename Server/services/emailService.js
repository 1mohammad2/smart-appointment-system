// ── إرسال Reset Password Email ────────────────────────
exports.sendPasswordResetEmail = async (user, resetURL) => {
  const mailOptions = {
    from: `"AppointPro" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: '🔑 Password Reset Request — AppointPro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">📅 AppointPro</h1>
        </div>
        <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1e293b;">Password Reset Request</h2>
          <p style="color: #64748b;">Hi <strong>${user.name}</strong>, you requested to reset your password.</p>
          <p style="color: #64748b;">Click the button below to reset it. This link expires in <strong>10 minutes</strong>.</p>
          
          <a href="${resetURL}" 
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0; font-weight: bold;">
            Reset Password
          </a>
          
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
            If you didn't request this, please ignore this email. Your password won't change.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};