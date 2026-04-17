import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(!!localStorage.getItem('token'));
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      api.getMe(token).then(res => {
        if (res.success) {
          setUser(res.user);
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      }).finally(() => setInitializing(false));
    }
  }, []);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.register(userData);
      if (res.success) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      } else {
        setError(res.message);
        return { success: false, message: res.message };
      }
    } catch (err) {
      const message = 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      if (res.success) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true, role: res.user.role };
      } else {
        setError(res.message);
        return { success: false, message: res.message };
      }
    } catch (err) {
      const message = 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, initializing, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
