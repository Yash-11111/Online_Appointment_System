import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    departmentId: '',
    doctorId: '',
    date: '',
    slotId: '',
    type: 'normal',
    reason: ''
  });

  // Load departments
  useEffect(() => {
    api.getDepartments().then(res => {
      if (res.success) setDepartments(res.data);
    });
  }, []);

  // Load doctors when department selected
  useEffect(() => {
    if (form.departmentId) {
      api.getDoctors(form.departmentId).then(res => {
        if (res.success) setDoctors(res.data);
        setForm(prev => ({ ...prev, doctorId: '', date: '', slotId: '' }));
      });
    }
  }, [form.departmentId]);

  // Load slots when doctor and date selected
  useEffect(() => {
    if (form.doctorId && form.date) {
      setLoading(true);
      api.getSlots(form.doctorId, form.date).then(res => {
        if (res.success) setSlots(res.data || []);
        else setError('No slots available for this date');
        setLoading(false);
      });
    }
  }, [form.doctorId, form.date]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!form.doctorId || !form.slotId) {
      setError('Please complete all steps');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.bookAppointment({
        doctorId: form.doctorId,
        slotId: form.slotId,
        departmentId: form.departmentId,
        type: form.type,
        reason: form.reason
      }, token);

      if (res.success) {
        setSuccess('Appointment booked successfully!');
        setTimeout(() => navigate('/patient/my-appointments'), 1500);
      } else {
        setError(res.message || 'Booking failed');
      }
    } catch (err) {
      setError('Booking failed');
    }
    setLoading(false);
  };

  const doctor = doctors.find(d => d._id === form.doctorId);

  return (
    <div>
      <nav className="navbar">
        <div><h3>📅 Book Appointment</h3></div>
        <div className="nav-links">
          <a href="/patient/dashboard">← Back</a>
        </div>
      </nav>

      <div className="page">
        <div className="container" style={{ maxWidth: '600px' }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleBooking}>
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <div key={s} style={{
                    padding: '10px 15px',
                    borderRadius: '50%',
                    backgroundColor: step >= s ? '#3498db' : '#ecf0f1',
                    color: step >= s ? 'white' : '#7f8c8d',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    {s}
                  </div>
                ))}
              </div>

              {/* Step 1: Department */}
              {step === 1 && (
                <div className="form-group">
                  <label>Select Department</label>
                  <select name="departmentId" value={form.departmentId} onChange={handleInputChange} required>
                    <option value="">-- Choose Department --</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Step 2: Doctor */}
              {step === 2 && (
                <div className="form-group">
                  <label>Select Doctor</label>
                  <select name="doctorId" value={form.doctorId} onChange={handleInputChange} required>
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map(doc => (
                      <option key={doc._id} value={doc._id}>
                        Dr. {doc.user.name} - {doc.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Step 3: Date */}
              {step === 3 && (
                <div className="form-group">
                  <label>Select Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              )}

              {/* Step 4: Time Slot */}
              {step === 4 && (
                <div className="form-group">
                  <label>Available Slots</label>
                  {loading ? (
                    <p>Loading slots...</p>
                  ) : slots.length > 0 ? (
                    <select name="slotId" value={form.slotId} onChange={handleInputChange} required>
                      <option value="">-- Choose Slot --</option>
                      {slots.map(slot => (
                        <option key={slot._id} value={slot._id}>
                          {slot.startTime} - {slot.endTime}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p style={{ color: '#e74c3c' }}>No slots available</p>
                  )}
                </div>
              )}

              {/* Step 5: Details */}
              {step === 5 && (
                <>
                  <div className="form-group">
                    <label>Appointment Type</label>
                    <select name="type" value={form.type} onChange={handleInputChange}>
                      <option value="normal">Normal</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Reason for Visit</label>
                    <textarea
                      name="reason"
                      value={form.reason}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Describe your symptoms or reason for visit"
                    />
                  </div>
                  <div className="card">
                    <div className="card-header">Appointment Summary</div>
                    <p><strong>Department:</strong> {departments.find(d => d._id === form.departmentId)?.name}</p>
                    <p><strong>Doctor:</strong> Dr. {doctor?.user.name}</p>
                    <p><strong>Date:</strong> {form.date}</p>
                    <p><strong>Time:</strong> {slots.find(s => s._id === form.slotId)?.startTime} - {slots.find(s => s._id === form.slotId)?.endTime}</p>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)}>← Previous</button>
              )}
              {step < 5 && (
                <button type="button" onClick={() => setStep(step + 1)}>Next →</button>
              )}
              {step === 5 && (
                <button type="submit" disabled={loading}>
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
