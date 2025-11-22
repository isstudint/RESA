-- Quick fix for RESA database
-- Run this to fix the images issue

USE resa_db;

-- Check if 'image' column exists and rename it to 'images'
ALTER TABLE units CHANGE COLUMN image images TEXT;

-- Update existing data to use JSON array format
UPDATE units SET images = CONCAT('["', images, '"]') WHERE images NOT LIKE '[%';

-- Verify the change
SELECT id, name, images FROM units;
