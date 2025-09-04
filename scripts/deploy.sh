#!/bin/bash

# 🚀 ProxiMeet Deployment Script for Vercel + Supabase

echo "🚀 Starting ProxiMeet deployment setup..."

# Check if environment variables are set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set. Please configure Supabase connection string."
  exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ NEXT_PUBLIC_SUPABASE_URL not set. Please configure Supabase project URL."
  exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Please configure Supabase anon key."
  exit 1
fi

echo "✅ Environment variables configured"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push database schema to Supabase
echo "🗄️ Pushing database schema to Supabase..."
npx prisma db push

# Build the application
echo "🏗️ Building Next.js application..."
npm run build

echo "🎉 Deployment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy to Vercel"
echo "2. Configure custom domain"
echo "3. Set up monitoring"
echo "4. Test all features"
echo ""
echo "🔗 Useful commands:"
echo "• View database: npx prisma studio"
echo "• Reset database: npx prisma db push --force-reset"
echo "• Generate types: npx supabase gen types typescript"
