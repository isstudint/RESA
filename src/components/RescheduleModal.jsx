import React, { useState } from "react";
import "../css/bookings.css";

function RescheduleModal({ booking, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    meetingDate: booking.meeting_date?.split("T")[0] || "",
    meetingTime: booking.meeting_time || "09:00",
    adminMessage: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${booking.id}/reschedule`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to reschedule booking");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeOptions = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}`;
      timeOptions.push(time);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content reschedule-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Reschedule Booking</h3>
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
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Meeting Date</label>
            <input
              type="date"
              value={formData.meetingDate}
              onChange={(e) =>
                setFormData({ ...formData, meetingDate: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>New Meeting Time</label>
            <select
              value={formData.meetingTime}
              onChange={(e) =>
                setFormData({ ...formData, meetingTime: e.target.value })
              }
              required
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Message to User (Optional)</label>
            <textarea
              value={formData.adminMessage}
              onChange={(e) =>
                setFormData({ ...formData, adminMessage: e.target.value })
              }
              placeholder="Explain the reason for rescheduling..."
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Reschedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RescheduleModal;
