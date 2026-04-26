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
          Welcome to <strong>ResiHub</strong>! Use the OTP below to verify your email address.
          It is valid for <strong>5 minutes</strong>.
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

/**
 * Send Password Reset OTP email to user.
 */
export const sendResetPasswordEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'resihubproject@gmail.com',
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Resihub " <resihubproject@gmail.com>',
    to,
    subject: 'Password Reset OTP – Resihub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background:#f9f9f9; border-radius:12px;">
        <h2 style="color:#dc2626; margin-bottom:8px;">Reset Your Password</h2>
        <p style="color:#374151; font-size:15px;">
          Use the OTP below to reset your account password. 
          This code is valid for <strong>5 minutes</strong>.
        </p>
        <div style="margin:32px 0; text-align:center;">
          <span style="
            display:inline-block;
            font-size:40px;
            font-weight:bold;
            letter-spacing:12px;
            color:#dc2626;
            background:#fee2e2;
            padding:16px 32px;
            border-radius:10px;
          ">${otp}</span>
        </div>
        <p style="color:#6b7280; font-size:13px;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#9ca3af; font-size:12px; text-align:center;">
          Resihub – Society Management System
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Send Refund Request Review email to Admin.
 */
export const sendRefundReviewEmail = async (adminEmails, userEmail, reason, amount, orderType, paymentIntentId) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'resihubproject@gmail.com',
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Resihub Alerts" <resihubproject@gmail.com>',
    to: adminEmails.join(','),
    subject: 'Action Required: Pending Refund Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background:#f9f9f9; border-radius:12px;">
        <h2 style="color:#d97706; margin-bottom:8px;">Pending Refund Request Review</h2>
        <p style="color:#374151; font-size:15px;">
          A user has requested a refund that requires manual approval (payment made > 24 hours ago).
        </p>
        <div style="background:#fff; padding:16px; border-radius:8px; border:1px solid #e5e7eb; margin: 24px 0;">
          <p><strong>User Email:</strong> ${userEmail}</p>
          <p><strong>Order Type:</strong> ${orderType}</p>
          <p><strong>Refund Amount:</strong> ₹${amount}</p>
          <p><strong>Payment Intent:</strong> ${paymentIntentId}</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;"/>
          <p><strong>User Reason for Refund:</strong><br/>
          <em style="color:#4b5563;">"${reason}"</em></p>
        </div>
        <p style="color:#374151; font-size:15px;">
          Please review this request from the admin dashboard and either approve or reject it.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#9ca3af; font-size:12px; text-align:center;">
          Resihub – Society Management System
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Send Refund Processed email to User.
 */
export const sendRefundProcessedEmail = async (userEmail, amount, orderType, paymentIntentId) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'resihubproject@gmail.com',
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Resihub Updates" <resihubproject@gmail.com>',
    to: userEmail,
    subject: 'Refund Processed Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background:#f9f9f9; border-radius:12px;">
        <h2 style="color:#10b981; margin-bottom:8px;">Your Refund Has Been Processed</h2>
        <p style="color:#374151; font-size:15px;">
          Good news! We have successfully processed your refund. Depending on your bank, it may take 5-10 business days for the funds to ultimately appear in your account.
        </p>
        <div style="background:#fff; padding:16px; border-radius:8px; border:1px solid #e5e7eb; margin: 24px 0;">
          <p><strong>Order Type:</strong> ${orderType}</p>
          <p><strong>Refund Amount:</strong> ₹${amount}</p>
          <p><strong>Transaction ID:</strong> ${paymentIntentId}</p>
        </div>
        <p style="color:#374151; font-size:15px;">
          If you have any questions, please contact your society administration.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#9ca3af; font-size:12px; text-align:center;">
          Resihub – Society Management System
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Send new notice broadcast email to society members.
 */
export const sendNoticeCreatedEmail = async (memberEmails, noticeTopic, noticeDescription, noticeDate, postedBy) => {
  if (!Array.isArray(memberEmails) || memberEmails.length === 0) return null;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'resihubproject@gmail.com',
      pass: process.env.APP_PASSWORD,
    },
  });

  const formattedDate = new Date(noticeDate || Date.now()).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const mailOptions = {
    from: '"Resihub Notices" <resihubproject@gmail.com>',
    bcc: memberEmails.join(','),
    subject: `New Society Notice: ${noticeTopic}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background:#f9f9f9; border-radius:12px;">
        <h2 style="color:#1d4ed8; margin-bottom:8px;">New Notice Published</h2>
        <p style="color:#374151; font-size:15px;">
          A new notice has been posted for your society.
        </p>
        <div style="background:#fff; padding:16px; border-radius:8px; border:1px solid #e5e7eb; margin: 24px 0;">
          <p><strong>Topic:</strong> ${noticeTopic}</p>
          <p><strong>Description:</strong><br/>${noticeDescription}</p>
          <p><strong>Posted By:</strong> ${postedBy || 'Society Admin'}</p>
          <p><strong>Published On:</strong> ${formattedDate}</p>
        </div>
        <p style="color:#374151; font-size:15px;">
          Please check the Notices section in the app for complete details.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#9ca3af; font-size:12px; text-align:center;">
          Resihub – Society Management System
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Send visitor arrival alert email to house owner(s).
 */
export const sendVisitorArrivalEmail = async (ownerEmails, visitorDetails) => {
  if (!Array.isArray(ownerEmails) || ownerEmails.length === 0) return null;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'resihubproject@gmail.com',
      pass: process.env.APP_PASSWORD,
    },
  });

  const {
    visitorName,
    visitorPhone,
    purpose,
    visitingBlock,
    visitingAdd,
    visitDate,
    recordedBy,
  } = visitorDetails || {};

  const formattedDate = new Date(visitDate || Date.now()).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const mailOptions = {
    from: '"Resihub Security" <resihubproject@gmail.com>',
    bcc: ownerEmails.join(','),
    subject: `Visitor Alert for ${visitingBlock}-${visitingAdd}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background:#f9f9f9; border-radius:12px;">
        <h2 style="color:#0f766e; margin-bottom:8px;">Visitor Arrival Alert</h2>
        <p style="color:#374151; font-size:15px;">
          A visitor entry has been recorded for your house.
        </p>
        <div style="background:#fff; padding:16px; border-radius:8px; border:1px solid #e5e7eb; margin: 24px 0;">
          <p><strong>Visitor Name:</strong> ${visitorName || 'N/A'}</p>
          <p><strong>Visitor Phone:</strong> ${visitorPhone || 'N/A'}</p>
          <p><strong>Purpose:</strong> ${purpose || 'N/A'}</p>
          <p><strong>Visiting House:</strong> ${visitingBlock || 'N/A'}-${visitingAdd || 'N/A'}</p>
          <p><strong>Entry Time:</strong> ${formattedDate}</p>
          <p><strong>Recorded By:</strong> ${recordedBy || 'Security Desk'}</p>
        </div>
        <p style="color:#374151; font-size:15px;">
          You can view visitor details in the Visitors section of the app.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#9ca3af; font-size:12px; text-align:center;">
          Resihub – Society Management System
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Send Contact Us form enquiry email to ResiHub team.
 * @param {Object} contactData - { firstName, lastName, email, societyName, message }
 */
export const sendContactFormEmail = async (contactData) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'resihubproject@gmail.com',
      pass: process.env.APP_PASSWORD,
    },
  });

  const { firstName, lastName, email, societyName, message } = contactData;
  const fullName = `${firstName} ${lastName}`.trim();
  const submittedAt = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const mailOptions = {
    from: '"Resihub Contact Form" <resihubproject@gmail.com>',
    to: 'projectresihub@gmail.com',
    replyTo: email,
    subject: `New Contact Enquiry from ${fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background:#f9f9f9; border-radius:12px;">
        <h2 style="color:#1a56db; margin-bottom:8px;">New Contact Form Submission</h2>
        <p style="color:#374151; font-size:15px;">
          You have received a new enquiry from the ResiHub landing page.
        </p>
        <div style="background:#fff; padding:20px; border-radius:8px; border:1px solid #e5e7eb; margin: 24px 0;">
          <p style="margin:0 0 12px;"><strong>Name:</strong> ${fullName}</p>
          <p style="margin:0 0 12px;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#1a56db;">${email}</a></p>
          <p style="margin:0 0 12px;"><strong>Society Name:</strong> ${societyName || 'Not specified'}</p>
          <p style="margin:0 0 12px;"><strong>Submitted At:</strong> ${submittedAt}</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;"/>
          <p style="margin:0 0 4px;"><strong>Message:</strong></p>
          <p style="color:#4b5563; white-space:pre-wrap; margin:0;">${message}</p>
        </div>
        <p style="color:#6b7280; font-size:13px;">
          You can reply directly to this email to respond to <strong>${fullName}</strong>.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#9ca3af; font-size:12px; text-align:center;">
          Resihub – Society Management System
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
