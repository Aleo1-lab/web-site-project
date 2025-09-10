// Security middleware for API routes
export function securityHeaders(req, res, next) {
  // CORS configuration
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000', // Development
    'https://localhost:3000' // HTTPS development
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // Security headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  if (next) next();
}

// Rate limiting helper
export function createRateLimiter(windowMs = 15 * 60 * 1000, max = 100) {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }
    
    // Count requests from this IP
    const userRequests = Array.from(requests.entries())
      .filter(([key]) => key.startsWith(ip))
      .length;
    
    if (userRequests >= max) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    requests.set(`${ip}-${now}`, now);
    if (next) next();
  };
}

// Input validation helpers
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>\"'&]/g, (match) => {
    const map = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return map[match];
  });
}

// Environment validation
export function validateEnvironment() {
  const required = [
    'SANITY_PROJECT_ID',
    'SANITY_DATASET'
  ];
  
  const missing = required.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}