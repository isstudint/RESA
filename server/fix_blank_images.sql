-- Quick fix to add images to all units
USE resa_db;

-- Update all units to have the default image in JSON array format
UPDATE units SET images = '["/section.png"]' WHERE images IS NULL OR images = '' OR images = 'null';

-- Verify the update
SELECT id, name, images FROM units;
