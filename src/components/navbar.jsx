import React, { useState } from 'react';

const Navbar = ({ currentPage, navigateTo }) => {
  // STATE: Control mobile menu open/closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // FUNCTION: Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // FUNCTION: Handle navigation clicks
  const handleNavClick = (page) => {
    navigateTo(page);        // Call the navigation function passed from App.js
    setIsMenuOpen(false);    // Close mobile menu after clicking
  };

  // FUNCTION: Check if current page is active (for styling)
  const isActivePage = (page) => {
    return currentPage === page;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand/Logo - clicking goes to home */}
        <a 
          className="navbar-brand" 
          href="#"
          onClick={(e) => {
            e.preventDefault(); // Prevent page refresh
            handleNavClick('home');
          }}
        >
          Reservations App
        </a>

        {/* Mobile hamburger menu button */}
        <button 
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {/* Animated hamburger lines */}
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            
            {/* Home Link */}
            <li className="nav-item">
              <a 
                className={`nav-link ${isActivePage('home') ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('home');
                }}
              >
                Home
              </a>
            </li>
            
            {/* Create Reservation Link */}
            <li className="nav-item">
              <a 
                className={`nav-link ${isActivePage('create-reservation') ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('create-reservation');
                }}
              >
                Make Reservation
              </a>
            </li>
            
            {/* View Reservations Link */}
            <li className="nav-item">
              <a 
                className={`nav-link ${isActivePage('view-reservations') ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('view-reservations');
                }}
              >
                View Reservations
              </a>
            </li>
            
            {/* About Link */}
            <li className="nav-item">
              <a 
                className={`nav-link ${isActivePage('about') ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('about');
                }}
              >
                About
              </a>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;