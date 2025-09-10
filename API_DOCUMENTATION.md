# Cortex Blog API Reference

Complete API documentation for the Cortex Blog backend services.

## Base URLs

- **Production**: `https://your-cortex-blog.vercel.app`
- **Development**: `http://localhost:3000`

## Content API (Sanity)

### GROQ Queries

#### Latest Posts
```javascript
import { api } from './lib/sanity'
const posts = await api.getLatestPosts()
```

#### Single Post
```javascript
const post = await api.getPost('post-slug')
```

#### Paginated Posts
```javascript
const posts = await api.getPosts(0, 10, 'category-slug')
```

## Serverless Functions API

### Contact Form Handler

**Endpoint**: `POST /api/handle-contact-form`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "message": "Hello, I have a question...",
  "honeypot": ""
}
```

**Success Response** (200):
```json
{
  "message": "Email sent successfully",
  "id": "resend-email-id-12345"
}
```

### Newsletter Signup Handler

**Endpoint**: `POST /api/handle-newsletter-signup`

**Request Body**:
```json
{
  "email": "subscriber@example.com",
  "honeypot": ""
}
```

**Success Response** (200):
```json
{
  "message": "Successfully subscribed to newsletter"
}
```

## Testing Examples

### cURL Tests
```bash
# Test Contact Form
curl -X POST https://your-api.vercel.app/api/handle-contact-form \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@example.com", "message": "Test", "honeypot": ""}'

# Test Newsletter
curl -X POST https://your-api.vercel.app/api/handle-newsletter-signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "honeypot": ""}'
```

## Error Handling

All error responses follow this structure:
```json
{
  "error": "Descriptive error message"
}
```

## Security Features

- Input validation and sanitization
- Anti-spam protection (honeypot fields)
- CORS configuration
- Rate limiting
- Security headers

---

For detailed documentation, see the main README.md file.