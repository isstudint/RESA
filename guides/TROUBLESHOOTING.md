# 🔧 TROUBLESHOOTING GUIDE
## When Things Don't Work (They Will!)

Every developer faces errors. The difference between a beginner and an expert is knowing how to debug. This guide teaches you **HOW TO THINK** when debugging.

---

## 🎯 THE DEBUGGING MINDSET

### Rule #1: DON'T PANIC
Errors are NORMAL. You'll see thousands. Each one teaches you something.

### Rule #2: READ THE ERROR MESSAGE
The computer is telling you EXACTLY what's wrong. Read it carefully.

### Rule #3: DIVIDE AND CONQUER
If something doesn't work, break it into smaller parts and test each one.

### Rule #4: GOOGLE IS YOUR FRIEND
Copy the error message, Google it. Someone else had this problem.

---

## 🚨 COMMON ERRORS & SOLUTIONS

### ❌ ERROR: "Cannot find module 'express'"

**What it means:**
- You're trying to use a package that isn't installed

**Where you see it:**
- Terminal when running `node server.cjs`

**Why it happens:**
- You didn't run `npm install`
- You deleted `node_modules` folder
- Wrong directory

**How to fix:**
```bash
# Make sure you're in the project root
cd c:\Users\Marvelous Gonzales\Documents\COLLEGE CODE\RESA

# Install all dependencies
npm install

# If that doesn't work, install specifically
npm install express cors bcryptjs mysql2
```

**How to prevent:**
- Always run `npm install` when you clone/download a project
- Don't delete `node_modules` folder

---

### ❌ ERROR: "Port 5000 already in use"

**What it means:**
- Something else is already using port 5000
- Maybe you started the server twice

**Where you see it:**
- Terminal when starting backend

**Why it happens:**
- Previous server didn't shut down properly
- Another program using port 5000

**How to fix:**

**Option 1: Kill the process (Windows)**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# You'll see something like:
#   TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345
#                                                      ↑ This is PID

# Kill it
taskkill /PID 12345 /F
```

**Option 2: Use different port**
```javascript
// In server.cjs, change:
const PORT = 5001;  // Use 5001 instead
```

**How to prevent:**
- Always stop server with Ctrl+C (not just closing terminal)
- Check if server is already running before starting again

---

### ❌ ERROR: "Cannot connect to server"

**What you see:**
- Frontend shows: "Cannot connect to server. Make sure backend is running."

**What it means:**
- Backend isn't running
- Backend crashed
- Wrong URL

**How to debug:**

**Step 1: Is backend running?**
```bash
# Check terminal - should see:
Server running on http://localhost:5000
```

If not, start it:
```bash
cd server
node server.cjs
```

**Step 2: Test backend directly**
Open browser: `http://localhost:5000/api/test`

Should see: `{"message":"Backend is working!"}`

If not, backend has an error. Check terminal for error message.

**Step 3: Check URL in frontend**
```javascript
// In Register.jsx, make sure it's:
fetch(`http://localhost:5000${url}`, {
  // Not https://
  // Not a different port
  // Not a different domain
```

---

### ❌ ERROR: "CORS Policy Error"

**What you see:**
- Browser console: "Access to fetch at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS policy"

**What it means:**
- Backend isn't allowing frontend to talk to it
- Security feature of browsers

**How to fix:**
```javascript
// In server.cjs, make sure you have:
const cors = require('cors');
app.use(cors());

// Should be BEFORE your routes
```

If already there:
```bash
# Reinstall cors
npm install cors

# Restart server
```

---

### ❌ ERROR: "Cannot connect to database"

**What you see:**
- Terminal: "Error: connect ECONNREFUSED"
- Or: "Access denied for user"

**What it means:**
- MySQL isn't running
- Wrong credentials
- Database doesn't exist

**How to fix:**

**Step 1: Is MySQL running?**
```bash
# Try to connect
mysql -u root -p

# If it doesn't work, start MySQL service:
# Windows: Open Services app → Find MySQL → Start
```

**Step 2: Check credentials**
```javascript
// In server/db.cjs
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',           // ← Check this
    password: 'your_pass',  // ← Check this
    database: 'your_db'     // ← Check this exists
});
```

**Step 3: Create database if missing**
```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE your_db;

-- Run your schema
USE your_db;
source server/database.sql;
```

---

### ❌ ERROR: "User already exists"

**What you see:**
- Frontend shows: "User already exists with this email or username"

**What it means:**
- You already registered with that email/username
- This is EXPECTED behavior (not a bug!)

**How to fix:**
- Use a different email
- Or delete the existing user from database

**To delete user:**
```sql
-- Connect to MySQL
mysql -u root -p

-- Use your database
USE your_database_name;

-- See all users
SELECT * FROM users;

-- Delete specific user
DELETE FROM users WHERE email = 'john@example.com';

-- Or delete all users (start fresh)
TRUNCATE TABLE users;
```

---

### ❌ ERROR: "Cannot read property 'map' of undefined"

**What you see:**
- Browser console: "TypeError: Cannot read property 'map' of undefined"
- Page might be blank

**What it means:**
- You're trying to map over something that doesn't exist yet
- Usually happens with API data that hasn't loaded

**Example of the problem:**
```jsx
function UserList() {
    const [users, setUsers] = useState();  // ← undefined!
    
    return (
        <ul>
            {users.map(user => (  // ← Error! users is undefined
                <li>{user.name}</li>
            ))}
        </ul>
    );
}
```

**How to fix:**
```jsx
function UserList() {
    const [users, setUsers] = useState([]);  // ← Empty array
    
    // Or check if exists:
    return (
        <ul>
            {users && users.map(user => (  // ← Check first
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}
```

---

### ❌ ERROR: "Each child in a list should have a unique key prop"

**What you see:**
- Browser console warning (yellow)

**What it means:**
- You're mapping without adding `key` prop
- React needs keys to track which items changed

**Example of the problem:**
```jsx
{users.map(user => (
    <li>{user.name}</li>  // ← Missing key
))}
```

**How to fix:**
```jsx
{users.map(user => (
    <li key={user.id}>{user.name}</li>  // ← Add key
))}

// If no ID, can use index (not ideal but works):
{users.map((user, index) => (
    <li key={index}>{user.name}</li>
))}
```

---

### ❌ ERROR: Changes not showing up

**What you see:**
- You changed code but nothing changed in browser

**Possible causes:**

**1. Forgot to save file**
- Check if file has a dot (•) in tab (unsaved)
- Press Ctrl+S

**2. Wrong file edited**
- Make sure you're editing the right file
- Check file path in tab

**3. Frontend not reloading**
- Check terminal - should see "page reloaded"
- Hard refresh: Ctrl+Shift+R

**4. Backend not restarted**
- Backend doesn't auto-reload
- Stop (Ctrl+C) and restart: `node server.cjs`

**5. Browser cache**
- Clear cache: Ctrl+Shift+Delete
- Or use Incognito mode

**6. Edited wrong environment**
- Make sure dev server is running (npm run dev)
- Not looking at old build

---

### ❌ ERROR: "SyntaxError: Unexpected token '<'"

**What you see:**
- Browser console shows this when fetching

**What it means:**
- Backend sent HTML instead of JSON
- Usually means backend route doesn't exist

**How to debug:**

**Step 1: Check the URL**
```javascript
// In your fetch call:
fetch(`http://localhost:5000/api/register`, {  // ← Check this
```

**Step 2: Check backend has this route**
```javascript
// In server.cjs:
app.post('/api/register', ...)  // ← Must match exactly
```

**Step 3: Check response in Network tab**
- F12 → Network tab
- Click on the request
- Check "Response" tab
- If you see HTML, backend sent error page

---

### ❌ ERROR: Password not working (Login fails)

**What you see:**
- "Invalid email or password" even though you KNOW it's correct

**What it means:**
- Password was hashed differently
- Database has old unhashed password
- bcrypt not comparing correctly

**How to debug:**

**Step 1: Check password in database**
```sql
SELECT password FROM users WHERE email = 'your@email.com';
```

Should look like: `$2a$10$N9qo8uLOickgx2ZMRZoMye...`

If it's plain text like "password123", it's not hashed!

**Step 2: Re-register the user**
- Delete user from database
- Register again (will hash properly)

**Step 3: Check bcrypt code**
```javascript
// Registration should have:
const hashedPassword = await bcrypt.hash(password, 10);

// Login should have:
const isValid = await bcrypt.compare(password, user.password);
```

---

### ❌ ERROR: "Cannot use import statement outside a module"

**What you see:**
- Terminal error when running backend

**What it means:**
- You used ES6 imports in Node.js without proper config

**Example:**
```javascript
// ❌ This doesn't work in regular .js files:
import express from 'express';

// ✅ Use this instead:
const express = require('express');
```

**How to fix:**

**Option 1: Use require (recommended for your project)**
```javascript
const express = require('express');
const cors = require('cors');
```

**Option 2: Add "type": "module" to package.json**
```json
{
  "type": "module",
  "dependencies": ...
}
```

---

## 🔍 DEBUGGING TECHNIQUES

### Technique 1: console.log() Everything

**Basic logging:**
```javascript
console.log('I am here!');  // Check if code runs
console.log('Variable value:', myVariable);  // Check value
console.log('User data:', user);  // Check objects
```

**Advanced logging:**
```javascript
// See where you are in code
console.log('🎯 Starting function');
console.log('📥 Received data:', data);
console.log('✅ Validation passed');
console.log('💾 Saving to database');
console.log('🎉 All done!');

// Use emojis to quickly spot your logs
```

**Log before and after:**
```javascript
console.log('Before fetch:', formData);
const response = await fetch(url, { body: formData });
console.log('After fetch:', response);
```

**Log in catch blocks:**
```javascript
try {
    // Your code
} catch (error) {
    console.error('❌ ERROR:', error);
    console.error('Error message:', error.message);
    console.error('Full error:', error.stack);
}
```

---

### Technique 2: Browser DevTools

**Console tab:**
- See all console.log() output
- See all errors (red)
- Run JavaScript directly

**Network tab:**
- See all fetch requests
- Click request → Check:
  - **Headers**: Request details
  - **Payload**: Data you sent
  - **Response**: Data you received
  - **Preview**: Formatted response

**Elements tab:**
- Inspect HTML/CSS
- See computed styles
- Change styles live

**Sources tab:**
- Set breakpoints (click line number)
- Code will pause there
- Hover over variables to see values
- Step through code line by line

---

### Technique 3: Test in Isolation

**Problem:** Login doesn't work

**Don't:** Stare at all the code trying to find the issue

**Do:** Test each part separately

**Step 1: Test backend alone**
```bash
# Use browser to test
http://localhost:5000/api/test

# Should see: {"message":"Backend is working!"}
```

**Step 2: Test database alone**
```javascript
// Create test-connection.js
const db = require('./db.cjs');

async function test() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log('✅ Database works!', rows);
    } catch (error) {
        console.error('❌ Database error:', error);
    }
}

test();
```

**Step 3: Test fetch alone**
```javascript
// In browser console:
fetch('http://localhost:5000/api/test')
    .then(r => r.json())
    .then(d => console.log('✅ Works!', d))
    .catch(e => console.error('❌ Error:', e));
```

---

### Technique 4: Rubber Duck Debugging

**What it is:**
Explain your code out loud (to a rubber duck, or yourself)

**Why it works:**
You often realize the problem while explaining

**Example:**
```
"Okay, so when the user clicks submit...
The handleSubmit function runs...
It gets the form data...
Then it calls fetch with... wait...
I'm sending to /api/login but the route is /api/user-login!
That's the bug!"
```

---

### Technique 5: Git Bisect (When did it break?)

**Problem:** Code worked yesterday, doesn't work today

**Solution:** Use git to find when it broke

```bash
# See your commits
git log --oneline

# Test an old version
git checkout <commit-hash>

# Test if it works

# If works, the bug is in a newer commit
# If doesn't work, bug is in an older commit

# Go back to latest
git checkout main
```

---

## 🎓 DEBUGGING WORKFLOW

When something doesn't work:

```
1. READ THE ERROR MESSAGE
   ↓
   What does it say?
   Where does it say the error is?
   
2. LOCATE THE PROBLEM
   ↓
   Frontend? (Browser console)
   Backend? (Terminal)
   Database? (MySQL)
   Network? (Network tab)
   
3. REPRODUCE THE PROBLEM
   ↓
   Can you make it happen again?
   What steps cause it?
   
4. ISOLATE THE PROBLEM
   ↓
   Remove parts until it works
   Or add parts until it breaks
   
5. FORM A HYPOTHESIS
   ↓
   "I think the problem is..."
   
6. TEST YOUR HYPOTHESIS
   ↓
   Add console.log()
   Check values
   Try a fix
   
7. IF FIXED: GREAT!
   IF NOT: BACK TO STEP 5
   
8. UNDERSTAND WHY
   ↓
   Don't just fix it
   Understand WHY it broke
   So you can prevent it next time
```

---

## 🆘 WHEN YOU'RE REALLY STUCK

### 1. Take a Break
- Seriously. Walk away for 10 minutes.
- Fresh eyes often see the problem immediately.

### 2. Google the Error
```
Copy exact error message
Add: "react" or "express" or "node"
Read Stack Overflow answers
```

### 3. Ask for Help (Properly)

**❌ Bad question:**
"My code doesn't work help"

**✅ Good question:**
```
I'm trying to register a user in Express.

Expected: User is saved to database
Actual: Getting error "Cannot insert null value"

Code:
[paste relevant code]

Error message:
[paste full error]

What I've tried:
- Checked database connection (works)
- Checked if fields are filled (they are)
- Added console.log (shows data is undefined)
```

### 4. Read Documentation
- React: https://react.dev
- Express: https://expressjs.com
- MySQL: https://dev.mysql.com/doc/

### 5. Check Examples
- Look at working examples
- Compare with your code
- What's different?

---

## 🎯 PREVENTION IS BETTER THAN CURE

### Write Defensive Code

**Check before using:**
```javascript
// ❌ Will crash if user is null
const name = user.name;

// ✅ Safe
const name = user ? user.name : 'Guest';

// ✅ Even safer
const name = user?.name ?? 'Guest';
```

**Validate inputs:**
```javascript
if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
}

if (password.length < 8) {
    return res.status(400).json({ error: 'Password too short' });
}
```

**Use try/catch:**
```javascript
try {
    // Risky code
    const data = await fetch(url);
} catch (error) {
    // Handle error gracefully
    console.error(error);
    setError('Something went wrong');
}
```

---

### Write Clear Code

**Use meaningful names:**
```javascript
// ❌ Unclear
const d = new Date();
const x = users.filter(u => u.a);

// ✅ Clear
const currentDate = new Date();
const activeUsers = users.filter(user => user.isActive);
```

**Add comments:**
```javascript
// ❌ No context
setLoading(true);
fetch(url);
setLoading(false);

// ✅ Explains why
// Show loading spinner while fetching
setLoading(true);
const response = await fetch(url);
// Hide loading spinner after response
setLoading(false);
```

---

### Test Frequently

**Don't write 100 lines then test**
```
Write 5 lines → Test
Write 5 more → Test
Write 5 more → Test
```

**Why?**
- Easier to find bugs
- Know exactly what broke
- Less overwhelming

---

## 🏆 REMEMBER

1. **Errors are learning opportunities**
   - Every error teaches you something
   - Experts just remember solutions from past errors

2. **You're not stupid if you get errors**
   - Professional developers get errors ALL DAY
   - They just know how to debug

3. **Debugging is a skill**
   - Gets better with practice
   - Use systematic approach
   - Don't randomly change things

4. **Ask for help**
   - But try to debug first
   - Asking good questions = learning
   - Include context, error, what you tried

5. **Stay calm**
   - Frustration makes it worse
   - Take breaks
   - Come back fresh

---

## 🎓 FINAL TIP

**Keep a debugging journal:**

```
Date: Oct 16, 2025
Error: Port 5000 already in use
Solution: taskkill /PID <pid> /F
Lesson: Always stop server with Ctrl+C

Date: Oct 16, 2025
Error: Cannot read property 'map' of undefined
Solution: Initialize state as empty array
Lesson: Always initialize array states as []
```

Why? Next time you see the same error, you'll know the solution instantly!

---

**You've got this! 🚀**

Debugging is frustrating but rewarding. Every bug you fix makes you a better developer. Keep going!
