import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [headerVisible, setHeaderVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const sections = [
    {
      title: 'Denova Drug Analysis',
      description: 'Generate novel drug candidates and optimize their properties using advanced Reinforcement Learning algorithms.',
      path: '/reinforcement',
      emoji: '🧪',
      color: '#26a69a',
    },
    {
      title: 'Tumor Detection on CT Scan',
      description: 'Analyze medical images and patient data with cutting-edge AI for rapid and accurate diagnoses.',
      path: '/diagnosis',
      emoji: '❤️',
      color: '#ff8a65',
    },
    {
      title: 'Protein to SMILES Prediction',
      description: 'Utilize AI models to predict the SMILES representation of a molecule based on its protein sequence input.',
      path: '/protein2smiles',
      emoji: '💻',
      color: '#66bb6a',
    },
    {
      title: 'Auto Docking Visualization',
      description: 'Simulate the interaction between small molecules and protein structures to predict binding affinities.',
      path: '/docking',
      emoji: '⚛️',
      color: '#ab47bc',
    },
    {
      title: 'Ligand Prediction',
      description: 'Explore the chemical language model for various downstream tasks, including masked molecule prediction.',
      path: '/masking',
      emoji: '💡',
      color: '#ff6f61',
    },
    {
      title: '3D Protein Visualization',
      description: 'Visualize and analyze 3D protein structures to understand their properties and interactions.',
      path: '/protein',
      emoji: '📊',
      color: '#42a5f5',
    },
    {
      title: 'Medical Image Viewer',
      description: 'Visualize original medical images like MRI, CT scans directly in your browser using Papaya Viewer.',
      path: 'http://localhost:8000/papaya/original',
      emoji: '🧠',
      color: '#f48fb1',
    },
    {
      title: '3D Diagnosis',
      description: 'Experience immersive 3D visualization of diagnostic medical data for deeper analysis.',
      path: '/visualization',
      emoji: '🧬',
      color: '#81d4fa',
    },
    {
      title: 'Active/Inactive Drug Predictor',
      description: 'Predict whether a drug molecule is active, inactive, or intermediate based on its SMILES string.',
      path: '/vit',
      emoji: '🔬',
      color: '#ffa726',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setHeaderVisible(window.scrollY > 100);
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCardClick = (path) => {
    setIsNavigating(true);
    setTimeout(() => {
      if (path.startsWith('http')) {
        window.location.href = path;
      } else {
        navigate(path);
      }
      setIsNavigating(false);
    }, 300); // Match CSS transition duration
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="hub-wrapper">
      <header className={`hub-header ${headerVisible ? 'visible' : ''}`}>
        <div className="logo-container">
          <span className="logo-icon">🩺</span>
          <h1>Gen-AI Med Diagnosis</h1>
        </div>
        <p>Explore AI-powered tools for pharmaceutical innovation</p>
      </header>

      <main className="cards-container">
        {sections.map((section, index) => (
          <div
            key={index}
            className="feature-card"
            onClick={() => handleCardClick(section.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick(section.path)}
            aria-label={`Navigate to ${section.title}`}
            style={{ '--card-index': index }}
          >
            <div className="feature-emoji" style={{ backgroundColor: section.color }}>
              {section.emoji}
            </div>
            <h3>{section.title}</h3>
            <p className="tooltip" data-tooltip={section.description}>
              {section.description}
            </p>
            <button className="discover-button">Discover</button>
            <div className="neural-network">
              <div className="node node-1"></div>
              <div className="node node-2"></div>
              <div className="node node-3"></div>
              <div className="connection conn-1"></div>
              <div className="connection conn-2"></div>
              <div className="scan-pulse"></div>
            </div>
          </div>
        ))}
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

      <footer className="hub-footer">
        <p>© 2025 Gen-AI Med Diagnosis. Powered by xAI.</p>
      </footer>

      {isNavigating && <div className="navigation-overlay"></div>}
    </div>
  );
};

export default Dashboard;