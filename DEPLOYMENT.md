# Cortex Blog Backend - Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **Sanity.io Account**: Create a project at https://www.sanity.io
2. **Vercel Account**: Sign up at https://vercel.com
3. **Email Service**: Set up Resend account at https://resend.com
4. **Newsletter Service** (optional): Mailchimp, ConvertKit, or Buttondown

## Step-by-Step Deployment

### 1. Sanity Setup

1. **Initialize Sanity project**:
   ```bash
   cd web-site-project
   npx sanity init
   ```

2. **Follow prompts**:
   - Choose "Yes" to create new project
   - Select dataset name (usually "production")
   - Choose "Yes" to use TypeScript (optional)

3. **Deploy schemas**:
   ```bash
   npx sanity schema deploy
   ```

4. **Start Sanity Studio** (optional):
   ```bash
   npm run dev
   ```

### 2. Environment Configuration

1. **Copy environment template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Update environment variables**:
   ```env
   # Get these from your Sanity project dashboard
   SANITY_PROJECT_ID=your_sanity_project_id
   SANITY_DATASET=production
   
   # Get from Resend dashboard
   RESEND_API_KEY=re_your_resend_api_key
   SENDER_EMAIL=noreply@yourdomain.com
   CONTACT_EMAIL=contact@yourdomain.com
   
   # Your frontend URL
   FRONTEND_URL=https://yourdomain.com
   
   # Newsletter service (choose one)
   MAILCHIMP_API_KEY=your_mailchimp_key
   MAILCHIMP_SERVER_PREFIX=us1
   MAILCHIMP_AUDIENCE_ID=your_audience_id
   ```

### 3. Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   npm run deploy
   ```
   or
   ```bash
   vercel
   ```

3. **Configure environment variables in Vercel**:
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all variables from your `.env.local`

### 4. Domain Configuration

1. **Add custom domain** (optional):
   - In Vercel dashboard, go to Settings > Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **Update CORS settings**:
   - Update `FRONTEND_URL` in environment variables
   - Redeploy if necessary

### 5. Email Service Setup

#### Resend Configuration

1. **Create Resend account**: https://resend.com
2. **Get API key**: Dashboard > API Keys
3. **Verify sender domain**: Dashboard > Domains
4. **Update environment variables**

#### Alternative: SendGrid

If you prefer SendGrid, update the contact form handler:

```javascript
// In api/handle-contact-form.js, replace Resend with SendGrid
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
```

### 6. Newsletter Service Setup

#### Option A: Mailchimp

1. **Create Mailchimp account**
2. **Create audience**
3. **Get API key**: Account > Extras > API keys
4. **Update environment variables**

#### Option B: ConvertKit

1. **Create ConvertKit account**
2. **Create form**
3. **Get API key**: Account settings > API
4. **Update environment variables**

#### Option C: Buttondown

1. **Create Buttondown account**
2. **Get API key**: Settings > Programming
3. **Update environment variables**

### 7. Testing Deployment

1. **Test API endpoints**:
   ```bash
   # Test contact form
   curl -X POST https://your-domain.vercel.app/api/handle-contact-form \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","message":"Test","honeypot":""}'
   
   # Test newsletter signup
   curl -X POST https://your-domain.vercel.app/api/handle-newsletter-signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","honeypot":""}'
   ```

2. **Test Sanity content**:
   - Access Sanity Studio
   - Create test content
   - Verify content retrieval

### 8. Production Checklist

- [ ] All environment variables configured
- [ ] Email service working
- [ ] Newsletter service working
- [ ] CORS properly configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] API endpoints responding
- [ ] Sanity Studio accessible
- [ ] Content creation working

## Troubleshooting

### Common Issues

1. **API endpoints not working**:
   - Check environment variables in Vercel
   - Verify function deployment
   - Check Vercel function logs

2. **Email not sending**:
   - Verify Resend API key
   - Check sender domain verification
   - Review email service quotas

3. **CORS errors**:
   - Verify `FRONTEND_URL` setting
   - Check browser console for origin
   - Update Vercel headers if needed

4. **Sanity connection issues**:
   - Verify project ID and dataset
   - Check API token permissions
   - Ensure schemas are deployed

### Monitoring

1. **Vercel dashboard**: Monitor function performance and errors
2. **Email service dashboard**: Track email delivery
3. **Newsletter service dashboard**: Monitor subscriptions
4. **Sanity dashboard**: Monitor content updates

## Maintenance

### Regular Tasks

1. **Update dependencies**:
   ```bash
   npm update
   ```

2. **Monitor API usage**: Check service quotas and limits
3. **Backup content**: Export Sanity content regularly
4. **Review logs**: Check for errors and performance issues

### Scaling Considerations

- **Function limits**: Vercel functions have execution time limits
- **Email limits**: Monitor email service quotas
- **Database limits**: Sanity has usage limits on free plans
- **Bandwidth**: Monitor Vercel bandwidth usage

---

**Deployment complete! Your Cortex Blog Backend is now live.**