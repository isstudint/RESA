/* eslint-env node */
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing MySQL Connection...\n');
  
  try {
    // Test connection to MySQL server
    console.log('📌 Attempting to connect to MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('✅ Connected to MySQL server successfully!\n');
    
    // Check if database exists
    console.log('📌 Checking if database exists...');
    const dbName = process.env.DB_NAME || 'resa_db';
    const [databases] = await connection.query(
      'SHOW DATABASES LIKE ?',
      [dbName]
    );
    
    if (databases.length === 0) {
      console.log(`❌ Database "${dbName}" does NOT exist!`);
      console.log('\n💡 Solution: Run the database.sql file in phpMyAdmin:');
      console.log('   1. Go to http://localhost/phpmyadmin');
      console.log('   2. Click "SQL" tab');
      console.log('   3. Copy contents from server/database.sql');
      console.log('   4. Click "Go"\n');
      await connection.end();
      return;
    }
    
    console.log(`✅ Database "${dbName}" exists!\n`);
    
    // Connect to the database
    await connection.changeUser({ database: dbName });
    
    // Check if users table exists
    console.log('📌 Checking if users table exists...');
    const [tables] = await connection.query(
      'SHOW TABLES LIKE "users"'
    );
    
    if (tables.length === 0) {
      console.log('❌ Users table does NOT exist!');
      console.log('\n💡 Solution: Run the database.sql file in phpMyAdmin\n');
      await connection.end();
      return;
    }
    
    console.log('✅ Users table exists!\n');
    
    // Show table structure
    console.log('📋 Users table structure:');
    const [columns] = await connection.query('DESCRIBE users');
    console.table(columns.map(col => ({
      Field: col.Field,
      Type: col.Type,
      Null: col.Null,
      Key: col.Key
    })));
    
    // Count existing users
    const [countResult] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`\n👥 Total users in database: ${countResult[0].count}\n`);
    
    await connection.end();
    console.log('✅ All database tests passed! You\'re ready to go! 🚀\n');
    
  } catch (error) {
    console.error('\n❌ Connection Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution: Make sure MySQL is running in XAMPP!');
      console.log('   - Open XAMPP Control Panel');
      console.log('   - Click "Start" next to MySQL\n');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Solution: Check your database credentials in .env file');
      console.log('   DB_USER should be "root"');
      console.log('   DB_PASSWORD should be empty (or your password)\n');
    } else {
      console.log('\n💡 Check your .env file configuration\n');
    }
  }
}

testConnection();
