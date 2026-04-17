import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    const res = await api.getMyAppointments(token);
    if (res.success) {
      setAppointments(res.data || []);
    } else {
      setError('Failed to load appointments');
    }
    setLoading(false);
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const res = await api.cancelAppointment(appointmentId, 'Patient cancelled', token);
      if (res.success) {
        setSuccess('Appointment cancelled');
        loadAppointments();
      } else {
        setError(res.message || 'Failed to cancel');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: '#27ae60',
      completed: '#3498db',
      cancelled: '#e74c3c',
      pending: '#f39c12',
      rescheduled: '#9b59b6'
    };
    return colors[status] || '#7f8c8d';
  };

  return (
    <div>
      <nav className="navbar">
        <div><h3>📋 My Appointments</h3></div>
        <div className="nav-links">
          <a href="/patient/dashboard">← Back</a>
        </div>
      </nav>

      <div className="page">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : appointments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt._id}>
                    <td>Dr. {apt.doctor?.user?.name}</td>
                    <td>{apt.department?.name}</td>
                    <td>{apt.slot?.date}</td>
                    <td>{apt.slot?.startTime} - {apt.slot?.endTime}</td>
                    <td>{apt.type}</td>
                    <td>
                      <span style={{
                        backgroundColor: getStatusColor(apt.status),
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {apt.status}
                      </span>
                    </td>
                    <td>
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(apt._id)}
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                          className="danger"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-info" style={{ textAlign: 'center' }}>
              No appointments yet. <a href="/patient/book-appointment">Book one now!</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
