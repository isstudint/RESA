import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/dash_admin.css';
import Sidebar from './sidebar';

function DashAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'units', label: 'All Units' },
    { id: 'users', label: 'Users' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="building-header">
              <div className="building-header-info">
                <h2>Admin Dashboard</h2>
                <p className="building-address">Manage all properties and users</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Total Users</span>
                  <span className="stat-value">0</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Total Units</span>
                  <span className="stat-value">5</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">Active Bookings</span>
                  <span className="stat-value">0</span>
                </div>
              </div>
            </div>

            <div className="buildings-section">
              <h3>Recent Activity</h3>
              <p>No recent activity</p>
            </div>
          </div>
        );
      case 'units':
        return (
          <div className="content-section">
            <h2>All Units Management</h2>
            <p>Manage all building units</p>
          </div>
        );
      case 'users':
        return (
          <div className="content-section">
            <h2>User Management</h2>
            <p>Add, edit, or remove users</p>
          </div>
        );
      case 'bookings':
        return (
          <div className="content-section">
            <h2>Bookings Management</h2>
            <p>View and approve bookings</p>
          </div>
        );
      case 'maintenance':
        return (
          <div className="content-section">
            <h2>Maintenance Requests</h2>
            <p>Handle maintenance requests</p>
          </div>
        );
      case 'reports':
        return (
          <div className="content-section">
            <h2>Reports & Analytics</h2>
            <p>View financial and occupancy reports</p>
          </div>
        );
      case 'settings':
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

      <main className="admin-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default DashAdmin;
