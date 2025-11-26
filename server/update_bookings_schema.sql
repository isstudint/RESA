-- ===================================
-- RESA Bookings Schema Update
-- Add new fields for enhanced booking system
-- ===================================

USE resa_db;

-- Add new columns to bookings table
ALTER TABLE bookings
ADD COLUMN facebook_link VARCHAR(255) AFTER meeting_date,
ADD COLUMN meeting_time TIME AFTER facebook_link,
ADD COLUMN contact_number VARCHAR(20) AFTER meeting_time,
ADD COLUMN admin_message TEXT AFTER contact_number;

-- Create booking_messages table for admin-user communication
CREATE TABLE IF NOT EXISTS booking_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  sender_type ENUM('admin', 'user') NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Verify the changes
SELECT 'Schema update complete!' as Status;
DESCRIBE bookings;
DESCRIBE booking_messages;
