import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const emptyForm = {
  name: '', email: '', password: '', phone: '', gender: 'male',
  department: '', specialization: '', experience: '', qualifications: '', consultationFee: '', bio: ''
};

const AdminDoctors = () => {
  const { logout, token } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [docsRes, deptsRes] = await Promise.all([api.getDoctors(), api.getDepartments()]);
    if (docsRes.success) setDoctors(docsRes.data || []);
    if (deptsRes.success) setDepartments(deptsRes.data || []);
    setLoading(false);
  };

  const openCreate = () => {
    setEditingDoc(null);
    setForm(emptyForm);
    setShowForm(true);
    setError(''); setSuccess('');
  };

  const openEdit = (doc) => {
    setEditingDoc(doc);
    setForm({
      name: doc.user?.name || '',
      email: doc.user?.email || '',
      password: '',
      phone: doc.user?.phone || '',
      gender: doc.user?.gender || 'male',
      department: doc.department?._id || '',
      specialization: doc.specialization || '',
      experience: doc.experience || '',
      qualifications: doc.qualifications || '',
      consultationFee: doc.consultationFee || '',
      bio: doc.bio || ''
    });
    setShowForm(true);
    setError(''); setSuccess('');
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.department || !form.specialization) {
      setError('Name, department and specialization are required'); return;
    }
    if (!editingDoc && (!form.email || !form.password)) {
      setError('Email and password are required for new doctors'); return;
    }
    setSaving(true); setError('');
    let res;
    if (editingDoc) {
      const { email, password, ...updateData } = form;
      res = await api.updateDoctor(editingDoc._id, updateData, token);
    } else {
      res = await api.createDoctor(form, token);
    }
    if (res.success) {
      setSuccess(editingDoc ? 'Doctor updated!' : 'Doctor created!');
      setShowForm(false);
      loadData();
    } else {
      setError(res.message || 'Operation failed');
    }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove Dr. ${name} from availability?`)) return;
    setError(''); setSuccess('');
    const res = await api.deleteDoctor(id, token);
    if (res.success) { setSuccess('Doctor removed from availability.'); loadData(); }
    else setError(res.message || 'Delete failed');
  };

  return (
    <div>
      <nav className="navbar">
        <div><h3>🏥 Admin — Doctors</h3></div>
        <div className="nav-links">
          <Link to="/admin/dashboard">🏠 Dashboard</Link>
          <Link to="/admin/departments">🏢 Departments</Link>
          <Link to="/admin/appointments">📅 Appointments</Link>
          <span style={{ cursor: 'pointer' }} onClick={logout}>🚪 Logout</span>
        </div>
      </nav>

      <div className="page">
        <div className="container">
          <div className="flex-between mb-20">
            <h1 className="page-title" style={{ marginBottom: 0 }}>👨‍⚕️ Manage Doctors</h1>
            <button onClick={openCreate}>+ Add Doctor</button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {showForm && (
            <div className="card">
              <div className="card-header">{editingDoc ? `Edit Dr. ${editingDoc.user?.name}` : 'New Doctor'}</div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Dr. John Smith" />
                </div>
                {!editingDoc && (
                  <div className="form-group">
                    <label>Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="doctor@hospital.com" />
                  </div>
                )}
                {!editingDoc && (
                  <div className="form-group">
                    <label>Password *</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" />
                  </div>
                )}
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select name="department" value={form.department} onChange={handleChange}>
                    <option value="">-- Select Department --</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Specialization *</label>
                  <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="e.g. Cardiologist" />
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input name="experience" type="number" value={form.experience} onChange={handleChange} placeholder="e.g. 10" />
                </div>
                <div className="form-group">
                  <label>Consultation Fee (₹)</label>
                  <input name="consultationFee" type="number" value={form.consultationFee} onChange={handleChange} placeholder="e.g. 500" />
                </div>
                <div className="form-group">
                  <label>Qualifications</label>
                  <input name="qualifications" value={form.qualifications} onChange={handleChange} placeholder="e.g. MBBS, MD" />
                </div>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Short bio about the doctor" />
              </div>
              <div className="flex">
                <button onClick={handleSubmit} disabled={saving}>
                  {saving ? 'Saving...' : (editingDoc ? 'Update Doctor' : 'Create Doctor')}
                </button>
                <button className="danger" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : doctors.length === 0 ? (
            <div className="card"><p style={{ color: '#7f8c8d' }}>No doctors found. Add one above.</p></div>
          ) : (
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Department</th>
                    <th>Experience</th>
                    <th>Fee</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(doc => (
                    <tr key={doc._id}>
                      <td>
                        <strong>Dr. {doc.user?.name}</strong>
                        <div style={{ fontSize: 12, color: '#7f8c8d' }}>{doc.user?.email}</div>
                      </td>
                      <td>{doc.specialization}</td>
                      <td>{doc.department?.name || '—'}</td>
                      <td>{doc.experience ? `${doc.experience} yrs` : '—'}</td>
                      <td>{doc.consultationFee ? `₹${doc.consultationFee}` : '—'}</td>
                      <td>
                        <div className="flex">
                          <button onClick={() => openEdit(doc)} style={{ padding: '6px 14px', fontSize: 13 }}>✏️ Edit</button>
                          <button className="danger" onClick={() => handleDelete(doc._id, doc.user?.name)} style={{ padding: '6px 14px', fontSize: 13 }}>🗑️ Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors;
