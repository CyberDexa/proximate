# 🔧 SUPABASE SETUP GUIDE

## 🎯 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and fill project details:
   - **Name**: `proximeet-production` (or `proximeet-staging`)
   - **Database Password**: Use a strong password
   - **Region**: Europe West (London) for UK users
4. Wait for project to initialize (~2 minutes)

### 2. Get Database Connection
1. Go to **Settings** → **Database**
2. Scroll to **Connection string**
3. Copy the URI and replace `[YOUR-PASSWORD]` with your database password
4. Example: `postgresql://postgres:your-password@db.abc123.supabase.co:5432/postgres`

### 3. Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://abc123.supabase.co`
   - **anon/public key**: `eyJhbGc...` (for client-side)
   - **service_role key**: `eyJhbGc...` (for server-side, keep secret!)

### 4. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:
```bash
# Database
DATABASE_URL=postgresql://postgres:your-password@db.abc123.supabase.co:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-key

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-here

# Others (as needed)
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
```

### 5. Deploy Database Schema
After setting environment variables in Vercel:
```bash
# This will run automatically during Vercel build
npm run vercel:build

# Or manually push schema
npm run db:push
```

## 🔒 Security Configuration

### Row Level Security (RLS)
Supabase automatically enables RLS. Update policies in the Supabase dashboard:

1. **Users table**: Users can only see/edit their own data
2. **Profiles table**: Public read, owner write
3. **Messages table**: Only participants can access
4. **Emergency data**: Only user and support staff access

### API Security
```sql
-- Example RLS policy for users table
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid() = id);
```

## 📊 Monitoring Setup

### 1. Database Monitoring
- Monitor in Supabase Dashboard → Database → Logs
- Set up alerts for high CPU/memory usage
- Monitor connection count

### 2. API Monitoring
- Monitor API requests in Supabase Dashboard → API → Logs
- Set up rate limiting
- Monitor for unusual patterns

### 3. Backups
- Supabase automatically backs up daily
- Consider additional backups for critical data
- Test restore procedures

## 🚀 Production Checklist

### Database
- [ ] Schema deployed and tested
- [ ] RLS policies configured
- [ ] Indexes optimized for queries
- [ ] Backup strategy confirmed

### API
- [ ] All environment variables set
- [ ] Rate limiting configured
- [ ] CORS policies set
- [ ] API keys secured

### Monitoring
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Alert thresholds set
- [ ] Log retention configured

### Security
- [ ] SSL/TLS enabled (automatic)
- [ ] Database credentials secured
- [ ] API keys rotated regularly
- [ ] Security headers configured

## 🛠️ Useful Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Open database browser
npm run db:studio

# Reset database (CAUTION: deletes all data)
npm run db:reset

# Generate TypeScript types from Supabase
npm run supabase:types
```

## 🆘 Troubleshooting

### Connection Issues
- Check DATABASE_URL format
- Verify password doesn't contain special characters that need encoding
- Ensure Supabase project is running

### Build Issues
- Ensure `prisma generate` runs before build
- Check all environment variables are set
- Verify Prisma schema syntax

### Performance Issues
- Check query performance in Supabase logs
- Add database indexes for slow queries
- Monitor connection pool usage

---
*Ready for production deployment!* 🚀
