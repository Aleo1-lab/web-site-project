import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message, honeypot } = req.body;

    // Spam protection - honeypot field should be empty
    if (honeypot) {
      return res.status(400).json({ error: 'Spam detected' });
    }

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Sanitize inputs to prevent XSS
    const sanitizedName = name.replace(/[<>\"']/g, '');
    const sanitizedMessage = message.replace(/[<>\"']/g, '');

    // Send email
    const { data, error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'noreply@cortex-blog.com',
      to: process.env.CONTACT_EMAIL || 'contact@cortex-blog.com',
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
      `
    });

    if (error) {
      console.error('Email sending error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ 
      message: 'Email sent successfully',
      id: data.id 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}