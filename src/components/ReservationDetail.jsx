// src/components/ReservationDetail.jsx
import React, { useState, useEffect } from 'react';

const ReservationDetail = ({ reservationId, navigateTo }) => {
  // STATE: Hold individual reservation data
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  // EFFECT: Fetch reservation when component loads or ID changes
  useEffect(() => {
    if (reservationId) {
      fetchReservationDetail(reservationId);
    }
  }, [reservationId]); // Run this effect when reservationId changes

  // FUNCTION: Get single reservation from backend
  const fetchReservationDetail = async (id) => {
    try {
      setLoading(true);
      setError('');

      // API CALL: Get single reservation
      // Note: You'll need to create this PHP endpoint
      const response = await fetch(`http://localhost/reservations/api/get_reservation.php?id=${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReservation(data.data);
      } else {
        setError(data.message || 'Reservation not found');
      }
      
    } catch (error) {
      console.error('Error fetching reservation:', error);
      setError('Unable to load reservation details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // FUNCTION: Update reservation status
  // This demonstrates how to make PUT/PATCH requests
  const updateReservationStatus = async (newStatus) => {
    try {
      setUpdating(true);
      
      // API CALL: Update reservation status
      const response = await fetch('http://localhost/REACTAPP2/backend/api/get_reservation.php?id=${id', {
        method: 'POST', // or PUT - depends on your PHP backend
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: reservationId,
          status: newStatus
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update local state to reflect the change
        setReservation(prev => ({
          ...prev,
          status: newStatus,
          updated_at: new Date().toISOString()
        }));
      } else {
        setError(result.message || 'Failed to update reservation');
      }
      
    } catch (error) {
      console.error('Error updating reservation:', error);
      setError('Unable to update reservation. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // HELPER FUNCTIONS: Format data for display
  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    return {
      date: dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#10b981',
      cancelled: '#ef4444',
      completed: '#6366f1'
    };
    return colors[status] || colors.pending;
  };

  // CONDITIONAL RENDERING: Different UI states

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <p>Loading reservation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Unable to Load Reservation</h2>
          <p>{error}</p>
          <button onClick={() => fetchReservationDetail(reservationId)} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-icon">❓</div>
          <h3>Reservation Not Found</h3>
          <p>The requested reservation could not be found.</p>
        </div>
      </div>
    );
  }

  // Format the date and time
  const { date, time } = formatDateTime(reservation.reservation_date, reservation.reservation_time);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Reservation Details</h1>
          <p>Reservation ID: #{reservation.id}</p>
        </div>
        
        {/* Back Button */}
        <button 
          className="btn btn-secondary"
          onClick={() => {
            // NAVIGATION: Go back to reservations list
            navigateTo('view-reservations');
          }}
        >
          ← Back to List
        </button>
      </div>

      {/* Main Content */}
      <div className="detail-container">
        
        {/* Customer Information Card */}
        <div className="detail-card">
          <div className="card-title">
            <h2>Customer Information</h2>
            {/* Status badge with dynamic color */}
            <span 
              className="status-badge large"
              style={{ backgroundColor: getStatusColor(reservation.status) }}
            >
              {reservation.status.toUpperCase()}
            </span>
          </div>
          
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">👤 Name</span>
              <span className="detail-value">{reservation.customer_name}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">📧 Email</span>
              <span className="detail-value">
                <a href={`mailto:${reservation.email}`} className="email-link">
                  {reservation.email}
                </a>
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">📞 Phone</span>
              <span className="detail-value">
                <a href={`tel:${reservation.phone}`} className="phone-link">
                  {reservation.phone}
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Reservation Details Card */}
        <div className="detail-card">
          <div className="card-title">
            <h2>Reservation Details</h2>
          </div>
          
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">📅 Date</span>
              <span className="detail-value large-text">{date}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">🕐 Time</span>
              <span className="detail-value large-text">{time}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">👥 Party Size</span>
              <span className="detail-value large-text">
                {reservation.party_size} {reservation.party_size === 1 ? 'person' : 'people'}
              </span>
            </div>
            
            {/* Only show special requests if they exist */}
            {reservation.special_requests && (
              <div className="detail-item full-width">
                <span className="detail-label">💬 Special Requests</span>
                <span className="detail-value">{reservation.special_requests}</span>
              </div>
            )}
          </div>
        </div>

        {/* Timestamps Card */}
        <div className="detail-card">
          <div className="card-title">
            <h2>System Information</h2>
          </div>
          
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">📝 Created</span>
              <span className="detail-value">
                {new Date(reservation.created_at).toLocaleString()}
              </span>
            </div>
            
            {reservation.updated_at && (
              <div className="detail-item">
                <span className="detail-label">🔄 Last Updated</span>
                <span className="detail-value">
                  {new Date(reservation.updated_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actions-card">
          <h3>Update Status</h3>
          <div className="action-buttons">
            {/* Only show relevant status update buttons */}
            {reservation.status === 'pending' && (
              <>
                <button
                  onClick={() => updateReservationStatus('confirmed')}
                  disabled={updating}
                  className="btn btn-success"
                >
                  {updating ? 'Updating...' : 'Confirm Reservation'}
                </button>
                <button
                  onClick={() => updateReservationStatus('cancelled')}
                  disabled={updating}
                  className="btn btn-danger"
                >
                  {updating ? 'Updating...' : 'Cancel Reservation'}
                </button>
              </>
            )}
            
            {reservation.status === 'confirmed' && (
              <button
                onClick={() => updateReservationStatus('completed')}
                disabled={updating}
                className="btn btn-success"
              >
                {updating ? 'Updating...' : 'Mark as Completed'}
              </button>
            )}
            
            {(reservation.status === 'cancelled' || reservation.status === 'completed') && (
              <p className="status-message">
                This reservation is {reservation.status} and cannot be modified.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetail;