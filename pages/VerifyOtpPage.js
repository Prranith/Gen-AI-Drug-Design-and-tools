import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/VerifyOtpPage.css';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { username, email, password } = state || {};

  useEffect(() => {
    if (!email) {
      setMessage('No email provided. Please sign up again.');
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp) {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/verify-otp',
          { email, otp, username, password },
          { withCredentials: true }
        );
        if (response.status === 200) {
          const { token, message: msg } = response.data;
          setMessage(msg || 'Verification successful!');
          if (token) {
            localStorage.setItem('authToken', token); // Store token for authentication
            navigate('/dashboard'); // Redirect to main page as logged in
          } else {
            setMessage('No token received. Please log in.');
            navigate('/login');
          }
        } else {
          setMessage(response.data.message || 'Invalid OTP. Please try again.');
        }
      } catch (error) {
        console.error('Error during OTP verification:', error);
        setMessage('An error occurred during verification. Please try again.');
      }
    } else {
      setMessage('Please enter the OTP.');
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-overlay"></div>
      <div className="verify-otp-form-container">
        <h2 className="verify-otp-title">Verify Your Email</h2>
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="verify-otp-input"
            required
          />
          <button type="submit" className="verify-otp-button">
            Verify OTP
          </button>
        </form>
        {message && <p className="verify-otp-message">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyOtpPage;