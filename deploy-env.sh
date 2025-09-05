#!/bin/bash

# Add all environment variables to Vercel
echo "Adding environment variables to Vercel..."

# Database URL
echo "postgresql://postgres.avkfuvhroesfbqiwehiv:%40Tife2018@aws-0-eu-west-1.pooler.supabase.com:6543/postgres" | vercel env add DATABASE_URL production

# Supabase URLs
echo "https://avkfuvhroesfbqiwehiv.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Supabase Anon Key
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2a2Z1dmhyb2VzZmJxaXdlaGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzNDczNDIsImV4cCI6MjA1MzkyMzM0Mn0.s1p6tM1sM7X9YkEcxVGOlXNbq5I3bZHOqnAbMkWJBwo" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Supabase Service Role
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2a2Z1dmhyb2VzZmJxaXdlaGl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODM0NzM0MiwiZXhwIjoyMDUzOTIzMzQyfQ.OUAj7IH_d7u_hTSV86iOqTDhRkVyxQdKdPVYzDdvMDg" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

# NextAuth Secret
echo "$(openssl rand -base64 32)" | vercel env add NEXTAUTH_SECRET production

# NextAuth URL
echo "https://proximeet.vercel.app" | vercel env add NEXTAUTH_URL production

echo "Environment variables added successfully!"
