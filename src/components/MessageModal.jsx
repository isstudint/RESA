import React, { useState, useEffect } from "react";
import "../css/bookings.css";

function MessageModal({ booking, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, [booking.id]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${booking.id}/messages`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${booking.id}/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderType: "admin",
            message: newMessage,
          }),
        }
      );

      if (response.ok) {
        setNewMessage("");
        fetchMessages();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to send message");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content message-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Message User</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="booking-info-summary">
          <p>
            <strong>Unit:</strong> {booking.unit_name}
          </p>
          <p>
            <strong>User:</strong> {booking.first_name} {booking.last_name}
          </p>
          <p>
            <strong>Email:</strong> {booking.email}
          </p>
        </div>

        <div className="messages-container">
          <h4>Message History</h4>
          <div className="messages-list">
            {messages.length === 0 ? (
              <p className="no-messages">No messages yet</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`message-item ${msg.sender_type}`}>
                  <div className="message-header">
                    <span className="sender-badge">{msg.sender_type}</span>
                    <span className="message-time">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="message-text">{msg.message}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSendMessage} className="message-form">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message to the user..."
            rows="3"
            required
          />
          <button type="submit" className="send-btn" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessageModal;
