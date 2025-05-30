import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useParticleEffect from '../hooks/useParticleEffect';
import '../styles/LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useParticleEffect('med-auth-wrapper');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username && password) {
      setLoading(true);
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/login',
          { username, password },
          { withCredentials: true }
        );

        if (response.data.success) {
          setMessage('Login successful!');
          onLoginSuccess(response.data.token);
          setTimeout(() => navigate('/dashboard'), 500);
        } else {
          setMessage('Invalid credentials.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setMessage('An error occurred. Please try again.');
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    } else {
      setMessage('Please enter both username and password.');
    }
  };

  const handleSignUpRedirect = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/signup');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="med-auth-wrapper">
      {loading && (
        <div className="navigation-overlay">
          <div className="loader" />
        </div>
      )}
      <div className="med-auth-card">
        <div className="logo-container">
          <span className="logo-icon">🩺</span>
          <h2 className="auth-title">Gen-AI Med Diagnosis</h2>
          <p className="auth-subtitle">AI-Powered Medical Insights</p>
        </div>
        <div className="tab-nav">
          <button className="tab-active">Login</button>
          <button onClick={handleSignUpRedirect}>Signup</button>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;