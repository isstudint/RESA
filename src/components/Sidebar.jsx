import React from 'react';
import '../css/dash_admin.css';

function Sidebar({ menuItems, activeTab, onTabChange, onLogout, userRole = 'User' }) {
  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <h1 className="sidebar-logo">STRUCTIV</h1>
        <p className="sidebar-subtitle">{userRole} Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
              >
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <button className="sidebar-logout" onClick={onLogout}>
        Logout
      </button>

      {/* Footer */}
      <div className="sidebar-footer">
        <p>© 2025 STRUCTIV</p>
      </div>
    </aside>
  );
}

export default Sidebar;
