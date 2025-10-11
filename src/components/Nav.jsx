import React from 'react';
import '../css/style.css';

function Navbar() {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo-nav">
            <h1 className="logo">STRUCTIV</h1>
          </div>

          <div className="nav-menu">
            <a href="#home" className="nav-link">
              Home
            </a>
            <a href="#showcase" className="nav-link">
              Showcase
            </a>
            <a href="#faq" className="nav-link">
              FAQ
            </a>
            <a href="#booking" className="nav-link">
              Booking
            </a>
          </div>
        </div>
      </nav>
    );
}

export default Navbar;