import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { User } from '../services/authService';
import { api } from '../services/api';
import type { HealthCheckResponse } from '../services/api';
import './Portal.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function Portal() {
  const [user, setUser] = useState<User | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
    checkHealth();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = authService.getUser();
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load user:', error);
      handleLogout();
    }
  };

  const checkHealth = async () => {
    try {
      const status = await api.healthCheck();
      setHealthStatus(status);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="portal-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="portal-container">
      <nav className="portal-navbar">
        <div className="navbar-brand">
          <h1>TARS Club Portal</h1>
        </div>
        <div className="navbar-user">
          <span className="user-name">
            Welcome, {user?.first_name || user?.username}!
          </span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <main className="portal-content">
        <div className="welcome-section">
          <h2>Welcome to TARS Club Member Portal</h2>
          <p>You have successfully logged in to the club management system.</p>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <h3>👤 Your Profile</h3>
            <div className="info-details">
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
              <p><strong>Role:</strong> {user?.is_staff ? 'Admin' : 'Member'}</p>
            </div>
          </div>

          <div className="info-card">
            <h3>🔧 System Status</h3>
            <div className="info-details">
              {healthStatus ? (
                <>
                  <p><strong>Backend:</strong> <span className="status-active">● Active</span></p>
                  <p><strong>Database:</strong> <span className="status-active">● {healthStatus.database}</span></p>
                  <p><strong>Service:</strong> {healthStatus.service}</p>
                </>
              ) : (
                <p>Checking system status...</p>
              )}
            </div>
          </div>

          <div className="info-card">
            <h3>📊 Quick Links</h3>
            <div className="info-details">
              <a href={`${API_BASE_URL}/admin/`} target="_blank" className="portal-link">
                Admin Dashboard →
              </a>
              <a href={`${API_BASE_URL}/api/health/`} target="_blank" className="portal-link">
                API Health Check →
              </a>
            </div>
          </div>

          <div className="info-card">
            <h3>ℹ️ Information</h3>
            <div className="info-details">
              <p>This is a secure member-only area of the TARS Club website.</p>
              <p>You can access club resources and manage your membership from here.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Portal;
