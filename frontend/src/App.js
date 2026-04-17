import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import Prescriptions from './pages/Prescriptions';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorSchedule from './pages/DoctorSchedule';
import DoctorAppointments from './pages/DoctorAppointments';
import AdminDashboard from './pages/AdminDashboard';
import AdminDepartments from './pages/AdminDepartments';
import AdminDoctors from './pages/AdminDoctors';
import AdminAppointments from './pages/AdminAppointments';

import './index.css';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient */}
      <Route path="/patient/dashboard" element={<ProtectedRoute element={<PatientDashboard />} roles={['patient']} />} />
      <Route path="/patient/book-appointment" element={<ProtectedRoute element={<BookAppointment />} roles={['patient']} />} />
      <Route path="/patient/my-appointments" element={<ProtectedRoute element={<MyAppointments />} roles={['patient']} />} />
      <Route path="/patient/prescriptions" element={<ProtectedRoute element={<Prescriptions />} roles={['patient']} />} />

      {/* Doctor */}
      <Route path="/doctor/dashboard" element={<ProtectedRoute element={<DoctorDashboard />} roles={['doctor']} />} />
      <Route path="/doctor/schedule" element={<ProtectedRoute element={<DoctorSchedule />} roles={['doctor']} />} />
      <Route path="/doctor/appointments" element={<ProtectedRoute element={<DoctorAppointments />} roles={['doctor']} />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} roles={['admin']} />} />
      <Route path="/admin/departments" element={<ProtectedRoute element={<AdminDepartments />} roles={['admin']} />} />
      <Route path="/admin/doctors" element={<ProtectedRoute element={<AdminDoctors />} roles={['admin']} />} />
      <Route path="/admin/appointments" element={<ProtectedRoute element={<AdminAppointments />} roles={['admin']} />} />

      {/* Default */}
      <Route
        path="/"
        element={
          user ? (
            user.role === 'patient' ? <Navigate to="/patient/dashboard" /> :
            user.role === 'doctor' ? <Navigate to="/doctor/dashboard" /> :
            user.role === 'admin' ? <Navigate to="/admin/dashboard" /> :
            <Navigate to="/login" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
