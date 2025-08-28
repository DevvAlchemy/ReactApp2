// src/components/ReservationForm.jsx
import React, { useState } from 'react';

const ReservationForm = () => {
  // STATE: This holds all our form data
  // Think of useState like a container that React watches for changes
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    reservation_date: '',
    reservation_time: '',
    party_size: '',
    special_requests: ''
  });
  
  // STATE: Loading and message states for user feedback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // HANDLER: This function runs every time user types in any input
  // The 'e' parameter is the event object - it contains info about what happened
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Get the name and value from the input that changed
    
    // This is the React way to update state
    // We spread (...) the previous data and update just the field that changed
    setFormData(prevData => ({
      ...prevData,        // Keep all existing data
      [name]: value       // Update only the field that changed
    }));
  };

  // HANDLER: This function runs when user clicks submit
  const handleSubmit = async (e) => {
    // Prevent the default form submission (which would refresh the page)
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // VALIDATION: Check if required fields are filled
    // This is basic client-side validation
    const requiredFields = ['customer_name', 'email', 'phone', 'reservation_date', 'reservation_time', 'party_size'];
    
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        setMessage({
          text: `Please fill in the ${field.replace('_', ' ')} field`,
          type: 'error'
        });
        return; // Stop here if validation fails
      }
    }
    
    // Show loading state while we send data to backend
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // API CALL: Send data to our PHP backend
      // This is how React talks to PHP - through HTTP requests
      const response = await fetch('http://localhost/REACTAPP2/backend/api/create_reservation.php', {
        method: 'POST',                          // We're creating new data
        headers: {
          'Content-Type': 'application/json',    // Tell server we're sending JSON
        },
        body: JSON.stringify(formData)           // Convert our JavaScript object to JSON string
      });

      // Parse the response from our PHP backend
      const result = await response.json();

      // Check if everything went well
      if (response.ok && result.success) {
        // SUCCESS: Show success message and reset form
        setMessage({
          text: `Reservation created successfully! Reservation ID: ${result.data.reservation_id}`,
          type: 'success'
        });
        
        // Reset form to empty state
        setFormData({
          customer_name: '',
          email: '',
          phone: '',
          reservation_date: '',
          reservation_time: '',
          party_size: '',
          special_requests: ''
        });
      } else {
        // ERROR: Show error message from backend
        setMessage({
          text: result.message || 'Failed to create reservation',
          type: 'error'
        });
      }
    } catch (error) {
      // NETWORK ERROR: Handle connection issues
      console.error('Error:', error);
      setMessage({
        text: 'Network error. Please check your connection and try again.',
        type: 'error'
      });
    } finally {
      // Always run this - whether success or error
      setLoading(false);
    }
  };

  // Get today's date for validation (can't book past dates)
  const today = new Date().toISOString().split('T')[0];

  // RENDER: This is what gets displayed to the user
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Make a Reservation</h1>
        <p>Fill out the form below to reserve your table</p>
      </div>

      <div className="form-card">
        {/* CONDITIONAL RENDERING: Only show message if there is one */}
        {message.text && (
          <div className={`message ${message.type}`}>
            <div className="message-icon">
              {message.type === 'success' ? (
                // Success icon
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                // Error icon
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="message-text">{message.text}</div>
          </div>
        )}

        {/* FORM: The actual form elements */}
        <div className="form-section">
          {/* Customer Name - Single input */}
          <div className="form-group">
            <label htmlFor="customer_name" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"                // This matches our state property
              value={formData.customer_name}      // Controlled component - React controls the value
              onChange={handleInputChange}       // Call our handler when user types
              required
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email and Phone - Two inputs side by side */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                type="email"                     // HTML5 email validation
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number *
              </label>
              <input
                type="tel"                       // HTML5 phone input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Date, Time, Party Size - Three inputs in a row */}
          <div className="form-row three-cols">
            <div className="form-group">
              <label htmlFor="reservation_date" className="form-label">
                Date *
              </label>
              <input
                type="date"
                id="reservation_date"
                name="reservation_date"
                value={formData.reservation_date}
                onChange={handleInputChange}
                min={today}                      // Can't select past dates
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reservation_time" className="form-label">
                Time *
              </label>
              <input
                type="time"
                id="reservation_time"
                name="reservation_time"
                value={formData.reservation_time}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="party_size" className="form-label">
                Party Size *
              </label>
              <select
                id="party_size"
                name="party_size"
                value={formData.party_size}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                <option value="">Select size</option>
                {/* Generate options 1-20 using JavaScript array methods */}
                {Array.from({ length: 20 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Special Requests - Optional text area */}
          <div className="form-group">
            <label htmlFor="special_requests" className="form-label">
              Special Requests (Optional)
            </label>
            <textarea
              id="special_requests"
              name="special_requests"
              value={formData.special_requests}
              onChange={handleInputChange}
              rows="4"
              className="form-textarea"
              placeholder="Any special requests, dietary restrictions, or celebration details..."
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}                   // Disable while loading
            className="submit-button"
          >
            <div className="button-content">
              {/* CONDITIONAL RENDERING: Show spinner only when loading */}
              {loading && <div className="loading-spinner"></div>}
              {loading ? 'Creating Reservation...' : 'Submit Reservation'}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;