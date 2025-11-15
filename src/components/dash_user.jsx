import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/dash_admin.css';
import Setting from'../assets/setting.svg';
import Home from "../assets/home.png";
import Key from "../assets/key.png";
import Property from "../assets/property.png";
import UnitModal from './UnitModal';
import Sidebar from './sidebar';

function DashUser() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedModel, setSelectedModel] = useState(0);

  const models = [
    {
      name: 'Commercial Building',
      src: '/resa.glb',
      description: 'Full building exterior view'
    },
    {
      name: 'Unit Interior',
      src: '/unit_interior.glb',
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
      case 'settings':
        return (
          <div className="content-section">
            <h2>Settings</h2>
            <p>Configure preferences</p>
          </div>
        );
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
    </div>
  );
}

export default DashUser;
