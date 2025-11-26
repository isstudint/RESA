import React, { useState, useEffect } from "react";
import "../css/bookings.css";

function UserBookingModal({ booking, onClose, onUpdate }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (booking) {
      fetchMessages();
    }
  }, [booking]);

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
            senderType: "user",
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

  const handleCancelBooking = async () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/bookings/${booking.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Declined" }),
          }
        );
        if (response.ok) {
          onUpdate();
          onClose();
        }
      } catch (error) {
        console.error("Error canceling booking:", error);
      }
    }
  };

  if (!booking) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        <div className="modal-header">
          <h3>Booking Details</h3>
          <button
            className="close-btn"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div
          className="modal-body"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            padding: "1.5rem",
            overflowY: "auto",
          }}
        >
          {/* Booking Info Section */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
          >
            <div>
              <h4 style={{ margin: "0 0 1rem 0", color: "#111827" }}>
                Unit Information
              </h4>
              <div
                style={{
                  display: "grid",
                  gap: "0.5rem",
                  color: "#4b5563",
                  fontSize: "0.9375rem",
                }}
              >
                <p>
                  <strong>Unit:</strong> {booking.unit_name}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`booking-status ${booking.status.toLowerCase()}`}
                  >
                    {booking.status}
                  </span>
                </p>
                <p>
                  <strong>Booked on:</strong>{" "}
                  {new Date(booking.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h4 style={{ margin: "0 0 1rem 0", color: "#111827" }}>
                Meeting Details
              </h4>
              <div
                style={{
                  display: "grid",
                  gap: "0.5rem",
                  color: "#4b5563",
                  fontSize: "0.9375rem",
                }}
              >
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.meeting_date).toLocaleDateString(
                    undefined,
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p>
                  <strong>Time:</strong> {booking.meeting_time || "Not set"}
                </p>
                {booking.admin_message && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.75rem",
                      background: "#f3f4f6",
                      borderRadius: "6px",
                    }}
                  >
                    <strong>Note from Admin:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>
                      {booking.admin_message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #e5e7eb",
              margin: "0",
            }}
          />

          {/* Messages Section */}
          <div
            className="messages-container"
            style={{ padding: "0", border: "none" }}
          >
            <h4 style={{ marginBottom: "1rem" }}>Messages</h4>
            <div
              className="messages-list"
              style={{
                maxHeight: "300px",
                background: "#f9fafb",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              {messages.length === 0 ? (
                <p className="no-messages">
                  No messages yet. Start a conversation with the admin.
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-item ${msg.sender_type}`}
                  >
                    <div className="message-header">
                      <span className="sender-badge">
                        {msg.sender_type === "user" ? "You" : "Admin"}
                      </span>
                      <span className="message-time">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="message-text">{msg.message}</div>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="message-form"
              style={{ padding: "1rem 0 0 0" }}
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message to the admin..."
                  rows="2"
                  style={{ flex: 1, marginBottom: 0 }}
                  required
                />
                <button
                  type="submit"
                  className="send-btn"
                  disabled={isSubmitting}
                  style={{ width: "auto", padding: "0 1.5rem", height: "auto" }}
                >
                  Send
                </button>
              </div>
              {error && (
                <p className="error-message" style={{ margin: "0.5rem 0 0 0" }}>
                  {error}
                </p>
              )}
            </form>
          </div>

          {booking.status === "Pending" && (
            <div
              style={{
                marginTop: "auto",
                paddingTop: "1rem",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <button
                className="action-btn cancel-btn"
                onClick={handleCancelBooking}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  fontFamily: "medium",
                  color: "#ef4444",
                  background: "#fee2e2",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserBookingModal;
