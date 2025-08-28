// src/App.js - Simple routing without React Router
import React, { useState } from 'react';
import './App.css';
import Navbar from './components/navbar';
import ReservationForm from './components/ReservationForm';
import ReservationsList from './components/ReservationsList';
import ReservationDetail from './components/ReservationDetail';

function App() {
  // STATE: Track which page we're currently showing
  // This is a simple way to handle navigation without React Router
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedReservationId, setSelectedReservationId] = useState(null);

  // FUNCTION: Navigate between pages
  // This function will be passed to child components
  const navigateTo = (page, reservationId = null) => {
    setCurrentPage(page);
    setSelectedReservationId(reservationId);
    
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  // FUNCTION: Render the correct page component
  // This is like a simple router - shows different content based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'create-reservation':
        return <ReservationForm navigateTo={navigateTo} />;
      case 'view-reservations':
        return <ReservationsList navigateTo={navigateTo} />;
      case 'reservation-detail':
        return <ReservationDetail reservationId={selectedReservationId} navigateTo={navigateTo} />;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="App">
      {/* Pass navigation function to Navbar */}
      <Navbar currentPage={currentPage} navigateTo={navigateTo} />
      
      {/* Render the current page */}
      {renderPage()}
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Elegant Dining. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// HOME PAGE COMPONENT
// This is a separate component for better organization
const HomePage = ({ navigateTo }) => (
  <div className="page-container">
    <div className="welcome-section">
      <h1>Welcome to Elegant Dining</h1>
      <p>Your perfect dining experience awaits. Make a reservation and enjoy our exquisite cuisine.</p>
      
      <div className="cta-buttons">
        {/* NAVIGATION: Use our navigateTo function instead of React Router */}
        <button 
          className="btn btn-primary" 
          onClick={() => navigateTo('create-reservation')}
        >
          Make a Reservation
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => navigateTo('view-reservations')}
        >
          View All Reservations
        </button>
      </div>
    </div>
    
    <div className="hero-section">
      <div className="hero-card">
        <h2>Reserve Your Table</h2>
        <p>Experience fine dining at its best. Our restaurant offers an elegant atmosphere with exceptional service.</p>
        <ul className="features-list">
          <li>✨ Award-winning cuisine</li>
          <li>🍷 Extensive wine selection</li>
          <li>👨‍🍳 Expert chefs</li>
          <li>🌟 Elegant ambiance</li>
        </ul>
      </div>
      
      <div className="hero-card">
        <h2>Operating Hours</h2>
        <div className="hours-info">
          <div className="day-hours">
            <span className="day">Monday - Thursday</span>
            <span className="hours">5:00 PM - 10:00 PM</span>
          </div>
          <div className="day-hours">
            <span className="day">Friday - Saturday</span>
            <span className="hours">5:00 PM - 11:00 PM</span>
          </div>
          <div className="day-hours">
            <span className="day">Sunday</span>
            <span className="hours">4:00 PM - 9:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default App;