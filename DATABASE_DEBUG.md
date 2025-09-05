# 🔧 DATABASE CONNECTION TROUBLESHOOTING

## 🚨 Connection Issues

We're having trouble connecting to your Supabase database. This is common and easy to fix!

## 🔍 Get the Exact Connection String

### Method 1: From Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `avkfuvhroesfbqiwehiv` 
3. Go to **Settings** → **Database**
4. Scroll to **Connection string**
5. Select **Prisma** (not URI)
6. Copy the exact string

It should look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.avkfuvhroesfbqiwehiv.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

### Method 2: Direct Connection
Sometimes the pooler connection works better:
```
postgresql://postgres:[YOUR-PASSWORD]@db.avkfuvhroesfbqiwehiv.supabase.co:5432/postgres
```

## 🛠️ Common Fixes

### 1. URL Encode Special Characters
Your password `@Tife2018` contains `@` which needs encoding:
- `@` becomes `%40`
- So password becomes: `%40Tife2018`

### 2. Check Project Status
- Make sure your Supabase project is active (not paused)
- Check if there are any maintenance windows

### 3. Try Different Connection Formats

**Format A (Direct):**
```bash
DATABASE_URL="postgresql://postgres:%40Tife2018@db.avkfuvhroesfbqiwehiv.supabase.co:5432/postgres"
```

**Format B (Pooler):**
```bash
DATABASE_URL="postgresql://postgres:%40Tife2018@db.avkfuvhroesfbqiwehiv.supabase.co:6543/postgres?pgbouncer=true"
```

## 🎯 Next Steps

1. **Get the exact connection string** from Supabase Dashboard
2. **Verify project is active** (not paused due to inactivity)
3. **Try the connection string** I'll help you test it

### Quick Test Command:
```bash
DATABASE_URL="your-exact-connection-string-here" npx prisma db push
```

---
**Can you grab the exact connection string from your Supabase dashboard?** 🔍
