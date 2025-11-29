import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/dash_admin.css";
import "../css/settings.css";
import "../css/bookings.css";
import Setting from "../assets/setting.svg";
import UnitModal from "./UnitModal";
import { getUnitThumbnail } from "../utils/imageUtils";
import Sidebar from "./Sidebar";
import EditProfileModal from "./EditProfileModal";
import BookingForm from "./BookingForm";
import FAQSection from "./FAQSection";
import UserBookingModal from "./UserBookingModal";
import DashboardNavbar from "./DashboardNavbar";

function DashUser() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedModel, setSelectedModel] = useState(0);
  const [settingsTab, setSettingsTab] = useState("profile");
  const [showEditModal, setShowEditModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });
  const [activeBookingTab, setActiveBookingTab] = useState("all");
  const [selectedBookingUnit, setSelectedBookingUnit] = useState(null);
  const [selectedUserBooking, setSelectedUserBooking] = useState(null);
  const [userBookings, setUserBookings] = useState([]);

  const modelViewerRef = useRef(null);

  const models = [
    {
      name: "Commercial Building",
      src: "/resa.glb",
      description: "Full building exterior view",
    },
    {
      name: "Unit Interior",
      src: "/try.glb",
      description: "Interior unit layout",
    },
    {
      name: "Floor Plan",
      src: "/floor_plan.glb",
      description: "Detailed floor plan",
    },
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "viewer3d", label: "3D Viewer" },
    { id: "bookings", label: "Bookings" },
    { id: "settings", label: "Settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        "http://localhost:5000/api/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userData.id,
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setPasswordMessage({
          type: "success",
          text: "Password changed successfully",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordMessage({
          type: "error",
          text: result.error || "Failed to change password",
        });
      }
    } catch {
      setPasswordMessage({
        type: "error",
        text: "Cannot connect to server. Make sure backend is running.",
      });
    }
  };

  const handleSaveProfile = (formData) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const updatedUser = { ...userData, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.location.reload();
  };

  const [units, setUnits] = useState([]);
  const [notificationType, setNotificationType] = useState(null);

  // Fetch data from backend
  React.useEffect(() => {
    fetchUnits();
    fetchUserBookings();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/units");
      if (response.ok) {
        const data = await response.json();
        setUnits(data);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) return;

      const response = await fetch(
        `http://localhost:5000/api/user/bookings/${userData.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setUserBookings(data);
        checkNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const checkNotifications = async (bookings) => {
    let type = null;

    // Check for unread messages from admin FIRST
    for (const booking of bookings) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings/${booking.id}/messages`
        );
        if (res.ok) {
          const messages = await res.json();
          // Check if the last message is from admin
          if (
            messages.length > 0 &&
            messages[messages.length - 1].sender_type === "admin"
          ) {
            type = "message";
            break;
          }
        }
      } catch (err) {
        console.error("Error checking messages:", err);
      }
    }

    // If no messages, check booking statuses
    if (!type) {
      const hasApproved = bookings.some((b) => b.status === "Approved");
      const hasDeclined = bookings.some((b) => b.status === "Declined");

      if (hasApproved) {
        type = "approved";
      } else if (hasDeclined) {
        type = "declined";
      }
    }

    setNotificationType(type);
  };

  const resetView = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = "-30deg 75deg 8m";
      modelViewerRef.current.fieldOfView = "45deg";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-content">
            {/* Building Header */}
            <div className="building-header">
              <div className="building-header-info">
                <h2>PIAZZA AMARILUNA COMMERCIAL BUILDING</h2>
                <p className="building-address">
                  <span>
                    <img src={Setting} alt="Settings" />
                  </span>
                  De Ocampo, Trece Martires , Cavite
                </p>
                <p className="building-specs">5 Units</p>
              </div>
              <div className="buildings-grid">
                {units.map((unit, index) => (
                  <div
                    key={index}
                    className="building-card unit-card-clickable"
                    onClick={() => setSelectedUnit(unit)}
                  >
                    <div className="building-image">
                      <img
                        src={getUnitThumbnail(unit)}
                        alt={unit.name}
                        onError={(e) => {
                          e.target.src = "/section.png";
                        }}
                      />
                      <div className="available-badge">{unit.status}</div>
                    </div>
                    <div className="building-info">
                      <h4>{unit.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "viewer3d":
        return (
          <div className="dashboard-content">
            <div className="building-header">
              <div className="building-header-info">
                <h2>3D Unit Viewer</h2>
                <p className="building-address">
                  Interactive 3D models of the property
                </p>
              </div>
            </div>

            {/* Model Selector */}
            <div className="model-selector">
              {models.map((model, index) => (
                <button
                  key={index}
                  className={`model-selector-btn ${
                    selectedModel === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedModel(index)}
                >
                  <span className="model-name">{model.name}</span>
                  <span className="model-desc">{model.description}</span>
                </button>
              ))}
            </div>

            {/* 3D Viewer */}
            <div className="viewer-container" style={{ position: "relative" }}>
              <model-viewer
                ref={modelViewerRef}
                src={models[selectedModel].src}
                camera-controls
                environment-image="/brown_photostudio_02_2k.hdr"
                disable-tap
                disable-pan
                shadow-intensity="2"
                reveal="auto"
                min-camera-orbit="-60deg 60deg 3m"
                max-camera-orbit="60deg 90deg 20m"
                camera-orbit="-30deg 75deg 8m"
                field-of-view="45deg"
                interpolation-decay="50"
                interaction-prompt="none"
                style={{
                  width: "100%",
                  height: "600px",
                  background: "#c5c5c5ff",
                }}
              ></model-viewer>

              <button
                className="reset-view-btn"
                onClick={resetView}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  zIndex: 10,
                  padding: "0.75rem 1.25rem",
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                Reset View
              </button>
            </div>
          </div>
        );
      case "bookings":
        return (
          <div className="dashboard-content">
            <div className="building-header">
              <div className="building-header-info">
                <h2>Bookings & Reservations</h2>
                <p className="building-address">Manage your unit bookings</p>
              </div>
            </div>

            <div className="booking-tabs">
              <button
                className={`booking-tab ${
                  activeBookingTab === "all" ? "active" : ""
                }`}
                onClick={() => setActiveBookingTab("all")}
              >
                All Bookings
              </button>
              <button
                className={`booking-tab ${
                  activeBookingTab === "my" ? "active" : ""
                }`}
                onClick={() => setActiveBookingTab("my")}
              >
                My Bookings
              </button>
            </div>

            {activeBookingTab === "all" ? (
              <>
                <div className="buildings-grid">
                  {units.map((unit) => (
                    <div
                      key={unit.id}
                      className="building-card unit-card-clickable"
                      onClick={() => setSelectedBookingUnit(unit)}
                    >
                      <div className="building-image">
                        <img
                          src={getUnitThumbnail(unit)}
                          alt={unit.name}
                          onError={(e) => {
                            e.target.src = "/section.png";
                          }}
                        />
                        <div className="available-badge">{unit.status}</div>
                      </div>
                      <div className="building-info">
                        <h4>{unit.name}</h4>
                        <p>
                          {unit.size} sqm • ₱{unit.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <FAQSection />
              </>
            ) : (
              <div className="bookings-grid">
                {userBookings.length === 0 ? (
                  <p>No bookings yet. Book a unit to get started!</p>
                ) : (
                  userBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="booking-card unit-card-clickable"
                      onClick={() => setSelectedUserBooking(booking)}
                    >
                      <div className="booking-card-header">
                        <h4>{booking.unit_name}</h4>
                        <span
                          className={`booking-status ${booking.status.toLowerCase()}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="booking-card-details">
                        <div className="booking-detail">
                          <strong>Meeting Date:</strong>{" "}
                          {new Date(booking.meeting_date).toLocaleDateString()}
                        </div>
                        {booking.meeting_time && (
                          <div className="booking-detail">
                            <strong>Time:</strong> {booking.meeting_time}
                          </div>
                        )}
                        <div className="booking-detail">
                          <strong>Booked on:</strong>{" "}
                          {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                        <div
                          className="booking-detail"
                          style={{
                            marginTop: "0.5rem",
                            color: "#2563eb",
                            fontSize: "0.8rem",
                          }}
                        >
                          Click to view details & messages
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      case "settings": {
        const userData = JSON.parse(localStorage.getItem("user"));
        const initials = `${userData?.firstName?.[0] || ""}${
          userData?.lastName?.[0] || ""
        }`.toUpperCase();

        return (
          <div className="dashboard-content">
            <div className="building-header">
              <div className="building-header-info">
                <h2>Settings</h2>
              </div>
            </div>

            <div className="settings-tabs">
              <button
                className={`settings-tab ${
                  settingsTab === "profile" ? "active" : ""
                }`}
                onClick={() => setSettingsTab("profile")}
              >
                Profile Setting
              </button>
              <button
                className={`settings-tab ${
                  settingsTab === "password" ? "active" : ""
                }`}
                onClick={() => setSettingsTab("password")}
              >
                Password
              </button>
            </div>

            {settingsTab === "profile" ? (
              <>
                <div className="settings-card">
                  <div className="settings-card-header">
                    <div>
                      <h3>Profile</h3>
                      <p>Update your profile</p>
                    </div>
                    <button
                      className="edit-btn"
                      onClick={() => setShowEditModal(true)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="profile-photo-section">
                    <div className="profile-initials">{initials}</div>
                  </div>
                  <div className="info-field">
                    <label>Username</label>
                    <p>{userData?.username || ""}</p>
                  </div>
                </div>

                <div className="settings-card">
                  <div className="settings-card-header">
                    <div>
                      <h3>Account Information</h3>
                      <p>Your personal information</p>
                    </div>
                  </div>
                  <div className="info-field">
                    <label>Name</label>
                    <p>{`${userData?.firstName || ""} ${
                      userData?.lastName || ""
                    }`}</p>
                  </div>
                  <div className="info-field">
                    <label>Email</label>
                    <p>{userData?.email || ""}</p>
                  </div>
                  <div className="info-field">
                    <label>Contact Number</label>
                    <p>{userData?.contactNumber || "Not set"}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h3>Change Password</h3>
                    <p>Update your account password</p>
                  </div>
                </div>

                {passwordMessage.text && (
                  <div className={`password-message ${passwordMessage.type}`}>
                    {passwordMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordChange}>
                  <div className="settings-field">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="settings-field">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="settings-field">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <button type="submit" className="save-password-btn">
                    Change Password
                  </button>
                </form>
              </div>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole="User"
      />

      {/* Main Content */}
      <main className="admin-content">
        <DashboardNavbar
          user={JSON.parse(localStorage.getItem("user"))}
          onLogout={handleLogout}
          hasNotifications={notificationType}
        />
        {renderContent()}
      </main>

      {/* Unit Modal */}
      {selectedUnit && (
        <UnitModal unit={selectedUnit} onClose={() => setSelectedUnit(null)} />
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          userData={JSON.parse(localStorage.getItem("user"))}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Booking Form Modal */}
      {selectedBookingUnit && (
        <BookingForm
          unit={selectedBookingUnit}
          onClose={() => setSelectedBookingUnit(null)}
          onSuccess={() => {
            fetchUserBookings();
            setActiveBookingTab("my");
          }}
        />
      )}

      {/* User Booking Details Modal */}
      {selectedUserBooking && (
        <UserBookingModal
          booking={selectedUserBooking}
          onClose={() => setSelectedUserBooking(null)}
          onUpdate={() => {
            fetchUserBookings();
            setSelectedUserBooking(null);
          }}
        />
      )}
    </div>
  );
}

export default DashUser;
