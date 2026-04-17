import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DoctorDashboard = () => {
  const { user, logout, token } = useAuth();
  const [stats, setStats] = useState({ total: 0, today: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const res = await api.getDoctorAppointments(token);
    if (res.success) {
      const appointments = res.data || [];
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointments.filter(a => a.slot?.date === today);
      const pending = appointments.filter(a => a.status === 'pending');

      setStats({
        total: appointments.length,
        today: todayAppts.length,
        pending: pending.length
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div><h3>🏥 Doctor Dashboard</h3></div>
        <div className="nav-links">
          <Link to="/doctor/schedule">📅 Manage Schedule</Link>
          <Link to="/doctor/appointments">👥 My Appointments</Link>
          <span style={{ cursor: 'pointer' }} onClick={logout}>🚪 Logout</span>
        </div>
      </nav>

      <div className="page">
        <div className="container">
          <h1 className="page-title">Welcome, Dr. {user?.name}!</h1>

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <>
              <div className="dashboard-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total Appointments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.today}</div>
                  <div className="stat-label">Today's Appointments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.pending}</div>
                  <div className="stat-label">Pending Actions</div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">Quick Actions</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link to="/doctor/schedule">
                    <button>📅 Set Availability</button>
                  </Link>
                  <Link to="/doctor/appointments">
                    <button className="success">👥 View Appointments</button>
                  </Link>
                </div>
              </div>

              <div className="card">
                <div className="card-header">Profile Information</div>
                <p><strong>Name:</strong> Dr. {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
