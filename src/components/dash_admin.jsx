import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/dash_admin.css";
import Sidebar from "./sidebar";
import AdminUnitModal from "./AdminUnitModal";

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

  // Form states
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
      if (res.ok) setBookings(await res.json());
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
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
                      src={(() => {
                        try {
                          let images = [];
                          if (unit.images) {
                            if (typeof unit.images === "string") {
                              images = JSON.parse(unit.images);
                            } else if (Array.isArray(unit.images)) {
                              images = unit.images;
                            }
                          }
                          const imagePath =
                            images && images.length > 0
                              ? images[0]
                              : "/section.png";
                          return imagePath.startsWith("/uploads")
                            ? `http://localhost:5000${imagePath}`
                            : imagePath;
                        } catch (error) {
                          console.error("Error parsing images:", error);
                          return "/section.png";
                        }
                      })()}
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
      case "bookings":
        return (
          <div className="content-section">
            <h2>Bookings</h2>
            <div className="booking-tabs">
              <button className="tab-btn active">Request</button>
              <button className="tab-btn">Approved</button>
              <button className="tab-btn">Declined</button>
            </div>
            <div className="bookings-table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Unit</th>
                    <th>Email</th>
                    <th>Booking Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="6">No bookings found</td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          {booking.first_name} {booking.last_name}
                        </td>
                        <td>{booking.unit_name}</td>
                        <td>{booking.email}</td>
                        <td>
                          {new Date(booking.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${booking.status.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn approve">✓</button>
                          <button className="action-btn decline">✗</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
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
        onLogout={handleLogout}
        userRole="Admin"
      />

      <main className="admin-content">{renderContent()}</main>

      {editingUnit && (
        <AdminUnitModal
          unit={editingUnit}
          onClose={() => setEditingUnit(null)}
          onSave={handleSaveUnit}
        />
      )}
    </div>
  );
}

export default DashAdmin;
