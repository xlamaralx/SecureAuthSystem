import nodemailer from 'nodemailer';

// Configure email transport
let transporter: nodemailer.Transporter;

if (process.env.NODE_ENV === 'production') {
  // Production email setup
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  // Development email setup (logs to console)
  transporter = {
    sendMail: async (options: any) => {
      console.log('----------------------');
      console.log('Email Sent:');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Body:', options.text || options.html);
      console.log('----------------------');
      return { messageId: 'mock-id' };
    },
  } as unknown as nodemailer.Transporter;
}

// Send verification code email
export async function sendVerificationEmail(
  email: string,
  name: string,
  code: string
): Promise<void> {
  const subject = 'Your Verification Code';
  const text = `Hello ${name},\n\nYour verification code is: ${code}\n\nThis code will expire in 15 minutes.\n\nRegards,\nYour Application Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Hello ${name},</h2>
      <p>Your verification code is:</p>
      <div style="background-color: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px;">
        ${code}
      </div>
      <p>This code will expire in 15 minutes.</p>
      <p>Regards,<br>Your Application Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@yourapplication.com',
    to: email,
    subject,
    text,
    html,
  });
}

// Send password reset email
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:5000'}/reset-password?token=${token}`;
  
  const subject = 'Password Reset Request';
  const text = `Hello ${name},\n\nYou requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nRegards,\nYour Application Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Hello ${name},</h2>
      <p>You requested a password reset. Please click the button below to reset your password:</p>
      <div style="margin: 25px 0;">
        <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Your Password
        </a>
      </div>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Regards,<br>Your Application Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@yourapplication.com',
    to: email,
    subject,
    text,
    html,
  });
}
