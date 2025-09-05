#!/bin/bash

# 🚀 ProxiMeet Database Quick Setup Script

echo "🔧 ProxiMeet Database Setup"
echo "=========================="
echo ""

# Check if we can connect to the current Supabase project
echo "🔍 Checking current Supabase project..."
if curl -s --max-time 5 https://avkfuvhroesfbqiwehiv.supabase.co > /dev/null 2>&1; then
    echo "✅ Supabase project is accessible"
    HAS_SUPABASE=true
else
    echo "❌ Current Supabase project is not accessible (404 error)"
    echo "   This usually means the project is paused or deleted"
    HAS_SUPABASE=false
fi

echo ""
echo "Choose your setup option:"
echo "1) 🆕 Create new Supabase project (Recommended)"
echo "2) 💻 Use local PostgreSQL database"
echo "3) 🔄 Try to fix current Supabase connection"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🆕 CREATING NEW SUPABASE PROJECT"
        echo "================================"
        echo ""
        echo "1. Go to https://supabase.com/dashboard"
        echo "2. Click 'New Project'"
        echo "3. Choose organization and project name: 'proximeet'"
        echo "4. Set a strong database password (remember it!)"
        echo "5. Choose a region (pick closest to you)"
        echo "6. Wait for project to be created (~2 minutes)"
        echo ""
        echo "After project is created:"
        echo "7. Go to Settings → Database"
        echo "8. Copy the connection string"
        echo "9. Go to Settings → API"
        echo "10. Copy Project URL and anon key"
        echo ""
        echo "Then run: ./setup-env.sh and paste your new credentials"
        ;;
    
    2)
        echo ""
        echo "💻 LOCAL POSTGRESQL SETUP"
        echo "========================="
        echo ""
        echo "Installing PostgreSQL locally..."
        
        # Check if PostgreSQL is installed
        if command -v psql > /dev/null 2>&1; then
            echo "✅ PostgreSQL is already installed"
        else
            echo "📦 Installing PostgreSQL..."
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                if command -v brew > /dev/null 2>&1; then
                    brew install postgresql
                    brew services start postgresql
                else
                    echo "❌ Homebrew not found. Please install from: https://brew.sh"
                    exit 1
                fi
            else
                echo "❌ Please install PostgreSQL manually for your system"
                exit 1
            fi
        fi
        
        # Create local database
        echo "🗄️ Creating local database..."
        createdb proximeet_dev 2>/dev/null || echo "Database might already exist"
        
        # Update .env.local with local database URL
        echo "📝 Updating .env.local..."
        sed -i '' 's|DATABASE_URL=.*|DATABASE_URL="postgresql://localhost:5432/proximeet_dev"|' .env.local
        
        echo "✅ Local database setup complete!"
        echo ""
        echo "🚀 Running database migrations..."
        npx prisma db push
        
        if [ $? -eq 0 ]; then
            echo "✅ Database setup successful!"
            echo ""
            echo "🎉 You can now run: npm run dev"
        else
            echo "❌ Database setup failed. Check the errors above."
        fi
        ;;
    
    3)
        echo ""
        echo "🔄 FIXING CURRENT SUPABASE CONNECTION"
        echo "====================================="
        echo ""
        echo "The current project (avkfuvhroesfbqiwehiv) is not accessible."
        echo "This usually means:"
        echo "• Project has been paused due to inactivity"
        echo "• Project has been deleted"
        echo "• Wrong credentials"
        echo ""
        echo "To fix this:"
        echo "1. Go to https://supabase.com/dashboard"
        echo "2. Find your project 'avkfuvhroesfbqiwehiv'"
        echo "3. If it's paused, click 'Resume' or 'Restore'"
        echo "4. If it doesn't exist, create a new one (option 1)"
        echo ""
        echo "After fixing, try running:"
        echo "npx prisma db push"
        ;;
    
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 Need help? Check DATABASE_SETUP.md for detailed instructions"
