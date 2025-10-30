# RESA Backend Setup Guide

## 🎯 Quick Setup Steps

### 1. Start XAMPP
- Open XAMPP Control Panel
- Start **Apache** and **MySQL**

### 2. Create Database
- Open phpMyAdmin: http://localhost/phpmyadmin
- Click "SQL" tab
- Copy and paste contents from `server/database.sql`
- Click "Go" to create the database and table

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Application

**Option A: Run separately (recommended for testing)**
```bash
# Terminal 1 - Start Backend
npm run server

# Terminal 2 - Start Frontend
npm run dev
```

**Option B: Access directly**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 What Was Created

```
RESA/
├── .env                     # Database credentials (don't commit!)
├── server/
│   ├── server.js           # Express backend server
│   ├── db.js               # MySQL connection
│   └── database.sql        # Database schema
└── src/
    └── components/
        └── Register.jsx    # Updated with API calls
```

## 🔐 Security Features
- ✅ Password hashing with bcrypt
- ✅ Environment variables for sensitive data
- ✅ SQL injection protection (prepared statements)
- ✅ Input validation

## 🧪 Testing the Backend

1. **Test if backend is running:**
   - Visit: http://localhost:5000/api/test
   - Should see: `{"message": "Backend is working!"}`

2. **Test registration:**
   - Go to: http://localhost:5173/login
   - Fill the Sign Up form
   - Submit and check console/network tab

## 🛠️ Troubleshooting

**"Cannot connect to server"**
- Make sure backend is running (`npm run server`)
- Check if port 5000 is available

**Database connection error**
- Verify XAMPP MySQL is running
- Check .env file has correct credentials
- Ensure database `resa_db` exists

**"User already exists"**
- Email or username is already registered
- Try different credentials

## 📝 API Endpoints

- `POST /api/register` - Create new user
- `POST /api/login` - Authenticate user
- `GET /api/test` - Health check

## 🔄 Next Steps

To add more features:
1. Add JWT tokens for session management
2. Create protected routes
3. Add password reset functionality
4. Build user dashboard
