/* eslint-env node */
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("./db.cjs");

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "unit-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// ===================================
// REGISTER NEW USER
// ===================================
app.post("/api/register", async (req, res) => {
  try {
    // Get data from form
    const { firstName, lastName, username, email, contactNumber, password } =
      req.body;

    // Check if all fields filled
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ error: "User already exists with this email or username" });
    }

    // Encrypt password (security!)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Save to database
    const [result] = await db.query(
      "INSERT INTO users (first_name, last_name, username, email, contact_number, password) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, username, email, contactNumber || null, password]
    );

    // Send success
    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// ===================================
// LOGIN USER
// ===================================
app.post("/api/login", async (req, res) => {
  try {
    // Get email and password
    const { email, password } = req.body;

    console.log("Login attempt - Email:", email, "Password:", password);

    // Check if both provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check for hardcoded admin login FIRST
    if (email === "admin@123" && password === "admin123") {
      console.log("Admin login successful!");
      return res.json({
        message: "Login successful",
        user: {
          id: 0,
          firstName: "Admin",
          lastName: "User",
          username: "admin",
          email: "admin@123",
          role: "admin",
        },
      });
    }

    // Find user in database
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // User not found?
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // DEBUG: See what's actually stored
    /*console.log('🔍 DEBUG - Login attempt:');
    console.log('Email:', email);
    console.log('Input password:', password);
    console.log('Input password length:', password.length);
    console.log('Stored password:', user.password);
    console.log('Stored password length:', user.password.length);
    console.log('Passwords match?', password === user.password);
    console.log('Password starts with $2a (bcrypt hash)?', user.password.startsWith('$2a'));*/

    // Check if password matches
    // const isValidPassword = await bcrypt.compare(password, user.password);
    const isValidPassword = password === user.password;

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Login success! Send user data
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        email: user.email,
        contactNumber: user.contact_number,
        role: "tenant",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ===================================
// CHANGE PASSWORD
// ===================================
app.post("/api/change-password", async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Get user from database
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];

    // Verify current password
    if (currentPassword !== user.password) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Update password
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      newPassword,
      userId,
    ]);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Server error during password change" });
  }
});

// ===================================
// UNITS MANAGEMENT
// ===================================

// Get all units
app.get("/api/units", async (req, res) => {
  try {
    const [units] = await db.query("SELECT * FROM units");
    res.json(units);
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ error: "Failed to fetch units" });
  }
});

// Update unit details
app.put("/api/units/:id", async (req, res) => {
  try {
    const { name, size, price, images, status } = req.body;
    const { id } = req.params;

    // Dynamic update query
    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }
    if (size) {
      fields.push("size = ?");
      values.push(size);
    }
    if (price) {
      fields.push("price = ?");
      values.push(price);
    }
    if (images) {
      fields.push("images = ?");
      values.push(JSON.stringify(images));
    }
    if (status) {
      fields.push("status = ?");
      values.push(status);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id);

    const query = `UPDATE units SET ${fields.join(", ")} WHERE id = ?`;

    await db.query(query, values);
    res.json({ message: "Unit updated successfully" });
  } catch (error) {
    console.error("Error updating unit:", error);
    res.status(500).json({ error: "Failed to update unit" });
  }
});

// Upload images for units
app.post("/api/units/upload-images", (req, res) => {
  upload.array("images", 10)(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File too large. Maximum size is 50MB per file." });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res
          .status(400)
          .json({ error: "Too many files. Maximum is 10 files." });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Other errors
      return res.status(500).json({ error: err.message });
    }

    // Success - no errors
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
      res.json({ images: imagePaths });
    } catch (error) {
      console.error("Error processing images:", error);
      res.status(500).json({ error: "Failed to process images" });
    }
  });
});

// ===================================
// BOOKINGS MANAGEMENT
// ===================================

// Get all bookings with user and unit details
app.get("/api/bookings", async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, u.name as unit_name, us.first_name, us.last_name, us.email 
      FROM bookings b
      JOIN units u ON b.unit_id = u.id
      JOIN users us ON b.user_id = us.id
      ORDER BY b.created_at DESC
    `);
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Update booking status
app.put("/api/bookings/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await db.query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Booking status updated" });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

// ===================================
// ADMIN DASHBOARD STATS
// ===================================
app.get("/api/admin/stats", async (req, res) => {
  try {
    const [userCount] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE username != "admin"'
    );
    const [unitCount] = await db.query("SELECT COUNT(*) as count FROM units");
    const [availableCount] = await db.query(
      'SELECT COUNT(*) as count FROM units WHERE status = "Available"'
    );
    const [bookingCount] = await db.query(
      'SELECT COUNT(*) as count FROM bookings WHERE status = "Pending"'
    );

    res.json({
      totalUsers: userCount[0].count,
      totalUnits: unitCount[0].count,
      availableUnits: availableCount[0].count,
      pendingBookings: bookingCount[0].count,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ===================================
// ADMIN USER MANAGEMENT
// ===================================
app.post("/api/admin/users", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, role } = req.body;

    // Check if user exists
    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Insert user
    await db.query(
      "INSERT INTO users (first_name, last_name, username, email, password, user_type) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, username, email, password, role || "user"]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// ===================================
// USER DASHBOARD ENDPOINTS
// ===================================

// Get user's bookings
app.get("/api/user/bookings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [bookings] = await db.query(
      `
      SELECT b.*, u.name as unit_name, u.price, u.size
      FROM bookings b
      JOIN units u ON b.unit_id = u.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `,
      [userId]
    );
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Get user stats
app.get("/api/user/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get owned unit (approved booking)
    const [ownedUnit] = await db.query(
      `
      SELECT u.name, u.id
      FROM bookings b
      JOIN units u ON b.unit_id = u.id
      WHERE b.user_id = ? AND b.status = 'Approved'
      LIMIT 1
    `,
      [userId]
    );

    // Get pending bookings count
    const [pendingBookings] = await db.query(
      `
      SELECT COUNT(*) as count
      FROM bookings
      WHERE user_id = ? AND status = 'Pending'
    `,
      [userId]
    );

    res.json({
      ownedUnit: ownedUnit.length > 0 ? ownedUnit[0].name : "No unit owned",
      activeUnit: ownedUnit.length > 0 ? ownedUnit[0].name : "No active unit",
      pendingPayment: pendingBookings[0].count || 0,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Create booking
app.post("/api/user/bookings", async (req, res) => {
  try {
    const {
      userId,
      unitId,
      bookingDate,
      meetingDate,
      meetingTime,
      facebookLink,
      contactNumber,
    } = req.body;

    await db.query(
      "INSERT INTO bookings (user_id, unit_id, booking_date, meeting_date, meeting_time, facebook_link, contact_number) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        unitId,
        bookingDate,
        meetingDate,
        meetingTime || null,
        facebookLink || null,
        contactNumber || null,
      ]
    );

    res.status(201).json({ message: "Booking created successfully" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// ===================================
// BOOKING MESSAGING
// ===================================

// Send message for a booking
app.post("/api/bookings/:id/message", async (req, res) => {
  try {
    const { id } = req.params;
    const { senderType, message } = req.body;

    if (!message || !senderType) {
      return res
        .status(400)
        .json({ error: "Message and sender type are required" });
    }

    await db.query(
      "INSERT INTO booking_messages (booking_id, sender_type, message) VALUES (?, ?, ?)",
      [id, senderType, message]
    );

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Get messages for a booking
app.get("/api/bookings/:id/messages", async (req, res) => {
  try {
    const { id } = req.params;
    const [messages] = await db.query(
      "SELECT * FROM booking_messages WHERE booking_id = ? ORDER BY created_at ASC",
      [id]
    );
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ===================================
// BOOKING RESCHEDULING
// ===================================

// Reschedule a booking
app.put("/api/bookings/:id/reschedule", async (req, res) => {
  try {
    const { id } = req.params;
    const { meetingDate, meetingTime, adminMessage } = req.body;

    if (!meetingDate) {
      return res.status(400).json({ error: "Meeting date is required" });
    }

    const fields = ["meeting_date = ?"];
    const values = [meetingDate];

    if (meetingTime) {
      fields.push("meeting_time = ?");
      values.push(meetingTime);
    }

    if (adminMessage) {
      fields.push("admin_message = ?");
      values.push(adminMessage);
    }

    values.push(id);

    await db.query(
      `UPDATE bookings SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    res.json({ message: "Booking rescheduled successfully" });
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    res.status(500).json({ error: "Failed to reschedule booking" });
  }
});

// ===================================
// FAQs
// ===================================

// Get all FAQs
app.get("/api/faqs", async (req, res) => {
  try {
    // For now, return static FAQs. Can be moved to database later
    const faqs = [
      {
        id: 1,
        question: "How do I book a unit?",
        answer:
          "To book a unit, navigate to the 'All Bookings' tab, select your desired unit, fill out the booking form with your details including your Facebook account link, choose a meeting date and time, then submit.",
      },
      {
        id: 2,
        question: "What information do I need to provide?",
        answer:
          "You need to provide your name, email, contact number, Facebook account link, and your preferred meeting date and time.",
      },
      {
        id: 3,
        question: "How long does it take for my booking to be approved?",
        answer:
          "Bookings are typically reviewed within 24-48 hours. You will receive a notification once your booking is approved or if any changes are needed.",
      },
      {
        id: 4,
        question: "Can I reschedule my booking?",
        answer:
          "Yes, you can request a reschedule by contacting the admin through the messaging system. The admin will work with you to find a suitable time.",
      },
      {
        id: 5,
        question: "What happens after my booking is approved?",
        answer:
          "Once approved, you will receive confirmation and can proceed with the next steps as communicated by the admin.",
      },
      {
        id: 6,
        question: "Why do I need to provide my Facebook account?",
        answer:
          "Your Facebook account helps us verify your identity and provides an additional channel for communication regarding your booking.",
      },
    ];
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
