import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user, logout, token } = useAuth();
  const [stats, setStats] = useState({ appointments: 0, departments: 0, doctors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [aptsRes, deptsRes, docsRes] = await Promise.all([
      api.getAllAppointments(token),
      api.getDepartments(),
      api.getDoctors()
    ]);

    setStats({
      appointments: aptsRes.data?.length || 0,
      departments: deptsRes.data?.length || 0,
      doctors: docsRes.data?.length || 0
    });
    setLoading(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div><h3>🏥 Admin Dashboard</h3></div>
        <div className="nav-links">
          <Link to="/admin/departments">🏢 Departments</Link>
          <Link to="/admin/doctors">👨‍⚕️ Doctors</Link>
          <Link to="/admin/appointments">📅 Appointments</Link>
          <span style={{ cursor: 'pointer' }} onClick={logout}>🚪 Logout</span>
        </div>
      </nav>

      <div className="page">
        <div className="container">
          <h1 className="page-title">Welcome, Admin {user?.name}!</h1>

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <>
              <div className="dashboard-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.appointments}</div>
                  <div className="stat-label">Total Appointments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.departments}</div>
                  <div className="stat-label">Departments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.doctors}</div>
                  <div className="stat-label">Doctors</div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">Management</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link to="/admin/departments">
                    <button>🏢 Manage Departments</button>
                  </Link>
                  <Link to="/admin/doctors">
                    <button className="success">👨‍⚕️ Manage Doctors</button>
                  </Link>
                  <Link to="/admin/appointments">
                    <button>📅 View All Appointments</button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
