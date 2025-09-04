# 🔞 ProxiMeet - Adult Dating Platform

**Version:** 1.0.0 (Development)  
**Tech Stack:** Next.js 14, TypeScript, PostgreSQL, Prisma, NextAuth.js, Tailwind CSS, shadcn/ui  
**Status:** ✅ Stage 1 Complete - Project Setup with Age Gate

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your database and API keys

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

## ✅ Completed Features (Stage 1)

### Core Setup
- ✅ Next.js 14 with App Router and TypeScript strict mode
- ✅ Tailwind CSS with dark mode as default
- ✅ ESLint with security plugins for adult content platform
- ✅ shadcn/ui component system with ProxiMeet branding

### Safety & Legal Compliance
- ✅ **Mandatory 18+ Age Gate** - Cannot be bypassed
- ✅ Age verification with date validation
- ✅ Secure middleware enforcing age verification on all routes
- ✅ HTTP-only cookies for age verification storage
- ✅ Adult content security headers

### Database Schema
- ✅ Comprehensive Prisma schema for adult dating platform
- ✅ User model with age verification requirements
- ✅ Safety profiles with emergency contacts
- ✅ Verification system (photo, ID, background check)
- ✅ Privacy-focused photo management
- ✅ Encounter tracking with consent verification
- ✅ Safety reporting and blocking systems

### UI/UX Design
- ✅ Dark mode first design for discretion
- ✅ ProxiMeet branded color scheme (deep purple & electric blue)
- ✅ Adult-appropriate typography and spacing
- ✅ Safety-first UI patterns

## 🛡️ Safety Features Implemented

1. **Age Verification**
   - Mandatory 18+ verification before any access
   - Secure date validation and storage
   - Automatic re-verification after 30 days

2. **Security Headers**
   - X-Frame-Options: DENY (prevents embedding)
   - Content-Security-Policy with frame-ancestors 'none'
   - X-Content-Type-Options: nosniff
   - Strict-Transport-Security in production

3. **Privacy by Design**
   - Dark mode default for discretion
   - No personal information in initial setup
   - Anonymous until match approach

## 📁 Project Structure

```
proximeet/
├── src/
│   ├── app/
│   │   ├── age-verification/       # 18+ age gate
│   │   ├── discover/              # Main discovery feed (placeholder)
│   │   ├── api/
│   │   │   └── age-verify/        # Age verification API
│   │   ├── globals.css            # ProxiMeet dark theme
│   │   ├── layout.tsx             # Root layout with metadata
│   │   └── page.tsx               # Home redirect logic
│   ├── components/ui/             # shadcn/ui components
│   ├── lib/
│   │   ├── config/
│   │   │   └── app-config.ts      # App configuration
│   │   ├── constants/
│   │   │   └── safety.ts          # Safety constants
│   │   ├── age-verification.ts    # Age verification utilities
│   │   └── utils.ts               # Utility functions
│   └── middleware.ts              # Age verification enforcement
├── prisma/
│   └── schema.prisma              # Database schema
├── .env.local                     # Environment variables
└── package.json                   # Dependencies
```

## 🔧 Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/proximeet_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Safety Features
EMERGENCY_CONTACT_ENCRYPTION_KEY="your-encryption-key"
TWILIO_ACCOUNT_SID=""              # SMS safety alerts
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# Content Moderation
MODERATOR_API_KEY=""               # Photo/text moderation

# Location Services
MAPBOX_API_KEY=""                  # Safe meetup suggestions
```

## 🚨 Legal & Compliance

- **Age Verification:** Mandatory 18+ verification with secure storage
- **Content Rating:** Adult content with appropriate warnings
- **Privacy:** GDPR/CCPA ready with data protection by design
- **Safety:** Zero tolerance for non-consensual content
- **Terms:** Clear adult content disclaimers and consent requirements

## 🎯 Next Steps (Stage 2)

1. **Consent Education Flow**
   - Interactive consent tutorial
   - Scenario-based quiz (must pass to continue)
   - Explicit consent agreements

2. **Enhanced Verification**
   - Photo verification system
   - Real-time selfie verification
   - AI-powered photo comparison

3. **Profile Creation**
   - Adult-oriented intention selection
   - Boundary and preference setting
   - Privacy controls

## 📊 Key Metrics Tracked

- Age verification completion rate
- Failed verification attempts
- Security header compliance
- Cookie consent and storage

## 🔒 Security Features

- Rate limiting on sensitive endpoints
- SQL injection protection via Prisma
- XSS protection with Content Security Policy
- CSRF protection with SameSite cookies
- Input validation and sanitization

---

**⚠️ ADULT CONTENT WARNING**  
This application is designed for adults (18+) seeking consensual casual encounters. All features prioritize safety, consent, and privacy.

**Development Status:** Stage 1 Complete ✅  
**Next Stage:** Consent Education & Verification Systems
