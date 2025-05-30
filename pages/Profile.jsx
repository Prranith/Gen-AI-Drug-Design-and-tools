import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useParticleEffect from '../hooks/useParticleEffect';
import '../styles/Profile.css';

const Profile = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [headerVisible, setHeaderVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useParticleEffect('profile-wrapper');

  useEffect(() => {
    const handleScroll = () => {
      setHeaderVisible(window.scrollY > 100);
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="profile-wrapper">
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <header className={`profile-header ${headerVisible ? 'visible' : ''}`}>
        <div className="logo-container">
          <span className="logo-icon">🩺</span>
          <h1>User Profile</h1>
        </div>
        <p>Manage your account and preferences</p>
      </header>

      <main className="profile-container">
        {isLoading ? (
          <div className="loading-skeleton">
            <div className="skeleton-card" />
          </div>
        ) : (
          <div
            className="profile-card"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleEditProfile()}
            aria-label="Edit profile"
          >
            <div className="profile-emoji" style={{ backgroundColor: '#26a69a' }}>
              👤
            </div>
            <h3>User Profile</h3>
            <p className="tooltip" data-tooltip="View and edit your personal information, including name, email, and preferences.">
              View and edit your personal information, including name, email, and preferences.
            </p>
            <button className="discover-button" onClick={handleEditProfile}>
              Edit Profile
            </button>
            <div className="neural-network">
              <div className="node node-1"></div>
              <div className="node node-2"></div>
              <div className="node node-3"></div>
              <div className="connection conn-1"></div>
              <div className="connection conn-2"></div>
              <div className="scan-pulse"></div>
            </div>
          </div>
        )}
      </main>

      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}

      <footer className="profile-footer">
        <p>
          © 2025 Gen-AI Med Diagnosis. Powered by{' '}
          <a href="https://x.ai" target="_blank" rel="noopener noreferrer" className="footer-link">
            xAI
          </a>.
        </p>
      </footer>
    </div>
  );
};

export default Profile;