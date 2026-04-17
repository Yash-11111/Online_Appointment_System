const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = {
  // Auth
  register: (data) => fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  login: (email, password) => fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(r => r.json()),   

  getMe: (token) => fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),

  // Departments
  getDepartments: () => fetch(`${API_URL}/departments`).then(r => r.json()),

  createDepartment: (data, token) => fetch(`${API_URL}/departments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  updateDepartment: (id, data, token) => fetch(`${API_URL}/departments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  deleteDepartment: (id, token) => fetch(`${API_URL}/departments/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),

  // Doctors
  getDoctors: (departmentId) => {
    const url = departmentId
      ? `${API_URL}/doctors?department=${departmentId}`
      : `${API_URL}/doctors`;
    return fetch(url).then(r => r.json());
  },

  getDoctor: (id) => fetch(`${API_URL}/doctors/${id}`).then(r => r.json()),

  createDoctor: (data, token) => fetch(`${API_URL}/doctors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  updateDoctor: (id, data, token) => fetch(`${API_URL}/doctors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  deleteDoctor: (id, token) => fetch(`${API_URL}/doctors/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),

  // Slots
  getSlots: (doctorId, date) => fetch(
    `${API_URL}/slots?doctor=${doctorId}&date=${date}`
  ).then(r => r.json()),

  createSlots: (data, token) => fetch(`${API_URL}/slots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  getMySlots: (token, date) => {
    const url = date ? `${API_URL}/slots/my-slots?date=${date}` : `${API_URL}/slots/my-slots`;
    return fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());
  },

  // Appointments
  bookAppointment: (data, token) => fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  getMyAppointments: (token) => fetch(`${API_URL}/appointments/my-appointments`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),

  getDoctorAppointments: (token, date) => {
    const url = date
      ? `${API_URL}/appointments/doctor-appointments?date=${date}`
      : `${API_URL}/appointments/doctor-appointments`;
    return fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());
  },

  getAllAppointments: (token) => fetch(`${API_URL}/appointments`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),

  cancelAppointment: (id, reason, token) => fetch(`${API_URL}/appointments/${id}/cancel`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ reason })
  }).then(r => r.json()),

  updateAppointmentStatus: (id, status, token) => fetch(`${API_URL}/appointments/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status })
  }).then(r => r.json()),

  // Prescriptions
  createPrescription: (data, token) => fetch(`${API_URL}/prescriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  getMyPrescriptions: (token) => fetch(`${API_URL}/prescriptions/my-prescriptions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),

  getPrescriptionByAppointment: (appointmentId, token) => fetch(
    `${API_URL}/prescriptions/appointment/${appointmentId}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  ).then(r => r.json()),
};

export default api;
