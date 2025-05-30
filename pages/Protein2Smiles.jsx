import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RDKitMolecule from './RDKitMolecule'; // Adjust path as needed
import Navbar from '../components/Navbar';
import useParticleEffect from '../hooks/useParticleEffect';
import '../styles/Protein2Smiles.css';

const Protein2Smiles = ({ isAuthenticated, onLogout }) => {
  const [activeTab, setActiveTab] = useState('input');
  const [inputData, setInputData] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useParticleEffect('hub-wrapper');

  useEffect(() => {
    const handleScroll = () => {
      setHeaderVisible(window.scrollY > 100);
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePrediction = async () => {
    if (!inputData.trim()) {
      setError('Please enter a protein sequence.');
      return;
    }

    try {
      setError(null);
      const response = await axios.post('http://localhost:5000/api/protein2smiles', {
        state: inputData,
      });
      console.log('Backend response:', response.data);
      setResult(response.data);
      setActiveTab('results');
      setCurrentSlide(0);
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setError('Failed to get prediction. Please try again.');
    }
  };

  const resultsArray = result && result.top_results
    ? Array.isArray(result.top_results)
      ? result.top_results.slice(0, 5)
      : [result.top_results]
    : [];

  const handleNextSlide = () => {
    if (resultsArray.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % resultsArray.length);
    }
  };

  const handlePrevSlide = () => {
    if (resultsArray.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + resultsArray.length) % resultsArray.length);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPanel = () => {
    switch (activeTab) {
      case 'input':
        return (
          <div className="feature-card input-panel" style={{ '--card-index': 0 }}>
            <div className="feature-emoji" style={{ backgroundColor: '#26a69a' }}>🧬</div>
            <h3>Protein to SMILES</h3>
            <p>Enter a protein sequence to predict its SMILES representation.</p>
            <textarea
              className="textarea"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Enter protein (e.g., MM)"
            />
            <button className="discover-button predict-button" onClick={handlePrediction}>
              Predict
            </button>
            {error && (
              <div className="error tooltip" data-tooltip={error}>
                {error}
              </div>
            )}
            <div className="neural-network">
              <div className="node node-1"></div>
              <div className="node node-2"></div>
              <div className="node node-3"></div>
              <div className="connection conn-1"></div>
              <div className="connection conn-2"></div>
              <div className="scan-pulse"></div>
            </div>
          </div>
        );
      case 'results':
        return (
          <div className="results-container">
            {resultsArray.length > 0 ? (
              <div className="feature-card result-item" style={{ '--card-index': 0 }}>
                <div className="feature-emoji" style={{ backgroundColor: '#66bb6a' }}>
                  🧪
                </div>
                <h3>Prediction Result</h3>
                <div className="molecule-container">
                  <RDKitMolecule
                    smiles={resultsArray[currentSlide].SMILES || ''}
                    width={250}
                    height={200}
                  />
                </div>
                <p><strong>SMILES:</strong> {resultsArray[currentSlide].SMILES || 'N/A'}</p>
                {resultsArray.length > 1 && (
                  <div className="carousel-controls">
                    <button
                      className="carousel-arrow left"
                      onClick={handlePrevSlide}
                      aria-label="Previous result"
                    >
                      ❮
                    </button>
                    <span className="carousel-indicator">
                      {currentSlide + 1} / {resultsArray.length}
                    </span>
                    <button
                      className="carousel-arrow right"
                      onClick={handleNextSlide}
                      aria-label="Next result"
                    >
                      ❯
                    </button>
                  </div>
                )}
                <div className="neural-network">
                  <div className="node node-1"></div>
                  <div className="node node-2"></div>
                  <div className="node node-3"></div>
                  <div className="connection conn-1"></div>
                  <div className="connection conn-2"></div>
                  <div className="scan-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="feature-card no-results" style={{ '--card-index': 0 }}>
                <p>No results to display.</p>
              </div>
            )}
            {error && (
              <div className="error tooltip" data-tooltip={error}>
                {error}
              </div>
            )}
            <button className="discover-button retry-button" onClick={() => setActiveTab('input')}>
              Try Another Sequence
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="hub-wrapper">
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <header className={`hub-header ${headerVisible ? 'visible' : ''}`}>
        <div className="logo-container">
          <span className="logo-icon">🧬</span>
          <h1>Protein to SMILES</h1>
        </div>
        <p>Enter a protein sequence to predict its SMILES representation using AI.</p>
      </header>
      <main className="tab-nav-container">
        <div className="tab-nav">
          <button
            className={`discover-button ${activeTab === 'input' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('input')}
          >
            Input
          </button>
          <button
            className={`discover-button ${activeTab === 'results' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('results')}
            disabled={!result}
          >
            Results
          </button>
        </div>
        {renderPanel()}
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
        <p>
          © 2025 Protein to SMILES. Powered by{' '}
          <a href="https://x.ai" target="_blank" rel="noopener noreferrer" className="footer-link">
            xAI
          </a>.
        </p>
      </footer>
    </div>
  );
};

export default Protein2Smiles;