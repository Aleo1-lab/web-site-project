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
    const { email, honeypot } = req.body;

    // Spam protection
    if (honeypot) {
      return res.status(400).json({ error: 'Spam detected' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Mailchimp integration
    if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID) {
      const response = await fetch(`https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `apikey ${process.env.MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.title === 'Member Exists') {
          return res.status(400).json({ error: 'Email already subscribed' });
        }
        throw new Error('Failed to subscribe to Mailchimp');
      }

      return res.status(200).json({ 
        message: 'Successfully subscribed to newsletter' 
      });
    }

    // ConvertKit integration (alternative)
    if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) {
      const response = await fetch(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: process.env.CONVERTKIT_API_KEY,
          email: email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to ConvertKit');
      }

      return res.status(200).json({ 
        message: 'Successfully subscribed to newsletter' 
      });
    }

    // Buttondown integration (alternative)
    if (process.env.BUTTONDOWN_API_KEY) {
      const response = await fetch('https://api.buttondown.email/v1/subscribers', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.BUTTONDOWN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        })
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 400 && error.email && error.email.includes('already exists')) {
          return res.status(400).json({ error: 'Email already subscribed' });
        }
        throw new Error('Failed to subscribe to Buttondown');
      }

      return res.status(200).json({ 
        message: 'Successfully subscribed to newsletter' 
      });
    }

    // If no newsletter service is configured, just return success
    // In a real application, you might want to store emails in a database
    return res.status(200).json({ 
      message: 'Newsletter subscription received (no service configured)' 
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}