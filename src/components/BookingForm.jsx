import React, { useState, useEffect } from "react";
import "../css/unit_modal.css";
import "../css/bookings.css";

function BookingForm({ unit, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    facebookLink: "",
    meetingDate: "",
    meetingTime: "09:00 AM",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
        email: userData.email || "",
        contactNumber: userData.contactNumber || "",
      }));
    }
  }, []);

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.contactNumber ||
      !formData.facebookLink ||
      !formData.meetingDate ||
      !formData.meetingTime
    ) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\+\-\s]{10,}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setMessage({
        type: "error",
        text: "Please enter a valid contact number.",
      });
      return false;
    }

    // URL validation
    try {
      new URL(formData.facebookLink);
    } catch (_) {
      setMessage({
        type: "error",
        text: "Please enter a valid Facebook URL (e.g., https://facebook.com/...)",
      });
      return false;
    }

    // Date validation (not in past)
    const selectedDate = new Date(formData.meetingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setMessage({
        type: "error",
        text: "Meeting date cannot be in the past.",
      });
      return false;
    }

    return true;
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await fetch("http://localhost:5000/api/user/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          unitId: unit.id,
          bookingDate: new Date().toISOString().split("T")[0],
          meetingDate: formData.meetingDate,
          meetingTime: convertTo24Hour(formData.meetingTime), // Convert to 24h for backend
          facebookLink: formData.facebookLink,
          contactNumber: formData.contactNumber,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Booking submitted successfully!",
        });
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1500);
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.error || "Failed to submit booking",
        });
        setShowConfirmation(false); // Go back to form on error
      }
    } catch (error) {
      setMessage({ type: "error", text: "Cannot connect to server" });
      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate AM/PM time options
  const timeOptions = [];
  const startHour = 8; // 8 AM
  const endHour = 18; // 6 PM

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      const time = `${displayHour.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")} ${ampm}`;
      timeOptions.push(time);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-large"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "700px" }}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-body" style={{ padding: "2.5rem" }}>
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
              {showConfirmation ? "Confirm Booking" : `Book Unit ${unit.name}`}
            </h2>
            <p className="modal-location">
              {unit.size} sqm • ₱{unit.price?.toLocaleString()}/month
            </p>
          </div>

          {message.text && (
            <div
              className={`message ${message.type}`}
              style={{ marginBottom: "1.5rem" }}
            >
              {message.text}
            </div>
          )}

          {!showConfirmation ? (
            <form onSubmit={handleInitialSubmit}>
              <div className="booking-form-group-horizontal">
                <label className="booking-form-label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Your full name"
                  className="booking-form-input"
                />
              </div>

              <div className="booking-form-group-horizontal">
                <label className="booking-form-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  placeholder="your.email@example.com"
                  className="booking-form-input"
                />
              </div>

              <div className="booking-form-group-horizontal">
                <label className="booking-form-label">Contact Number</label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                  required
                  placeholder="+63 912 345 6789"
                  className="booking-form-input"
                />
              </div>

              <div className="booking-form-group-horizontal">
                <label className="booking-form-label">
                  Facebook Account Link
                </label>
                <input
                  type="url"
                  value={formData.facebookLink}
                  onChange={(e) =>
                    setFormData({ ...formData, facebookLink: e.target.value })
                  }
                  required
                  placeholder="https://facebook.com/yourprofile"
                  className="booking-form-input"
                />
              </div>

              <div className="booking-form-row">
                <div className="booking-form-subgroup">
                  <label className="booking-form-label">Meeting Date</label>
                  <input
                    type="date"
                    value={formData.meetingDate}
                    onChange={(e) =>
                      setFormData({ ...formData, meetingDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="booking-form-input"
                  />
                </div>

                <div className="booking-form-subgroup">
                  <label className="booking-form-label">Meeting Time</label>
                  <select
                    value={formData.meetingTime}
                    onChange={(e) =>
                      setFormData({ ...formData, meetingTime: e.target.value })
                    }
                    required
                    className="booking-form-input"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "2rem" }}>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={onClose}
                  style={{ padding: "1rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  style={{ padding: "1rem", backgroundColor: "#1a1a1a" }}
                >
                  Next
                </button>
              </div>
            </form>
          ) : (
            <div className="confirmation-view">
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h4 style={{ margin: "0 0 1rem 0", color: "#111827" }}>
                  Please confirm your booking details:
                </h4>

                <div style={{ display: "grid", gap: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #e5e7eb",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Unit:</span>
                    <span style={{ fontWeight: "500", color: "#111827" }}>
                      {unit.name}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #e5e7eb",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Name:</span>
                    <span style={{ fontWeight: "500", color: "#111827" }}>
                      {formData.name}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #e5e7eb",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Meeting Date:</span>
                    <span style={{ fontWeight: "500", color: "#111827" }}>
                      {new Date(formData.meetingDate).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #e5e7eb",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Meeting Time:</span>
                    <span style={{ fontWeight: "500", color: "#111827" }}>
                      {formData.meetingTime}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #e5e7eb",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Contact:</span>
                    <span style={{ fontWeight: "500", color: "#111827" }}>
                      {formData.contactNumber}
                    </span>
                  </div>
                </div>
              </div>

              <p
                style={{
                  textAlign: "center",
                  color: "#4b5563",
                  marginBottom: "2rem",
                }}
              >
                Do you want to proceed with this booking?
              </p>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                  style={{ padding: "1rem" }}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  style={{ padding: "1rem", backgroundColor: "#1a1a1a" }}
                >
                  {isSubmitting ? "Submitting..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
