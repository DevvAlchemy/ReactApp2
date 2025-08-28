import React, { useState, useEffect } from 'react';

const ReservationsList = () => {
  // STATE: Hold our list of reservations
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // EFFECT: This runs when component first loads
  // Similar to document.addEventListener('DOMContentLoaded') in vanilla JS
  useEffect(() => {
    fetchReservations();
  }, []); // Empty array means "run once when component mounts"

  // FUNCTION: Get all reservations from backend
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError('');

      // API CALL: Get reservations from PHP backend
      // Note: You'll need to create this PHP endpoint
      const response = await fetch('http://localhost/REACTAPP2/backend/api/get_reservations.php');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReservations(data.data || []); // Set reservations or empty array if no data
      } else {
        setError(data.message || 'Failed to fetch reservations');
      }
      
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError('Unable to load reservations. Please try again.');
    } finally {
      setLoading(false); // Always stop loading, whether success or error
    }
  };

  // FUNCTION: Format date for display
  // This makes dates more readable for users
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // FUNCTION: Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // FUNCTION: Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  // CONDITIONAL RENDERING: Show different content based on state
  
  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <p>Loading reservations...</p>
        </div>
      </div>
    );
  }

  // Show error message if something went wrong
  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchReservations} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // MAIN RENDER: Show the reservations list
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1>All Reservations</h1>
          <p>Manage and view all restaurant reservations</p>
        </div>
        <button onClick={fetchReservations} className="btn btn-secondary">
          Refresh List
        </button>
      </div>

      {/* Show message if no reservations exist */}
      {reservations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No Reservations Found</h3>
          <p>There are currently no reservations in the system.</p>
        </div>
      ) : (
        // MAPPING: Convert each reservation object into a card component
        // This is a key React pattern - transforming data into UI elements
        <div className="reservations-grid">
          {reservations.map((reservation) => (
            // KEY PROP: React needs unique keys when rendering lists
            <div key={reservation.id} className="reservation-card">
              
              {/* Card Header with name and status */}
              <div className="card-header">
                <h3 className="customer-name">{reservation.customer_name}</h3>
                <span className={`status-badge ${getStatusColor(reservation.status)}`}>
                  {reservation.status}
                </span>
              </div>
              
              {/* Card Body with reservation details */}
              <div className="card-body">
                <div className="detail-row">
                  <span className="detail-label">📧 Email:</span>
                  <span className="detail-value">{reservation.email}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">📞 Phone:</span>
                  <span className="detail-value">{reservation.phone}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">📅 Date:</span>
                  <span className="detail-value">{formatDate(reservation.reservation_date)}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">🕐 Time:</span>
                  <span className="detail-value">{formatTime(reservation.reservation_time)}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">👥 Party Size:</span>
                  <span className="detail-value">{reservation.party_size} people</span>
                </div>
                
                {/* Only show special requests if they exist */}
                {reservation.special_requests && (
                  <div className="detail-row">
                    <span className="detail-label">💬 Special Requests:</span>
                    <span className="detail-value">{reservation.special_requests}</span>
                  </div>
                )}
              </div>
              
              {/* Card Footer with action button */}
              <div className="card-footer">
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    // TODO: Navigate to individual reservation detail
                    console.log(`View details for reservation ${reservation.id}`);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsList;