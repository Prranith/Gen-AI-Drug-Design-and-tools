import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css'; // Ensure correct path to your CSS file
const LandingPage = () => {
  return (
    <div className="landing-wrapper">
      <div className="landing-overlay"></div>
      <header className="landing-header" role="banner">
        <div className="header-container">
          <div className="brand-container">
            <span className="logo-icon">🩺</span>
            <h1 className="landing-brand">Gen-AI Med Diagnosis</h1>
          </div>
          <nav className="landing-nav" aria-label="Main navigation">
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/solutions" className="nav-link">Solutions</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>
        </div>
      </header>
      <main className="hero-section" role="main">
        <div className="hero-content">
          <h2 className="landing-title">AI Diagnostics Redefined</h2>
          <p className="landing-tagline">
            Precision AI for transformative healthcare insights.
          </p>
          <div className="landing-button-container">
            <Link
              to="/login"
              className="landing-button primary"
              aria-label="Start diagnostics with Gen-AI Med Diagnosis"
            >
              Launch Now
            </Link>
            <Link
              to="/signup"
              className="landing-button secondary"
              aria-label="Explore Gen-AI Med Diagnosis features"
            >
              Discover Features
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="neural-network">
            <div className="node node-1"></div>
            <div className="node node-2"></div>
            <div className="node node-3"></div>
            <div className="node node-4"></div>
            <div className="connection conn-1"></div>
            <div className="connection conn-2"></div>
            <div className="connection conn-3"></div>
            <div className="scan-pulse"></div>
          </div>
        </div>
      </main>
      <section className="trust-section" aria-label="Trust and credibility">
        <p className="trust-text">Trusted by 15,000+ healthcare professionals</p>
      </section>
      <footer className="landing-footer" role="contentinfo">
        <p>Gen-AI Med Diagnosis © 2025</p>
      </footer>
    </div>
  );
};

export default LandingPage;