import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DoctorSchedule = () => {
  const { token } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSlots, setNewSlots] = useState([{ startTime: '09:00', endTime: '09:30' }]);

  useEffect(() => {
    loadSlots();
  }, [date]);

  const loadSlots = async () => {
    setLoading(true);
    const res = await api.getMySlots(token, date);
    if (res.success) {
      setSlots(res.data || []);
    }
    setLoading(false);
  };

  const handleAddSlot = () => {
    setNewSlots([...newSlots, { startTime: '09:00', endTime: '09:30' }]);
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...newSlots];
    updated[index][field] = value;
    setNewSlots(updated);
  };

  const handleRemoveSlot = (index) => {
    setNewSlots(newSlots.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const res = await api.createSlots({ date, slots: newSlots }, token);
    if (res.success) {
      setSuccess('Slots created successfully!');
      setNewSlots([{ startTime: '09:00', endTime: '09:30' }]);
      loadSlots();
    } else {
      setError(res.message || 'Failed to create slots');
    }
    setLoading(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div><h3>📅 Manage Schedule</h3></div>
        <div className="nav-links">
          <a href="/doctor/dashboard">← Back</a>
        </div>
      </nav>

      <div className="page">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="grid grid-2">
            {/* Add Slots */}
            <div className="card">
              <div className="card-header">Create Slots</div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
                  {newSlots.map((slot, idx) => (
                    <div key={idx} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                      <div className="grid grid-2" style={{ gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px' }}>From</label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => handleSlotChange(idx, 'startTime', e.target.value)}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px' }}>To</label>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => handleSlotChange(idx, 'endTime', e.target.value)}
                          />
                        </div>
                      </div>
                      {newSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(idx)}
                          className="danger"
                          style={{ width: '100%', marginTop: '8px', padding: '5px' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button type="button" onClick={handleAddSlot} style={{ width: '100%', marginBottom: '10px' }}>
                  + Add Slot
                </button>

                <button type="submit" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Creating...' : 'Create Slots'}
                </button>
              </form>
            </div>

            {/* View Existing Slots */}
            <div className="card">
              <div className="card-header">Slots for {date}</div>
              {loading ? (
                <div className="loading"><div className="spinner"></div></div>
              ) : slots.length > 0 ? (
                <table style={{ fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map(slot => (
                      <tr key={slot._id}>
                        <td>{slot.startTime} - {slot.endTime}</td>
                        <td>
                          <span style={{
                            backgroundColor: slot.isBooked ? '#e74c3c' : '#27ae60',
                            color: 'white',
                            padding: '3px 8px',
                            borderRadius: '3px',
                            fontSize: '11px'
                          }}>
                            {slot.isBooked ? 'Booked' : 'Available'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#7f8c8d', textAlign: 'center' }}>No slots for this date</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
