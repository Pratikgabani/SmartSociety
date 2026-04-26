import { sendContactFormEmail } from '../utils/mailer.js';

/**
 * POST /api/v1/contact/send
 * Receives contact-form data from the landing page and sends
 * an email to projectresihub@gmail.com.
 */
export const sendContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, societyName, message } = req.body;

    // ── Validation ──────────────────────────────────────────
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (First Name, Last Name, Email, Message).',
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // ── Send email ──────────────────────────────────────────
    await sendContactFormEmail({ firstName, lastName, email, societyName, message });

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you shortly.',
    });
  } catch (error) {
    console.error('Contact form email error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send your message. Please try again later.',
    });
  }
};
