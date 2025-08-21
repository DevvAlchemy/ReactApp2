import React from 'react';
import './App.css';
import Navbar from './components/navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="main-content">
        <div className="container">
          <div className="welcome-section">
            <h1>Welcome to Elegant Dining</h1>
            <p>Your perfect dining experience awaits. Make a reservation and enjoy our exquisite cuisine.</p>
            
            <div className="cta-buttons">
              <button className="btn btn-primary">Make a Reservation</button>
              <button className="btn btn-secondary">View Menu</button>
            </div>
          </div>
          
          {/* Hero Section */}
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
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Elegant Dining. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;