import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useParticleEffect from '../hooks/useParticleEffect';
import '../styles/LogP.css';

const predefinedSmiles = [
  { name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
  { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' },
  { name: 'Ibuprofen', smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O' },
  { name: 'Paracetamol', smiles: 'CC(=O)Nc1ccc(cc1)O' },
  { name: 'Ethanol', smiles: 'CCO' },
];

const LogP = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [selectedSmiles, setSelectedSmiles] = useState('');
  const [customSmiles, setCustomSmiles] = useState('');
  const [usePredefined, setUsePredefined] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
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

  const handlePredefinedChange = (event) => {
    setSelectedSmiles(event.target.value);
    setCustomSmiles('');
    setError(null);
  };

  const handleCustomChange = (event) => {
    setCustomSmiles(event.target.value);
    setSelectedSmiles('');
    setUsePredefined(false);
    setError(null);
  };

  const handleToggleInput = (event) => {
    setUsePredefined(event.target.value === 'predefined');
    setCustomSmiles('');
    setSelectedSmiles('');
    setError(null);
  };

  const getCurrentInput = () => {
    return usePredefined ? selectedSmiles : customSmiles;
  };

  const handlePrediction = async () => {
    const currentInput = getCurrentInput();
    if (!currentInput) {
      setError('Please select a predefined SMILES or enter a custom one.');
      setResult(null);
      return;
    }

    setIsNavigating(true);
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post('http://localhost:5000/api/reinforcement/logp', {
        state: currentInput,
      });
      setResult(response.data);
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setError('Failed to get prediction. Please check the SMILES input or try again later.');
      setResult(null);
    } finally {
      setIsNavigating(false);
      setIsLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPanel = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="feature-card info-panel" style={{ '--card-index': 0 }}>
            <div className="feature-emoji" style={{ backgroundColor: '#26a69a' }}>🧪</div>
            <h3>Understanding LogP</h3>
            <p>
              <strong>What is LogP?</strong> LogP (Octanol-Water Partition Coefficient) measures a compound's lipophilicity, indicating how it distributes between octanol (lipid-like) and water (aqueous). It’s defined as:
            </p>
            <p className="equation">LogP = log<sub>10</sub> ([Solute]<sub>octanol</sub> / [Solute]<sub>water</sub>)</p>
            <h3>Why is LogP Important?</h3>
            <ul>
              <li>Predicts drug absorption and bioavailability.</li>
              <li>Guides optimization of drug-like properties.</li>
              <li>Balances lipophilicity and hydrophilicity for effective drug design.</li>
            </ul>
            <p>This model generates molecules with optimized LogP values for drug-like properties.</p>
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
      case 'input':
        return (
          <div className="feature-card input-panel" style={{ '--card-index': 0 }}>
            <div className="feature-emoji" style={{ backgroundColor: '#ff6f61' }}>💻</div>
            <h3>Predict LogP with Deep Reinforcement Learning</h3>
            <p>Select a predefined molecule or enter a custom SMILES string to predict and optimize LogP.</p>
            <div className="input-toggle">
              <label>
                <input
                  type="radio"
                  value="predefined"
                  checked={usePredefined}
                  onChange={handleToggleInput}
                />
                Predefined
              </label>
              <label>
                <input
                  type="radio"
                  value="custom"
                  checked={!usePredefined}
                  onChange={handleToggleInput}
                />
                Custom
              </label>
            </div>
            {usePredefined ? (
              <select
                className="select-smiles"
                value={selectedSmiles}
                onChange={handlePredefinedChange}
              >
                <option value="">Select a Molecule</option>
                {predefinedSmiles.map((item, index) => (
                  <option key={index} value={item.smiles}>
                    {item.name} ({item.smiles})
                  </option>
                ))}
              </select>
            ) : (
              <textarea
                className="textarea"
                value={customSmiles}
                onChange={handleCustomChange}
                placeholder="Enter SMILES (e.g., CCO)"
              />
            )}
            <button className="discover-button" onClick={handlePrediction} disabled={isLoading}>
              {isLoading ? 'Predicting...' : 'Predict Molecule'}
            </button>
            {error && <div className="error tooltip" data-tooltip={error}>{error}</div>}
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
          <div className="cards-container">
            {isLoading ? (
              <div className="loading-skeleton">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="skeleton-card" />
                ))}
              </div>
            ) : result && result.top_results ? (
              result.top_results.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="feature-card result-item"
                  style={{ '--card-index': index }}
                >
                  <div className="feature-emoji" style={{ backgroundColor: '#66bb6a' }}>🧬</div>
                  <div className="result-details">
                    {item.structureImage && (
                      <img
                        src={`data:image/png;base64,${item.structureImage}`}
                        alt={`2D structure of ${item.SMILES}`}
                        className="structure-image"
                        onError={(e) => {
                          console.error(`Failed to load structure image for SMILES: ${item.SMILES}`);
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <h3>Prediction {index + 1}</h3>
                    <p className="smiles-text tooltip" data-tooltip={`SMILES: ${item.SMILES}`}>
                      <strong>SMILES:</strong> {item.SMILES}
                    </p>
                    <p><strong>LogP:</strong> {parseFloat(item.Reward).toFixed(2)}</p>
                  </div>
                  <div className="neural-network">
                    <div className="node node-1"></div>
                    <div className="node node-2"></div>
                    <div className="node node-3"></div>
                    <div className="connection conn-1"></div>
                    <div className="connection conn-2"></div>
                    <div className="scan-pulse"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="feature-card no-results">
                <p>No results yet. Make a prediction to see optimized molecules.</p>
              </div>
            )}
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
          <h1>LogP Optimization</h1>
        </div>
        <p>Predict and optimize LogP for drug candidates using AI-driven algorithms</p>
      </header>
      <main className="tab-nav-container">
        <div className="tab-nav">
          <button
            className={`discover-button ${activeTab === 'info' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Info
          </button>
          <button
            className={`discover-button ${activeTab === 'input' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('input')}
          >
            Input
          </button>
          <button
            className={`discover-button ${activeTab === 'results' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('results')}
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
          © 2025 LogP Optimization. Powered by{' '}
          <a href="https://x.ai" target="_blank" rel="noopener noreferrer" className="footer-link">
            xAI
          </a>.
        </p>
      </footer>
      {isNavigating && (
        <div className="navigation-overlay">
          <div className="loader">
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogP;