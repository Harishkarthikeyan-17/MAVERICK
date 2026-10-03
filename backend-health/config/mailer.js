const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"MAVERICK Security" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset Your MAVERICK Password',
    html: `
      <div style="font-family: Arial, sans-serif; background: #020617; color: #e2e8f0; padding: 40px; border-radius: 12px; max-width: 480px; margin: auto;">
        <h1 style="color: #06b6d4; font-size: 24px; margin-bottom: 8px;">MAVERICK</h1>
        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 32px;">SMART MANAGEMENT PLATFORM</p>
        
        <h2 style="color: #f1f5f9; font-size: 20px;">Password Reset Request</h2>
        <p style="color: #94a3b8; line-height: 1.6;">
          We received a request to reset your password. Click the button below to set a new password. This link expires in <strong style="color: #f1f5f9;">15 minutes</strong>.
        </p>

        <a href="${resetLink}" style="display: inline-block; margin: 24px 0; padding: 14px 32px; background: #0891b2; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">
          Reset My Password
        </a>

        <p style="color: #64748b; font-size: 12px; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
          If you did not request this, ignore this email. Your password will not change.<br/>
          This link can only be used once.
        </p>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetEmail };