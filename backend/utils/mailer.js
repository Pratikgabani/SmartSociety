import nodemailer from 'nodemailer';

/**
 * Send OTP verification email to user.
 * Transporter is created lazily on first call so that process.env is
 * fully populated by dotenv before we read APP_PASSWORD.
 * @param {string} to  - Recipient email address
 * @param {string} otp - 6-digit OTP code
 */
export const sendOtpEmail = async (to, otp) => {
  // Create transporter here (lazy) so dotenv vars are available
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'resihubproject@gmail.com',
      pass: process.env.APP_PASSWORD,  // 16-char Gmail App Password
    },
  });
  const mailOptions = {
    from: '"Resihub " <resihubproject@gmail.com>',
    to,
    subject: 'Your Registration OTP – Resihub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background:#f9f9f9; border-radius:12px;">
        <h2 style="color:#1a56db; margin-bottom:8px;">Email Verification</h2>
        <p style="color:#374151; font-size:15px;">
          Welcome to <strong>SmartSociety</strong>! Use the OTP below to verify your email address.
          It is valid for <strong>10 minutes</strong>.
        </p>
        <div style="margin:32px 0; text-align:center;">
          <span style="
            display:inline-block;
            font-size:40px;
            font-weight:bold;
            letter-spacing:12px;
            color:#1a56db;
            background:#e8f0fe;
            padding:16px 32px;
            border-radius:10px;
          ">${otp}</span>
        </div>
        <p style="color:#6b7280; font-size:13px;">
          If you did not request this, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#9ca3af; font-size:12px; text-align:center;">
          Resihub – Society Management System
        </p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  // console.log(`📧  OTP email sent to ${to} | MessageId: ${info.messageId}`);

  return info;
};


