import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TumorAnalysisSelector.css';

const TumorAnalysisSelector = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (path) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 500); // Matches CSS transition
  };

  // Particle background effect
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    document.querySelector('.tumor-analysis-wrapper').prepend(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.01;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.size <= 0.2) {
          particles.splice(index, 1);
          particles.push(new Particle());
        }
      });
      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.remove();
    };
  }, []);

  return (
    <div className="tumor-analysis-wrapper">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <span className="logo-icon">🩺</span>
          <h1>Gen-AI Med Diagnosis</h1>
        </div>
        <button
          onClick={() => handleNavigation('/dashboard')}
          className="back-button"
          aria-label="Back to Dashboard"
        >
          <span className="back-icon">←</span>
          <span className="back-text">Dashboard</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-card">
          <h1 className="main-title">Tumor Analysis</h1>
          <p className="main-description">
            Harness cutting-edge AI to detect and visualize brain or lung tumors with unparalleled accuracy. Select 2D or 3D analysis to proceed.
          </p>
          <div className="options-grid">
            {/* 2D Analysis Card */}
            <div
              className="option-card"
              onClick={() => handleNavigation('/diagnosis')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigation('/diagnosis')}
              aria-label="Select 2D Tumor Analysis"
            >
              <div className="card-overlay" />
              <span className="option-icon">🖼️</span>
              <h3 className="option-title">2D Analysis</h3>
              <p className="option-description">
                Analyze MRI or CT scan images to identify tumor regions using AI-driven segmentation.
              </p>
              <span className="option-cta">Explore 2D →</span>
            </div>

            {/* 3D Analysis Card */}
            <div
              className="option-card"
              onClick={() => handleNavigation('/visualization')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigation('/visualization')}
              aria-label="Select 3D Tumor Analysis"
            >
              <div className="card-overlay" />
              <span className="option-icon">📐</span>
              <h3 className="option-title">3D Analysis</h3>
              <p className="option-description">
                Visualize NIfTI files in 3D to explore tumor structures with advanced volumetric rendering.
              </p>
              <span className="option-cta">Explore 3D →</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          © 2025 Gen-AI Med Diagnosis. Powered by{' '}
          <a href="https://x.ai" target="_blank" rel="noopener noreferrer" className="footer-link">
            xAI
          </a>
          .
        </p>
      </footer>

      {/* Navigation Overlay */}
      {isNavigating && (
        <div className="navigation-overlay">
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

export default TumorAnalysisSelector;