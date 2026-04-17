import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PatientDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav className="navbar">
        <div>
          <h3>🏥 Hospital Booking System</h3>
        </div>
        <div className="nav-links">
          <Link to="/patient/book-appointment">📅 Book Appointment</Link>
          <Link to="/patient/my-appointments">📋 My Appointments</Link>
          <Link to="/patient/prescriptions">💊 Prescriptions</Link>
          <span style={{ cursor: 'pointer' }} onClick={logout}>🚪 Logout</span>
        </div>
      </nav>

      <div className="page">
        <div className="container">
          <h1 className="page-title">Welcome, {user?.name}!</h1>

          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-value">📅</div>
              <div className="stat-label">Book Appointment</div>
              <p style={{ marginTop: '10px' }}>
                <Link to="/patient/book-appointment" style={{ color: '#3498db', textDecoration: 'none' }}>
                  Start Booking →
                </Link>
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-value">📋</div>
              <div className="stat-label">View Appointments</div>
              <p style={{ marginTop: '10px' }}>
                <Link to="/patient/my-appointments" style={{ color: '#3498db', textDecoration: 'none' }}>
                  Check Status →
                </Link>
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-value">💊</div>
              <div className="stat-label">My Prescriptions</div>
              <p style={{ marginTop: '10px' }}>
                <Link to="/patient/prescriptions" style={{ color: '#3498db', textDecoration: 'none' }}>
                  View Details →
                </Link>
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">Your Information</div>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
            <p><strong>Age:</strong> {user?.age || 'Not provided'}</p>
            <p><strong>Gender:</strong> {user?.gender || 'Not provided'}</p>
            <p><strong>Address:</strong> {user?.address || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
