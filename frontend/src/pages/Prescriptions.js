import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    setLoading(true);
    const res = await api.getMyPrescriptions(token);
    if (res.success) {
      setPrescriptions(res.data || []);
    } else {
      setError('Failed to load prescriptions');
    }
    setLoading(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div><h3>💊 My Prescriptions</h3></div>
        <div className="nav-links">
          <a href="/patient/dashboard">← Back</a>
        </div>
      </nav>

      <div className="page">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : prescriptions.length > 0 ? (
            <div className="grid grid-2">
              {prescriptions.map(rx => (
                <div key={rx._id} className="card">
                  <div className="card-header">
                    Prescription for {new Date(rx.createdAt).toLocaleDateString()}
                  </div>
                  <p><strong>Doctor:</strong> Dr. {rx.doctor?.user?.name}</p>
                  <p><strong>Diagnosis:</strong> {rx.diagnosis || 'Not provided'}</p>
                  <p><strong>Notes:</strong> {rx.notes || 'None'}</p>

                  {rx.medicines && rx.medicines.length > 0 && (
                    <>
                      <h4 style={{ marginTop: '15px', marginBottom: '10px', color: '#2c3e50' }}>Medicines</h4>
                      <table style={{ fontSize: '13px' }}>
                        <thead>
                          <tr>
                            <th>Medicine</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rx.medicines.map((med, idx) => (
                            <tr key={idx}>
                              <td>{med.name}</td>
                              <td>{med.dosage}</td>
                              <td>{med.frequency}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}

                  {rx.followUpDate && (
                    <p style={{ marginTop: '10px', color: '#e74c3c' }}>
                      <strong>Follow-up:</strong> {new Date(rx.followUpDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info" style={{ textAlign: 'center' }}>
              No prescriptions yet. Complete your appointments to receive prescriptions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
