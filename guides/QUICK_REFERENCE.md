# 🎯 QUICK REFERENCE CHEATSHEET
## For When You Need a Quick Answer

---

## 🔥 MOST COMMON COMMANDS

### Starting the Project
```bash
# Terminal 1 - Backend
cd server
node server.cjs

# Terminal 2 - Frontend  
npm run dev
```

### Installing Packages
```bash
npm install                    # Install all dependencies
npm install package-name       # Install specific package
```

### Git (Save Your Work)
```bash
git status                     # See what changed
git add .                      # Stage all changes
git commit -m "Description"    # Save snapshot
git push                       # Upload to GitHub
```

---

## ⚛️ REACT CHEATSHEET

### Component Basics
```jsx
// Functional Component
function MyComponent() {
    return <div>Hello</div>;
}

// With Props
function Greeting({ name }) {
    return <h1>Hello {name}</h1>;
}

// Usage
<Greeting name="John" />
```

### State
```jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}
```

### useEffect (Run Code on Load)
```jsx
import { useEffect } from 'react';

function Profile() {
    useEffect(() => {
        // Runs when component loads
        fetchUserData();
    }, []); // Empty array = run once
    
    useEffect(() => {
        // Runs when userId changes
        fetchUserData(userId);
    }, [userId]); // Run when userId changes
}
```

### Conditional Rendering
```jsx
// If/Else
{isLoggedIn ? <Dashboard /> : <Login />}

// Show if true
{error && <div className="error">{error}</div>}

// Show if false
{!loading && <Content />}
```

### Lists
```jsx
const users = ['John', 'Jane', 'Bob'];

return (
    <ul>
        {users.map((user, index) => (
            <li key={index}>{user}</li>
        ))}
    </ul>
);
```

### Forms
```jsx
function Form() {
    const [email, setEmail] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();  // Important!
        console.log(email);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Submit</button>
        </form>
    );
}
```

---

## 🚀 EXPRESS CHEATSHEET

### Basic Server
```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());        // Parse JSON
app.use(cors());                // Allow cross-origin

// Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Works!' });
});

// Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
```

### Route Types
```javascript
// GET - Fetch data
app.get('/api/users', (req, res) => {
    res.json({ users: [] });
});

// POST - Create data
app.post('/api/users', (req, res) => {
    const data = req.body;
    res.status(201).json({ message: 'Created' });
});

// PUT - Update data
app.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    res.json({ message: 'Updated' });
});

// DELETE - Remove data
app.delete('/api/users/:id', (req, res) => {
    res.json({ message: 'Deleted' });
});
```

### URL Parameters
```javascript
// URL: /api/users/123
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;  // "123"
    res.json({ userId });
});

// Multiple parameters
// URL: /api/posts/5/comments/10
app.get('/api/posts/:postId/comments/:commentId', (req, res) => {
    const { postId, commentId } = req.params;
});
```

### Query Parameters
```javascript
// URL: /api/search?q=react&limit=10
app.get('/api/search', (req, res) => {
    const { q, limit } = req.query;
    // q = "react", limit = "10"
});
```

### Error Handling
```javascript
app.post('/api/register', async (req, res) => {
    try {
        // Your code
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
```

### Response Status Codes
```javascript
res.status(200).json({ ... })  // OK
res.status(201).json({ ... })  // Created
res.status(400).json({ ... })  // Bad Request
res.status(401).json({ ... })  // Unauthorized
res.status(404).json({ ... })  // Not Found
res.status(500).json({ ... })  // Server Error
```

---

## 🗄️ DATABASE (MySQL) CHEATSHEET

### Connection
```javascript
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database'
});
```

### Queries
```javascript
// SELECT
const [rows] = await db.query('SELECT * FROM users');

// SELECT with WHERE
const [users] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
);

// INSERT
const [result] = await db.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
);
const newId = result.insertId;

// UPDATE
await db.query(
    'UPDATE users SET name = ? WHERE id = ?',
    [newName, userId]
);

// DELETE
await db.query('DELETE FROM users WHERE id = ?', [userId]);
```

### Always Use ? Placeholders!
```javascript
// ❌ NEVER DO THIS (SQL Injection risk!)
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ ALWAYS DO THIS (Safe)
const [users] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
);
```

---

## 🌐 FETCH API CHEATSHEET

### GET Request
```javascript
const response = await fetch('http://localhost:5000/api/users');
const data = await response.json();
console.log(data);
```

### POST Request
```javascript
const response = await fetch('http://localhost:5000/api/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'John',
        email: 'john@example.com'
    })
});

const result = await response.json();
```

### With Error Handling
```javascript
try {
    const response = await fetch('http://localhost:5000/api/data');
    
    if (!response.ok) {
        throw new Error('Request failed');
    }
    
    const data = await response.json();
    console.log(data);
    
} catch (error) {
    console.error('Error:', error);
}
```

---

## 🔐 AUTHENTICATION PATTERNS

### Register User
```javascript
// Backend
const hashedPassword = await bcrypt.hash(password, 10);
await db.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword]
);
```

### Login User
```javascript
// Backend
const [users] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
);

const user = users[0];
const isValid = await bcrypt.compare(password, user.password);

if (isValid) {
    res.json({ 
        message: 'Success',
        user: { id: user.id, email: user.email }
    });
}
```

### Save User in Frontend
```javascript
// After successful login
localStorage.setItem('user', JSON.stringify(userData));

// Get user later
const user = JSON.parse(localStorage.getItem('user'));

// Logout
localStorage.removeItem('user');
```

### Protected Routes (Check if Logged In)
```javascript
// Frontend
const user = localStorage.getItem('user');
if (!user) {
    navigate('/login');
    return;
}

// Backend (with JWT tokens)
const token = req.headers.authorization;
if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
}
```

---

## 🎨 CSS IN REACT

### Import CSS
```jsx
// In component file
import './MyComponent.css';

function MyComponent() {
    return <div className="my-class">Hello</div>;
}
```

### Inline Styles
```jsx
const styles = {
    color: 'blue',
    fontSize: '20px',
    backgroundColor: 'lightgray'
};

<div style={styles}>Styled</div>

// Or directly
<div style={{ color: 'red', padding: '10px' }}>Red Text</div>
```

### Conditional Classes
```jsx
<div className={isActive ? 'active' : 'inactive'}>
    Content
</div>

// Multiple classes
<div className={`base-class ${isActive ? 'active' : ''}`}>
    Content
</div>
```

---

## 🐛 DEBUGGING CHEATSHEET

### Console Methods
```javascript
console.log('Regular message');
console.error('Error message');      // Red
console.warn('Warning message');     // Yellow
console.table([{name: 'John'}, {name: 'Jane'}]);  // Table format

// Grouping
console.group('API Call');
console.log('Request:', data);
console.log('Response:', result);
console.groupEnd();
```

### Debugging State
```javascript
// In React component
console.log('Current state:', { count, user, loading });

// Watch state changes
useEffect(() => {
    console.log('Count changed to:', count);
}, [count]);
```

### Network Debugging
1. Open DevTools (F12)
2. Go to Network tab
3. Submit form/make request
4. Click on request name
5. Check:
   - **Headers**: Request details
   - **Payload**: Data sent
   - **Response**: Data received
   - **Preview**: Formatted response

---

## 📁 PROJECT STRUCTURE

```
RESA/
├── src/                        # Frontend
│   ├── components/             # React components
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── css/                    # Styles
│   ├── App.jsx                 # Main app
│   └── main.jsx                # Entry point
│
├── server/                     # Backend
│   ├── server.cjs              # Express server
│   ├── db.cjs                  # Database connection
│   └── routes/                 # API routes
│
├── package.json                # Dependencies
├── .env                        # Environment variables
└── vite.config.js              # Build config
```

---

## 🔧 COMMON FIXES

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in server.cjs
const PORT = 5001;
```

### Cannot Connect to Database
```javascript
// Check credentials in db.cjs
host: 'localhost',
user: 'root',
password: 'your_password',  // Check this
database: 'your_database'   // Check this exists
```

### Module Not Found
```bash
npm install
# Or install specific package
npm install express mysql2 bcryptjs cors
```

### Changes Not Showing
- **Frontend**: Hard refresh (Ctrl + Shift + R)
- **Backend**: Restart server (Ctrl + C, then node server.cjs)

### CORS Error
```javascript
// Add in server.cjs
const cors = require('cors');
app.use(cors());
```

---

## 🎯 WHAT FILE TO EDIT?

| Want to...                    | Edit this file                |
|-------------------------------|-------------------------------|
| Change UI/design              | `src/css/*.css`               |
| Add/modify page               | `src/components/*.jsx`        |
| Add API endpoint              | `server/server.cjs`           |
| Change database structure     | `server/database.sql`         |
| Configure database connection | `server/db.cjs`               |
| Add route (URL)               | `src/App.jsx`                 |
| Change port                   | `server/server.cjs`           |
| Add dependencies              | Run `npm install package`     |

---

## 🚀 DEVELOPMENT WORKFLOW

```
1. Plan feature
   ↓
2. Update database (if needed)
   ↓
3. Create/update backend route
   ↓
4. Test route in browser/Postman
   ↓
5. Create/update React component
   ↓
6. Test in browser
   ↓
7. Fix errors (console, network tab)
   ↓
8. Style with CSS
   ↓
9. Commit to git
```

---

## 💡 QUICK TIPS

1. **Save often** (Ctrl + S)
2. **Check console** (F12) for errors
3. **Test small changes** before big ones
4. **Use console.log()** everywhere when debugging
5. **Read error messages** - they tell you what's wrong
6. **Google errors** with the exact message
7. **Restart backend** after changes
8. **Clear browser cache** if weird issues
9. **Use React DevTools** to inspect components
10. **Keep terminal open** to see errors

---

## 🆘 WHEN STUCK

1. Read the error message carefully
2. Check console (F12 → Console)
3. Check network tab (F12 → Network)
4. Add console.log() to track data flow
5. Check if server is running
6. Check if database is running
7. Google the exact error message
8. Check if file paths are correct
9. Check if you imported everything needed
10. Take a break and come back fresh

---

## 📚 LEARN MORE

- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com
- **MDN Web Docs**: https://developer.mozilla.org
- **Stack Overflow**: Search for specific errors
- **GitHub**: Look at other projects for examples

---

## 🎓 REMEMBER

- **You don't need to memorize** - use this cheatsheet!
- **Errors are normal** - everyone gets them
- **Google is your friend** - even experts use it
- **Practice makes perfect** - build stuff!
- **Ask specific questions** - get better answers

**You've got this! 🚀**
