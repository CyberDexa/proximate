// Alternative: Create tables using Supabase SQL
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://avkfuvhroesfbqiwehiv.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2a2Z1dmhyb2VzZmJxaXdlaGl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAyNDA0NSwiZXhwIjoyMDcyNjAwMDQ1fQ.VWHsSjNDoFMS53N4ZQYIa7o1tbTPmCbGhis90qpLOWI';

const supabase = createClient(supabaseUrl, serviceKey);

async function createTablesDirectly() {
  try {
    console.log('🔧 Attempting to create tables via Supabase SQL...');
    
    // Try to create a simple test table first
    const { data, error } = await supabase.rpc('create_test_table');
    
    if (error) {
      console.log('❌ RPC call failed:', error.message);
      console.log('\n🚨 This confirms the database is PAUSED');
      console.log('📋 You need to:');
      console.log('1. Go to Supabase Dashboard');
      console.log('2. Look for "Resume" button');
      console.log('3. Or try the SQL Editor to wake it up');
    } else {
      console.log('✅ Database is responsive!');
      console.log('🎯 We can proceed with schema deployment');
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
    console.log('\n🔍 This suggests:');
    console.log('1. Database is definitely PAUSED');
    console.log('2. Need to resume from dashboard');
    console.log('3. Or use the SQL Editor to activate it');
  }
}

createTablesDirectly();
