import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DoctorAppointments = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApt, setSelectedApt] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: '',
    notes: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }]
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    const res = await api.getDoctorAppointments(token);
    if (res.success) {
      setAppointments(res.data || []);
    } else {
      setError('Failed to load appointments');
    }
    setLoading(false);
  };

  const handleAddMedicine = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', frequency: '', duration: '' }]
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...prescriptionForm.medicines];
    updated[index][field] = value;
    setPrescriptionForm(prev => ({ ...prev, medicines: updated }));
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await api.createPrescription({
      appointmentId: selectedApt._id,
      ...prescriptionForm
    }, token);

    if (res.success) {
      setError('');
      alert('Prescription added successfully!');
      setSelectedApt(null);
      loadAppointments();
    } else {
      setError(res.message || 'Failed to add prescription');
    }
    setSubmitting(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div><h3>👥 My Appointments</h3></div>
        <div className="nav-links">
          <a href="/doctor/dashboard">← Back</a>
        </div>
      </nav>

      <div className="page">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}

          {selectedApt ? (
            // Prescription form
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <button onClick={() => setSelectedApt(null)} style={{ marginBottom: '20px' }}>← Back</button>
              
              <div className="card">
                <div className="card-header">Add Prescription</div>
                <p><strong>Patient:</strong> {selectedApt.patient?.name}</p>
                <p><strong>Date:</strong> {selectedApt.slot?.date} {selectedApt.slot?.startTime}</p>
              </div>

              <form onSubmit={handleSubmitPrescription}>
                <div className="form-group">
                  <label>Diagnosis</label>
                  <input
                    type="text"
                    value={prescriptionForm.diagnosis}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                    placeholder="e.g., Common Cold"
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={prescriptionForm.notes}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows="3"
                    placeholder="Additional notes..."
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Medicines</h4>
                  {prescriptionForm.medicines.map((med, idx) => (
                    <div key={idx} style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                      <div className="form-group">
                        <label>Medicine Name</label>
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                          placeholder="Medicine name"
                        />
                      </div>
                      <div className="grid grid-3">
                        <div className="form-group">
                          <label>Dosage</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                            placeholder="e.g., 500mg"
                          />
                        </div>
                        <div className="form-group">
                          <label>Frequency</label>
                          <input
                            type="text"
                            value={med.frequency}
                            onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                            placeholder="e.g., Twice daily"
                          />
                        </div>
                        <div className="form-group">
                          <label>Duration</label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                            placeholder="e.g., 7 days"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddMedicine} style={{ width: '100%', marginBottom: '10px' }}>
                    + Add Medicine
                  </button>
                </div>

                <button type="submit" disabled={submitting} style={{ width: '100%' }}>
                  {submitting ? 'Submitting...' : 'Save Prescription'}
                </button>
              </form>
            </div>
          ) : (
            // Appointments list
            loading ? (
              <div className="loading"><div className="spinner"></div></div>
            ) : appointments.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
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
                      <td>{apt.patient?.name}</td>
                      <td>{apt.slot?.date}</td>
                      <td>{apt.slot?.startTime} - {apt.slot?.endTime}</td>
                      <td>{apt.type}</td>
                      <td>
                        <span style={{
                          backgroundColor: apt.status === 'completed' ? '#27ae60' : apt.status === 'confirmed' ? '#3498db' : '#f39c12',
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
                            onClick={() => {
                              setSelectedApt(apt);
                              setPrescriptionForm({ diagnosis: '', notes: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '' }] });
                            }}
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                            className="success"
                          >
                            Add Rx
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="alert alert-info" style={{ textAlign: 'center' }}>
                No appointments scheduled yet.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
