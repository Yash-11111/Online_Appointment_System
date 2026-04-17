import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminDepartments = () => {
  const { logout, token } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadDepartments(); }, []);

  const loadDepartments = async () => {
    setLoading(true);
    const res = await api.getDepartments();
    if (res.success) setDepartments(res.data || []);
    else setError('Failed to load departments');
    setLoading(false);
  };

  const openCreate = () => {
    setEditingDept(null);
    setForm({ name: '', description: '' });
    setShowForm(true);
    setError(''); setSuccess('');
  };

  const openEdit = (dept) => {
    setEditingDept(dept);
    setForm({ name: dept.name, description: dept.description || '' });
    setShowForm(true);
    setError(''); setSuccess('');
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Department name is required'); return; }
    setSaving(true); setError('');
    let res;
    if (editingDept) {
      res = await api.updateDepartment(editingDept._id, form, token);
    } else {
      res = await api.createDepartment(form, token);
    }
    if (res.success) {
      setSuccess(editingDept ? 'Department updated!' : 'Department created!');
      setShowForm(false);
      loadDepartments();
    } else {
      setError(res.message || 'Operation failed');
    }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete department "${name}"? This may affect linked doctors and appointments.`)) return;
    setError(''); setSuccess('');
    const res = await api.deleteDepartment(id, token);
    if (res.success) { setSuccess('Department deleted.'); loadDepartments(); }
    else setError(res.message || 'Delete failed');
  };

  return (
    <div>
      <nav className="navbar">
        <div><h3>🏥 Admin — Departments</h3></div>
        <div className="nav-links">
          <Link to="/admin/dashboard">🏠 Dashboard</Link>
          <Link to="/admin/doctors">👨‍⚕️ Doctors</Link>
          <Link to="/admin/appointments">📅 Appointments</Link>
          <span style={{ cursor: 'pointer' }} onClick={logout}>🚪 Logout</span>
        </div>
      </nav>

      <div className="page">
        <div className="container">
          <div className="flex-between mb-20">
            <h1 className="page-title" style={{ marginBottom: 0 }}>🏢 Manage Departments</h1>
            <button onClick={openCreate}>+ Add Department</button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {showForm && (
            <div className="card">
              <div className="card-header">{editingDept ? 'Edit Department' : 'New Department'}</div>
              <div className="form-group">
                <label>Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Cardiology"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of this department"
                  rows={3}
                />
              </div>
              <div className="flex">
                <button onClick={handleSubmit} disabled={saving}>
                  {saving ? 'Saving...' : (editingDept ? 'Update' : 'Create')}
                </button>
                <button className="danger" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : departments.length === 0 ? (
            <div className="card"><p style={{ color: '#7f8c8d' }}>No departments found. Add one above.</p></div>
          ) : (
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept, i) => (
                    <tr key={dept._id}>
                      <td>{i + 1}</td>
                      <td><strong>{dept.name}</strong></td>
                      <td style={{ color: '#7f8c8d' }}>{dept.description || '—'}</td>
                      <td>
                        <div className="flex">
                          <button onClick={() => openEdit(dept)} style={{ padding: '6px 14px', fontSize: 13 }}>✏️ Edit</button>
                          <button className="danger" onClick={() => handleDelete(dept._id, dept.name)} style={{ padding: '6px 14px', fontSize: 13 }}>🗑️ Delete</button>
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

export default AdminDepartments;
