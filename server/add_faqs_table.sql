-- Create FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default FAQs
INSERT INTO faqs (question, answer) VALUES
('How do I book a unit?', "To book a unit, navigate to the 'All Bookings' tab, select your desired unit, fill out the booking form with your details including your Facebook account link, choose a meeting date and time, then submit."),
('What information do I need to provide?', "You need to provide your name, email, contact number, Facebook account link, and your preferred meeting date and time."),
('How long does it take for my booking to be approved?', "Bookings are typically reviewed within 24-48 hours. You will receive a notification once your booking is approved or if any changes are needed."),
('Can I reschedule my booking?', "Yes, you can request a reschedule by contacting the admin through the messaging system. The admin will work with you to find a suitable time."),
('What happens after my booking is approved?', "Once approved, you will receive confirmation and can proceed with the next steps as communicated by the admin."),
('Why do I need to provide my Facebook account?', "Your Facebook account helps us verify your identity and provides an additional channel for communication regarding your booking.");
