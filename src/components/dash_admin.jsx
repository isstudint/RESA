import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/dash_admin.css";
import "../css/bookings.css";
import Sidebar from "./Sidebar";
import AdminUnitModal from "./AdminUnitModal";
import RescheduleModal from "./RescheduleModal";
import MessageModal from "./MessageModal";
import DashboardNavbar from "./DashboardNavbar";
import { getUnitThumbnail } from "../utils/imageUtils";

function DashAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUnits: 0,
    availableUnits: 0,
    pendingBookings: 0,
  });
  const [units, setUnits] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingUnit, setEditingUnit] = useState(null);
  const [bookingStatusFilter, setBookingStatusFilter] = useState("Pending");
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] =
    useState(null);
  const [selectedBookingForMessage, setSelectedBookingForMessage] =
    useState(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "tenant",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "units", label: "Units" },
    { id: "accounts", label: "Accounts" },
    { id: "bookings", label: "Bookings" },
    { id: "settings", label: "Settings" },
  ];

  const [notificationType, setNotificationType] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchUnits();
    fetchBookings();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/stats");
      if (res.ok) setStats(await res.json());
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/units");
      if (res.ok) setUnits(await res.json());
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
        checkNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const checkNotifications = async (bookingsData) => {
    let type = null;
    const notificationsList = [];

    // Check for pending bookings
    const pendingBookings = bookingsData.filter((b) => b.status === "Pending");
    if (pendingBookings.length > 0) {
      for (const booking of pendingBookings) {
        notificationsList.push({
          id: `pending-${booking.id}`,
          type: "booking",
          message: `New booking request from ${booking.first_name} ${booking.last_name} for ${booking.unit_name}`,
          time: new Date(booking.created_at).toLocaleDateString(),
          bookingId: booking.id,
        });
      }
      type = "message";
    }

    // Check for unread messages from users
    for (const booking of bookingsData) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings/${booking.id}/messages`
        );
        if (res.ok) {
          const messages = await res.json();
          // Check if the last message is NOT from admin (i.e., from user)
          if (
            messages.length > 0 &&
            messages[messages.length - 1].sender_type !== "admin"
          ) {
            const lastMsg = messages[messages.length - 1];
            notificationsList.unshift({
              id: `message-${booking.id}-${lastMsg.id}`,
              type: "message",
              message: `New message from ${booking.first_name} ${booking.last_name}: "${lastMsg.message.substring(0, 50)}${lastMsg.message.length > 50 ? '...' : ''}"`,
              time: new Date(lastMsg.created_at).toLocaleString(),
              bookingId: booking.id,
            });
            type = "message";
          }
        }
      } catch (err) {
        console.error("Error checking messages:", err);
      }
    }

    setNotifications(notificationsList);
    setNotificationType(type);
  };

  const handleNotificationClick = (notification) => {
    setActiveTab("bookings");
    if (notification.type === "message") {
      const booking = bookings.find((b) => b.id === notification.bookingId);
      if (booking) {
        setSelectedBookingForMessage(booking);
      }
    }
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setNotificationType(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleUnitStatusToggle = async (unit) => {
    const newStatus = unit.status === "Available" ? "Occupied" : "Available";
    try {
      const res = await fetch(`http://localhost:5000/api/units/${unit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchUnits();
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating unit status:", error);
    }
  };

  const handleSaveUnit = async (updatedUnit) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/units/${updatedUnit.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUnit),
        }
      );

      if (res.ok) {
        setEditingUnit(null);
        fetchUnits();
        fetchStats();
      } else {
        alert("Failed to update unit");
      }
    } catch (error) {
      console.error("Error updating unit:", error);
      alert("Error updating unit");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "User created successfully" });
        setNewUser({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          role: "tenant",
        });
        fetchStats();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to create user",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Server error" });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-content">
            <div className="building-header">
              <div className="building-header-info">
                <h2>Welcome to Admin Control</h2>
                <button className="announcement-btn">Announcement</button>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Total Units</span>
                  <span className="stat-value">{stats.totalUnits}</span>
                </div>
                <div className="stat-icon blue">🏠</div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Available Units</span>
                  <span className="stat-value">{stats.availableUnits}</span>
                </div>
                <div className="stat-icon green">🔑</div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Pending Bookings</span>
                  <span className="stat-value">{stats.pendingBookings}</span>
                </div>
                <div className="stat-icon purple">📅</div>
              </div>
            </div>

            <div className="buildings-section">
              <h3>Units Overview</h3>
              <div className="units-table-container">
                <table className="units-table">
                  <thead>
                    <tr>
                      <th>Unit Number</th>
                      <th>Size</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.map((unit) => (
                      <tr key={unit.id}>
                        <td>{unit.name}</td>
                        <td>{unit.size} sqm</td>
                        <td>₱{unit.price}</td>
                        <td>
                          <span
                            className={`status-badge ${unit.status.toLowerCase()}`}
                          >
                            {unit.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "units":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>Units Availability</h2>
              <div className="unit-filters">
                <button className="filter-btn active">All Units</button>
                <button className="filter-btn">Available</button>
                <button className="filter-btn">Not Available</button>
              </div>
            </div>

            <div className="units-grid-admin">
              {units.map((unit) => (
                <div key={unit.id} className="unit-card-admin">
                  <div className="unit-image-admin">
                    <img
                      src={getUnitThumbnail(unit)}
                      alt={unit.name}
                      onError={(e) => {
                        e.target.src = "/section.png";
                      }}
                    />
                    <div className={`status-tag ${unit.status.toLowerCase()}`}>
                      {unit.status}
                    </div>
                    <button
                      className="edit-unit-btn"
                      onClick={() => setEditingUnit(unit)}
                    >
                      ✎
                    </button>
                  </div>
                  <div className="unit-details-admin">
                    <h4>{unit.name}</h4>
                    <p className="unit-meta">
                      {unit.size} sqm • ₱{unit.price}
                    </p>
                    <div className="toggle-container">
                      <span>
                        {unit.status === "Available"
                          ? "Available"
                          : "Not Available"}
                      </span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={unit.status === "Available"}
                          onChange={() => handleUnitStatusToggle(unit)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "accounts":
        return (
          <div className="content-section">
            <h2>Create Account</h2>
            <div className="create-account-form">
              {message.text && (
                <div className={`message ${message.type}`}>{message.text}</div>
              )}
              <form onSubmit={handleCreateUser}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={newUser.firstName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={newUser.lastName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>User Type</label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="form-select"
                  >
                    <option value="user">User</option>
                    <option value="tenant">Tenant</option>
                  </select>
                </div>
                <button type="submit" className="create-btn">
                  Create Account
                </button>
              </form>
            </div>
          </div>
        );
      case "bookings": {
        const filteredBookings = bookings.filter(
          (b) => b.status === bookingStatusFilter
        );

        const handleApproveBooking = async (bookingId) => {
          try {
            const response = await fetch(
              `http://localhost:5000/api/bookings/${bookingId}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Approved" }),
              }
            );
            if (response.ok) {
              fetchBookings();
              fetchStats();
            }
          } catch (error) {
            console.error("Error approving booking:", error);
          }
        };

        const handleDeclineBooking = async (bookingId) => {
          try {
            const response = await fetch(
              `http://localhost:5000/api/bookings/${bookingId}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Declined" }),
              }
            );
            if (response.ok) {
              fetchBookings();
              fetchStats();
            }
          } catch (error) {
            console.error("Error declining booking:", error);
          }
        };

        const handleDeleteBooking = async (bookingId) => {
          if (window.confirm("Are you sure you want to permanently delete this booking? This action cannot be undone.")) {
            try {
              const response = await fetch(
                `http://localhost:5000/api/bookings/${bookingId}`,
                {
                  method: "DELETE",
                }
              );
              if (response.ok) {
                fetchBookings();
                fetchStats();
              }
            } catch (error) {
              console.error("Error deleting booking:", error);
            }
          }
        };

        return (
          <div className="content-section">
            <h2>Bookings Management</h2>
            <div className="booking-tabs">
              <button
                className={`tab-btn ${
                  bookingStatusFilter === "Pending" ? "active" : ""
                }`}
                onClick={() => setBookingStatusFilter("Pending")}
              >
                Pending
              </button>
              <button
                className={`tab-btn ${
                  bookingStatusFilter === "Approved" ? "active" : ""
                }`}
                onClick={() => setBookingStatusFilter("Approved")}
              >
                Approved
              </button>
              <button
                className={`tab-btn ${
                  bookingStatusFilter === "Declined" ? "active" : ""
                }`}
                onClick={() => setBookingStatusFilter("Declined")}
              >
                Declined
              </button>
            </div>
            <div className="bookings-table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Unit</th>
                    <th>Contact</th>
                    <th>Facebook</th>
                    <th>Meeting</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        No {bookingStatusFilter.toLowerCase()} bookings found
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          {booking.first_name} {booking.last_name}
                          <br />
                          <small style={{ color: "#6b7280" }}>
                            {booking.email}
                          </small>
                        </td>
                        <td>{booking.unit_name}</td>
                        <td>{booking.contact_number || "N/A"}</td>
                        <td>
                          {booking.facebook_link ? (
                            <a
                              href={booking.facebook_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#2563eb" }}
                            >
                              View Profile
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>
                          {new Date(booking.meeting_date).toLocaleDateString()}
                          {booking.meeting_time && (
                            <>
                              <br />
                              <small>{booking.meeting_time}</small>
                            </>
                          )}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${booking.status.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              flexWrap: "wrap",
                            }}
                          >
                            {booking.status === "Pending" && (
                              <>
                                <button
                                  className="action-btn approve"
                                  onClick={() =>
                                    handleApproveBooking(booking.id)
                                  }
                                  title="Approve"
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </button>
                                <button
                                  className="action-btn decline"
                                  onClick={() =>
                                    handleDeclineBooking(booking.id)
                                  }
                                  title="Decline"
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
                                </button>
                              </>
                            )}
                            <button
                              className="action-btn reschedule-btn"
                              onClick={() =>
                                setSelectedBookingForReschedule(booking)
                              }
                              title="Reschedule"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <rect
                                  x="3"
                                  y="4"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                            </button>
                            <button
                              className="action-btn message-btn"
                              onClick={() =>
                                setSelectedBookingForMessage(booking)
                              }
                              title="Message"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() =>
                                handleDeleteBooking(booking.id)
                              }
                              title="Delete"
                              style={{
                                background: "#fee2e2",
                                color: "#ef4444",
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
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      case "settings":
        return (
          <div className="content-section">
            <h2>System Settings</h2>
            <p>Configure system preferences</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole="Admin"
      />

      <main className="admin-content">
        <DashboardNavbar
          user={{ firstName: "Admin", role: "Admin" }}
          onLogout={handleLogout}
          hasNotifications={notificationType}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onClearNotifications={handleClearNotifications}
        />
        {renderContent()}
      </main>

      {editingUnit && (
        <AdminUnitModal
          unit={editingUnit}
          onClose={() => setEditingUnit(null)}
          onSave={handleSaveUnit}
        />
      )}

      {/* Reschedule Modal */}
      {selectedBookingForReschedule && (
        <RescheduleModal
          booking={selectedBookingForReschedule}
          onClose={() => setSelectedBookingForReschedule(null)}
          onSuccess={() => {
            fetchBookings();
            setSelectedBookingForReschedule(null);
          }}
        />
      )}

      {/* Message Modal */}
      {selectedBookingForMessage && (
        <MessageModal
          booking={selectedBookingForMessage}
          onClose={() => setSelectedBookingForMessage(null)}
        />
      )}
    </div>
  );
}

export default DashAdmin;
