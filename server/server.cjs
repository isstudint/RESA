/* eslint-env node */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./db.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// ===================================
// REGISTER NEW USER
// ===================================
app.post('/api/register', async (req, res) => {
  try {
    // Get data from form
    const { firstName, lastName, username, email, password } = req.body;

    // Check if all fields filled
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email or username' });
    }

    // Encrypt password (security!)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Save to database
    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, username, email, password]
    );

    // Send success
    res.status(201).json({ 
      message: 'User registered successfully',
      userId: result.insertId 
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// ===================================
// LOGIN USER
// ===================================
app.post('/api/login', async (req, res) => {
  try {
    // Get email and password
    const { email, password } = req.body;

    // Check if both provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user in database
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    // User not found?
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // DEBUG: See what's actually stored
    console.log('🔍 DEBUG - Login attempt:');
    console.log('Email:', email);
    console.log('Input password:', password);
    console.log('Input password length:', password.length);
    console.log('Stored password:', user.password);
    console.log('Stored password length:', user.password.length);
    console.log('Passwords match?', password === user.password);
    console.log('Password starts with $2a (bcrypt hash)?', user.password.startsWith('$2a'));

    // Check if password matches
    // const isValidPassword = await bcrypt.compare(password, user.password);
    const isValidPassword = password === user.password;

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Login success! Send user data
    res.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
