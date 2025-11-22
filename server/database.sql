-- ===================================
-- RESA Database - Complete Setup
-- Drop and recreate everything fresh
-- ===================================

DROP DATABASE IF EXISTS resa_db;
CREATE DATABASE resa_db;
USE resa_db;

-- ===================================
-- USERS TABLE
-- ===================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  contact_number VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  user_type ENUM('user', 'tenant') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================
-- UNITS TABLE
-- ===================================
CREATE TABLE units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  size INT,
  price DECIMAL(10, 2),
  status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available',
  images TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================
-- BOOKINGS TABLE
-- ===================================
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  unit_id INT,
  booking_date DATE,
  meeting_date DATE,
  status ENUM('Pending', 'Approved', 'Declined') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- ===================================
-- SEED DATA
-- ===================================

-- Insert sample admin user (password: admin123)
INSERT INTO users (first_name, last_name, username, email, password, user_type) VALUES
('Admin', 'User', 'admin', 'admin@resa.com', 'admin123', 'user');

-- Insert sample tenant user (password: tenant123)
INSERT INTO users (first_name, last_name, username, email, password, user_type) VALUES
('John', 'Doe', 'johndoe', 'john@example.com', 'tenant123', 'tenant');

-- Insert sample units with default images
INSERT INTO units (name, size, price, status, images) VALUES
('Unit 101', 45, 1200.00, 'Available', '["/section.png"]'),
('Unit 102', 45, 1200.00, 'Available', '["/section.png"]'),
('Unit 103', 45, 1200.00, 'Available', '["/section.png"]'),
('Unit 104', 45, 1200.00, 'Occupied', '["/section.png"]'),
('Unit 105', 45, 1200.00, 'Available', '["/section.png"]');

-- ===================================
-- VERIFY SETUP
-- ===================================
SELECT 'Database setup complete!' as Status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_units FROM units;
SELECT COUNT(*) as total_bookings FROM bookings;
