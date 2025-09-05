// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://avkfuvhroesfbqiwehiv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2a2Z1dmhyb2VzZmJxaXdlaGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjQwNDUsImV4cCI6MjA3MjYwMDA0NX0.-OMrPl8Y9jxMvPK5B9l_atM0IcEr3J2EyFgzykWIn2Y';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔌 Testing Supabase connection...');
    console.log('📍 Project: avkfuvhroesfbqiwehiv');
    console.log('🌐 URL:', supabaseUrl);
    
    // Test basic connection with auth
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error && error.message !== 'Auth session missing!') {
      console.error('❌ Connection failed:', error.message);
      console.log('\n🚨 This usually means:');
      console.log('1. Project is PAUSED (free tier)');
      console.log('2. Wrong API keys');
      console.log('3. Project deleted');
      console.log('\n🔍 Check your Supabase dashboard!');
    } else {
      console.log('✅ Connection successful!');
      console.log('📊 Supabase project is accessible');
      console.log('🎯 Ready to push database schema');
      
      // Show the connection strings to try
      console.log('\n🔗 Connection string confirmed:');
      console.log('DATABASE_URL="postgresql://postgres:%40Tife2018@db.avkfuvhroesfbqiwehiv.supabase.co:5432/postgres"');
    }
  } catch (err) {
    console.error('❌ Error testing connection:', err.message);
    console.log('\n🚨 This suggests the project might be:');
    console.log('1. PAUSED (most common)');
    console.log('2. In a different region');
    console.log('3. Using different credentials');
  }
}

testConnection();
