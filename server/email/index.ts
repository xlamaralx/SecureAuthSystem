import nodemailer from 'nodemailer';

// In a production environment, you would use a real email service
// For development, we'll just console.log the emails
const isDevelopment = process.env.NODE_ENV !== 'production';

let transporter: nodemailer.Transporter;

if (isDevelopment) {
  // Create a test account for development
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
      pass: process.env.EMAIL_PASSWORD || 'ethereal_password'
    }
  });
} else {
  // Configure with your production email service
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

export async function sendTwoFactorCode(to: string, code: string): Promise<void> {
  if (isDevelopment) {
    console.log(`[DEV ONLY] Sending 2FA code ${code} to ${to}`);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    to,
    subject: 'Your verification code',
    text: `Your verification code is: ${code}. It will expire in 15 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verification Code</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
          ${code}
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:5000'}/reset-password?token=${token}`;

  if (isDevelopment) {
    console.log(`[DEV ONLY] Password reset link: ${resetUrl} sent to ${to}`);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    to,
    subject: 'Password Reset Request',
    text: `Click the following link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4285F4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this URL into your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}
