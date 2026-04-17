import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const STATUS_COLORS = {
  pending: '#f39c12',
  confirmed: '#27ae60',
  completed: '#3498db',
  cancelled: '#e74c3c',
  rescheduled: '#9b59b6',
};

const AdminAppointments = () => {
  const { logout, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => { loadAppointments(); }, []);

  useEffect(() => {
    let result = appointments;
    if (statusFilter !== 'all') result = result.filter(a => a.status === statusFilter);
    if (dateFilter) result = result.filter(a => a.slot?.date === dateFilter);
    setFiltered(result);
  }, [appointments, statusFilter, dateFilter]);

  const loadAppointments = async () => {
    setLoading(true);
    const res = await api.getAllAppointments(token);
    if (res.success) setAppointments(res.data || []);
    else setError('Failed to load appointments');
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    setError(''); setSuccess('');
    const res = await api.cancelAppointment(id, 'Cancelled by admin', token);
    if (res.success) { setSuccess('Appointment cancelled.'); loadAppointments(); }
    else setError(res.message || 'Failed to cancel');
  };

  const handleStatusChange = async (id, newStatus) => {
    setError(''); setSuccess('');
    const res = await api.updateAppointmentStatus(id, newStatus, token);
    if (res.success) { setSuccess(`Status updated to ${newStatus}.`); loadAppointments(); }
    else setError(res.message || 'Failed to update status');
  };

  const statusCounts = appointments.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <nav className="navbar">
        <div><h3>🏥 Admin — Appointments</h3></div>
        <div className="nav-links">
          <Link to="/admin/dashboard">🏠 Dashboard</Link>
          <Link to="/admin/departments">🏢 Departments</Link>
          <Link to="/admin/doctors">👨‍⚕️ Doctors</Link>
          <span style={{ cursor: 'pointer' }} onClick={logout}>🚪 Logout</span>
        </div>
      </nav>

      <div className="page">
        <div className="container">
          <h1 className="page-title">📅 All Appointments</h1>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Summary cards */}
          <div className="dashboard-grid" style={{ marginBottom: 24 }}>
            {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
              <div key={s} className="stat-card" style={{ cursor: 'pointer', borderTop: `4px solid ${STATUS_COLORS[s]}` }}
                onClick={() => setStatusFilter(s === statusFilter ? 'all' : s)}>
                <div className="stat-value" style={{ color: STATUS_COLORS[s] }}>{statusCounts[s] || 0}</div>
                <div className="stat-label" style={{ textTransform: 'capitalize' }}>{s}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="card">
            <div className="flex" style={{ flexWrap: 'wrap' }}>
              <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 150 }}>
                <label>Status</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 180 }}>
                <label>Date</label>
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button onClick={() => { setStatusFilter('all'); setDateFilter(''); }}
                  style={{ backgroundColor: '#7f8c8d' }}>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : filtered.length === 0 ? (
            <div className="card"><p style={{ color: '#7f8c8d' }}>No appointments match the current filters.</p></div>
          ) : (
            <div className="card">
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Department</th>
                      <th>Date & Time</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(appt => (
                      <tr key={appt._id}>
                        <td>
                          <strong>{appt.patient?.name}</strong>
                          <div style={{ fontSize: 12, color: '#7f8c8d' }}>{appt.patient?.phone}</div>
                        </td>
                        <td>Dr. {appt.doctor?.user?.name}</td>
                        <td>{appt.department?.name || '—'}</td>
                        <td>
                          <strong>{appt.slot?.date || '—'}</strong>
                          <div style={{ fontSize: 12, color: '#7f8c8d' }}>
                            {appt.slot?.startTime} – {appt.slot?.endTime}
                          </div>
                        </td>
                        <td style={{ textTransform: 'capitalize' }}>{appt.type}</td>
                        <td>
                          <span style={{
                            padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                            backgroundColor: STATUS_COLORS[appt.status] + '22',
                            color: STATUS_COLORS[appt.status],
                            textTransform: 'capitalize'
                          }}>
                            {appt.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex" style={{ flexWrap: 'wrap' }}>
                            {appt.status === 'pending' && (
                              <button className="success" onClick={() => handleStatusChange(appt._id, 'confirmed')}
                                style={{ padding: '4px 10px', fontSize: 12 }}>✓ Confirm</button>
                            )}
                            {(appt.status === 'confirmed' || appt.status === 'pending') && (
                              <button onClick={() => handleStatusChange(appt._id, 'completed')}
                                style={{ padding: '4px 10px', fontSize: 12, backgroundColor: '#3498db' }}>✔ Complete</button>
                            )}
                            {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                              <button className="danger" onClick={() => handleCancel(appt._id)}
                                style={{ padding: '4px 10px', fontSize: 12 }}>✕ Cancel</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 12, color: '#7f8c8d', fontSize: 13 }}>
                Showing {filtered.length} of {appointments.length} appointments
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
