import React, { useState, useEffect } from "react";
import "../css/style.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Change navbar color after scrolling past hero section (e.g., 100vh)
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`navbar ${isOpen ? "nav-open" : ""} ${
        isScrolled ? "scrolled" : ""
      }`}
    >
      <div className="nav-container">
        {/* Hamburger Menu (Left) */}
        <div className="nav-toggle" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Logo (Center) - Hides when scrolled */}
        <div className={`logo-nav ${isScrolled ? "hidden" : ""}`}>
          <h1 className="logo">STRUCTIV</h1>
        </div>

        {/* Right placeholder (optional, for balance) */}
        <div className="nav-right-placeholder" style={{ width: "24px" }}></div>
      </div>

      {/* Dropdown Menu Overlay */}
      <div className={`nav-overlay ${isOpen ? "open" : ""}`}>
        <div className="nav-menu-items">
          <a href="#hero" className="nav-link" onClick={toggleMenu}>
            Home
          </a>
          <a href="#process" className="nav-link" onClick={toggleMenu}>
            Process
          </a>
          <a href="#showcase" className="nav-link" onClick={toggleMenu}>
            Showcase
          </a>
          <a href="/login" className="nav-link" onClick={toggleMenu}>
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
