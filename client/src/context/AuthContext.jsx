import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, updateProfile } from '../api/auth.js';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AdminCodeModal = ({ show, onSubmit, onClose, loading, error }) => {
  const [input, setInput] = useState('');
  useEffect(() => { if (!show) setInput(''); }, [show]);
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 32, minWidth: 340 }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.1em', marginBottom: 10 }}>Enter admin registration code</h3>
        <form onSubmit={e => { e.preventDefault(); onSubmit(input); }} style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Admin code (14 digits)"
            className="glass-input"
            style={{ flex: 1 }}
            maxLength={14}
            disabled={loading}
            autoFocus
          />
          <button type="submit" className="add-skill-btn" style={{ background: 'linear-gradient(45deg, #007bff, #00d4ff)', color: '#fff', border: 'none', borderRadius: 16, padding: '0 18px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }} disabled={loading || input.length !== 14}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={onClose} className="add-skill-btn" style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 16, padding: '0 18px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }} disabled={loading}>Skip</button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminModalLoading, setAdminModalLoading] = useState(false);
  const [adminModalError, setAdminModalError] = useState('');

  useEffect(() => {
    const portalAdminToken = localStorage.getItem('portalAdminToken');
    if (portalAdminToken) {
      setLoading(false);
      return;
    }

    // Check for OAuth token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get('token');
    
    if (oauthToken) {
      // Store the token and remove from URL
      localStorage.setItem('token', oauthToken);
      setToken(oauthToken);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Fetch user data with the token
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, {
            headers: { Authorization: `Bearer ${oauthToken}` }
          });
          if (response.data.success) {
            setUser(response.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserData();
      return;
    }

    // Check for existing JWT token
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      setToken(existingToken);
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, {
            headers: { Authorization: `Bearer ${existingToken}` }
          });
          if (response.data.success) {
            setUser(response.data.data);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserData();
      return;
    }

    // No token found, user is not authenticated
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && user.role !== 'admin' && !user.adminCode && !user.password) {
      setShowAdminModal(true);
    } else {
      setShowAdminModal(false);
    }
  }, [user]);

  const handleAdminCodeSubmit = async (code) => {
    setAdminModalError('');
    setAdminModalLoading(true);
    try {
      const res = await updateProfile({ adminCode: code });
      if (res.data.success) {
        // Optionally, update role to admin if backend does so
        const refreshed = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, { withCredentials: true });
        setUser(refreshed.data.data);
        setShowAdminModal(false);
        window.location.reload();
      } else {
        setAdminModalError(res.data.message || 'Failed to update admin code.');
      }
    } catch (err) {
      setAdminModalError('Network error.');
    } finally {
      setAdminModalLoading(false);
    }
  };

  const login = async (email, password, role) => {
    try {
      const response = await loginUser(email, password, role);
      const { token: newToken, data: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await registerUser(name, email, password, role);
      const { token: newToken, data: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      <AdminCodeModal
        show={showAdminModal}
        onSubmit={handleAdminCodeSubmit}
        onClose={() => setShowAdminModal(false)}
        loading={adminModalLoading}
        error={adminModalError}
      />
      {children}
    </AuthContext.Provider>
  );
}; 