# 🚀 VERCEL DEPLOYMENT GUIDE

## 🎯 Deploy ProxiMeet to Vercel

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub: `CyberDexa/proximate`
4. Vercel will auto-detect Next.js framework

### 2. Configure Build Settings
Vercel should auto-configure, but verify:
- **Framework Preset**: Next.js
- **Build Command**: `npm run vercel:build`
- **Install Command**: `npm install`
- **Output Directory**: `.next` (auto-detected)

### 3. Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

#### 🔒 Required for All Environments
```bash
# Database (from Supabase)
DATABASE_URL=postgresql://postgres:your-password@db.abc123.supabase.co:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here

# App Settings
APP_URL=https://your-domain.vercel.app
APP_NAME=ProxiMeet
SUPPORT_EMAIL=support@proximeet.app
```

#### 🔐 OAuth Providers
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### 📧 Email Service
```bash
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@proximeet.app
```

#### 💳 Payment Processing
```bash
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### 🛡️ Safety Services
```bash
# Identity verification
VERIFF_API_KEY=your-veriff-key
VERIFF_SECRET_KEY=your-veriff-secret

# SMS notifications
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Emergency services
EMERGENCY_PHONE=+44-emergency-number
```

#### 📊 Analytics & Monitoring
```bash
PLAUSIBLE_DOMAIN=proximeet.app
PLAUSIBLE_API_KEY=your-plausible-key
SENTRY_DSN=your-sentry-dsn
```

### 4. Custom Domain Setup
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain: `proximeet.app`
3. Configure DNS:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
4. Add `www` subdomain:
   ```
   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   ```

### 5. Deploy!
1. Click "Deploy" in Vercel
2. Watch build logs for any errors
3. Test deployed application

## ⚡ Performance Optimization

### Edge Functions
Configure in `vercel.json`:
```json
{
  "functions": {
    "app/api/*/route.ts": {
      "maxDuration": 30,
      "memory": 1024,
      "regions": ["lhr1"]
    }
  }
}
```

### Static Generation
Ensure static pages are optimized:
- Legal pages (terms, privacy)
- Landing pages
- Marketing content

### Database Connection Pooling
Vercel automatically handles this with Supabase.

## 🔧 Post-Deployment Setup

### 1. Test Core Features
- [ ] Age verification flow
- [ ] User registration/login
- [ ] Profile creation
- [ ] Basic matching
- [ ] Emergency features

### 2. Configure OAuth
Update redirect URLs in:
- **Google OAuth Console**: Add `https://your-domain.vercel.app/api/auth/callback/google`
- **Other providers**: Update accordingly

### 3. Set Up Webhooks
- **Stripe**: Point to `https://your-domain.vercel.app/api/webhooks/stripe`
- **Veriff**: Point to `https://your-domain.vercel.app/api/webhooks/veriff`

### 4. Configure Analytics
- **Plausible**: Add domain
- **Sentry**: Verify error tracking
- **Vercel Analytics**: Enable in dashboard

## 📊 Monitoring & Alerts

### Vercel Dashboard
Monitor:
- **Function Performance**: Response times
- **Error Rates**: 4xx/5xx errors
- **Build Status**: Deployment success
- **Bandwidth**: Data transfer

### Set Up Alerts
1. Vercel Notifications → Add integrations
2. Configure Slack/Discord for deployment alerts
3. Set up email alerts for critical errors

### Custom Monitoring
Add health check endpoints:
```typescript
// app/api/health/route.ts - already implemented
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'up',
      auth: 'up'
    }
  });
}
```

## 🛡️ Security Hardening

### Headers
Already configured in `vercel.json`:
- Content Security Policy
- XSS Protection
- Frame Options
- HSTS

### Environment Security
- Use environment variables for all secrets
- Never commit sensitive data
- Rotate secrets regularly
- Use Vercel's secret scanning

### Rate Limiting
Implement in API routes:
```typescript
import rateLimit from '@/lib/rate-limit';

export async function POST(request: Request) {
  const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
  
  try {
    await rateLimit.consume(identifier);
    // Process request
  } catch (rejRes) {
    return new Response('Too Many Requests', { status: 429 });
  }
}
```

## 🆘 Troubleshooting

### Build Failures
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Test build locally: `npm run build`

### Runtime Errors
- Check Function logs in Vercel dashboard
- Verify database connectivity
- Check Sentry for detailed error traces

### Performance Issues
- Monitor function execution time
- Check database query performance
- Optimize images and static assets

## 🚀 Production Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] Custom domain set up with SSL
- [ ] Database schema deployed
- [ ] OAuth providers configured
- [ ] Payment processing tested
- [ ] Emergency systems tested

### Launch
- [ ] Deploy to production
- [ ] Verify all features work
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Test emergency protocols

### Post-Launch
- [ ] Set up monitoring alerts
- [ ] Configure backup procedures
- [ ] Document incident response
- [ ] Plan regular security audits

---
*Your ProxiMeet platform is ready for production!* 🎉
