import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/dash_admin.css';
import '../css/settings.css';
import Setting from'../assets/setting.svg';
import Home from "../assets/home.png";
import Key from "../assets/key.png";
import Property from "../assets/property.png";
import UnitModal from './UnitModal';
import Sidebar from './sidebar';
import EditProfileModal from './EditProfileModal';

function DashUser() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedModel, setSelectedModel] = useState(0);
  const [settingsTab, setSettingsTab] = useState('profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const models = [
    {
      name: 'Commercial Building',
      src: '/resa.glb',
      description: 'Full building exterior view'
    },
    {
      name: 'Unit Interior',
      src: '/try.glb',
      description: 'Interior unit layout'
    },
    {
      name: 'Floor Plan',
      src: '/floor_plan.glb',
      description: 'Detailed floor plan'
    }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'viewer3d', label: '3D Viewer' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'settings', label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMessage({ type: 'error', text: result.error || 'Failed to change password' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Cannot connect to server. Make sure backend is running.' });
    }
  };

  const handleSaveProfile = (formData) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...userData, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    window.location.reload();
  };

  const units = [
    {
      name: 'Unit 101',
      location: 'Ground Floor',
      size: 45,
      rooms: 2,
      price: 1200,
      status: 'Available',
      image: '/section.png'
    },
    {
      name: 'Unit 205',
      location: '2nd Floor',
      size: 60,
      rooms: 3,
      price: 1800,
      status: 'Occupied',
      image: '/section.png'
    },
    {
      name: 'Unit 312',
      location: '3rd Floor',
      size: 50,
      rooms: 2,
      price: 1500,
      status: 'Available',
      image: '/section.png'
    },
    {
      name: 'Unit 408',
      location: '4th Floor',
      size: 55,
      rooms: 3,
      price: 1650,
      status: 'Occupied',
      image: '/section.png'
    },
    {
      name: 'Unit 510',
      location: '5th Floor',
      size: 70,
      rooms: 4,
      price: 2200,
      status: 'Available',
      image: '/section.png'
    }
  ];

  const availableUnits = units.filter(u => u.status === 'Available').length;
  const occupiedUnits = units.filter(u => u.status === 'Occupied').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            {/* Building Header */}
            <div className="building-header">
              <div className="building-header-info">
                <h2>PIAZZA AMARILUNA COMMERCIAL BUILDING</h2>
                <p className="building-address"><span><img src={Setting} alt="Settings" /></span>De Ocampo, Trece Martires , Cavite</p>
                <p className="building-specs">5 Units</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Total Units</span>
                  <span className="stat-value">{units.length}</span>
                </div>
                <div className="stat-icon blue"><span><img src={Home} alt="Home" width={30} /></span></div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Available Units</span>
                  <span className="stat-value">{availableUnits}</span>
                </div>
                <div className="stat-icon green"><span><img src={Key} alt="Key" width={30} /></span></div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Occupied Units</span>
                  <span className="stat-value">{occupiedUnits}</span>
                </div>
                <div className="stat-icon purple"><span><img src={Property} alt="Property" width={30} /></span></div>
              </div>
            </div>

            {/* Units Section */}
            <div className="buildings-section">
              <h3>All Units</h3>
              <div className="buildings-grid">
                {units.map((unit, index) => (
                  <div 
                    key={index} 
                    className="building-card unit-card-clickable"
                    onClick={() => setSelectedUnit(unit)}
                  >
                    <div className="building-image">
                      <img src={unit.image} alt={unit.name} />
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
      case 'viewer3d':
        return (
          <div className="dashboard-content">
            <div className="building-header">
              <div className="building-header-info">
                <h2>3D Unit Viewer</h2>
                <p className="building-address">Interactive 3D models of the property</p>
              </div>
            </div>

            {/* Model Selector */}
            <div className="model-selector">
              {models.map((model, index) => (
                <button
                  key={index}
                  className={`model-selector-btn ${selectedModel === index ? 'active' : ''}`}
                  onClick={() => setSelectedModel(index)}
                >
                  <span className="model-name">{model.name}</span>
                  <span className="model-desc">{model.description}</span>
                </button>
              ))}
            </div>

            {/* 3D Viewer */}
            <div className="viewer-container">
              <model-viewer
                src={models[selectedModel].src}
                camera-controls
                environment-image="/brown_photostudio_02_2k.hdr"
                disable-tap
                shadow-intensity="2"
                reveal="auto"
                max-camera-orbit="auto auto 20m"
                field-of-view="45deg"
                interpolation-decay="50"
                min-camera-orbit="auto auto 10m"
                
                style={{ width: '100%', height: '600px' , background: '#c5c5c5ff'}}
              >
              </model-viewer>
            </div>
          </div>
        );
      case 'bookings':
        return (
          <div className="content-section">
            <h2>Bookings & Reservations</h2>
            <p>Manage inquiries</p>
          </div>
        );
      case 'settings':{
        const userData = JSON.parse(localStorage.getItem('user'));
        const initials = `${userData?.firstName?.[0] || ''}${userData?.lastName?.[0] || ''}`.toUpperCase();
        
        return (
          <div className="dashboard-content">
            <div className="building-header">
              <div className="building-header-info">
                <h2>Settings</h2>
              </div>
            </div>

            <div className="settings-tabs">
              <button 
                className={`settings-tab ${settingsTab === 'profile' ? 'active' : ''}`}
                onClick={() => setSettingsTab('profile')}
              >
                Profile Setting
              </button>
              <button 
                className={`settings-tab ${settingsTab === 'password' ? 'active' : ''}`}
                onClick={() => setSettingsTab('password')}
              >
                Password
              </button>
            </div>

            {settingsTab === 'profile' ? (
              <>
                <div className="settings-card">
                  <div className="settings-card-header">
                    <div>
                      <h3>Profile</h3>
                      <p>Update your profile</p>
                    </div>
                    <button className="edit-btn" onClick={() => setShowEditModal(true)}>Edit</button>
                  </div>
                  <div className="profile-photo-section">
                    <div className="profile-initials">{initials}</div>
                  </div>
                  <div className="info-field">
                    <label>Username</label>
                    <p>{userData?.username || ''}</p>
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
                    <p>{`${userData?.firstName || ''} ${userData?.lastName || ''}`}</p>
                  </div>
                  <div className="info-field">
                    <label>Email</label>
                    <p>{userData?.email || ''}</p>
                  </div>
                  <div className="info-field">
                    <label>Contact Number</label>
                    <p>{userData?.contactNumber || 'Not set'}</p>
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
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="settings-field">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="settings-field">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="save-password-btn">Change Password</button>
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
        onLogout={handleLogout}
        userRole="Tenant"
      />

      {/* Main Content */}
      <main className="admin-content">
        {renderContent()}
      </main>

      {/* Unit Modal */}
      {selectedUnit && (
        <UnitModal 
          unit={selectedUnit} 
          onClose={() => setSelectedUnit(null)} 
        />
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal 
          userData={JSON.parse(localStorage.getItem('user'))}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}

export default DashUser;
