import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Simple navigation handler
  const handleNavClick = (section) => {
    console.log(`Navigating to: ${section}`);
    setIsMenuOpen(false);
    // In a real app, I'd use React Router here
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand/Logo will be here for now i'll skip it */}
        <a 
          className="navbar-brand" 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
        >
          Reservations App
        </a>

        {/* Mobile menu button */}
        <button 
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('home');
                }}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('reservations');
                }}
              >
                Make Reservation
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('view-reservations');
                }}
              >
                View Reservations
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link" 
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