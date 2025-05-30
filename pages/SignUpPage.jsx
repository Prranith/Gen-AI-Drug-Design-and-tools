import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useParticleEffect from '../hooks/useParticleEffect';
import '../styles/SignupPage.css';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useParticleEffect('signup-wrapper');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (username && email && password) {
      setLoading(true);
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/register/send-otp',
          { username, email },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setMessage(response.data.message);
          localStorage.setItem("signupData", JSON.stringify({ email, password, username }));
          setTimeout(() => navigate('/verify-otp', { state: { email, password, username } }), 500);
        } else {
          setMessage(response.data.message || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error('Error during signup:', error);
        setMessage('An error occurred during signup. Please try again.');
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    } else {
      setMessage('All fields are required.');
    }
  };

  const navigateToLogin = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/login');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="signup-wrapper">
      {loading && (
        <div className="navigation-overlay">
          <div className="loader" />
        </div>
      )}
      <div className="signup-card">
        <div className="logo-container">
          <span className="logo-icon">🩺</span>
          <h2 className="signup-title">Gen-AI Med Diagnosis</h2>
          <p className="signup-subtitle">AI-Powered Medical Insights</p>
        </div>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="signup-input"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signup-input"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
              required
            />
          </div>
          <button type="submit" className="signup-button" disabled={loading}>
            Sign Up
          </button>
        </form>
        {message && <p className="signup-message">{message}</p>}
        <p className="signup-link-text" onClick={navigateToLogin}>
          Already have an account? Log in
        </p>
      </div>
    </div>
  );
};

export default SignupPage;