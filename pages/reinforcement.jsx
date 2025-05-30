import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useParticleEffect from '../hooks/useParticleEffect';
import '../styles/Reinforcement.css';

const predefinedSmiles = [
  { name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
  { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' },
  { name: 'Ibuprofen', smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O' },
  { name: 'Paracetamol', smiles: 'CC(=O)Nc1ccc(cc1)O' },
  { name: 'Ethanol', smiles: 'CCO' },
];

const Reinforcement = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [selectedSmiles, setSelectedSmiles] = useState('');
  const [customSmiles, setCustomSmiles] = useState('');
  const [usePredefined, setUsePredefined] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsCached(false);
      return;
    }

    setIsNavigating(true);
    setIsLoading(true);
    try {
      setError(null);
      const cacheResponse = await axios.get(`http://localhost:8000/cache/${encodeURIComponent(currentInput)}`);
      if (cacheResponse.status === 200) {
        setResult(cacheResponse.data);
        setIsCached(true);
        console.log('Retrieved prediction from backend cache for SMILES:', currentInput);
        setIsNavigating(false);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Error checking cache:', err);
      }
    }

    try {
      const response = await axios.post('http://localhost:8000/predict/reinforcement', {
        SMILES: currentInput,
      });
      console.log('API Response:', response.data);
      setResult(response.data);
      setIsCached(false);
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setError('Failed to get prediction. Please try again.');
      setResult(null);
      setIsCached(false);
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
            <h3>About pIC50</h3>
            <p>
              <strong>What is IC50?</strong> IC50 (Half Maximal Inhibitory Concentration) measures a substance's potency in inhibiting a biological function, showing the concentration needed to reduce activity by 50%.
            </p>
            <p>
              <strong>What is pIC50?</strong> pIC50 is the negative log (base 10) of IC50: pIC<sub>50</sub> = -log<sub>10</sub>(IC<sub>50</sub>), typically in molar units.
            </p>
            <h3>Importance in Drug Discovery</h3>
            <ul>
              <li><strong>Higher Potency:</strong> Higher pIC50 means greater effectiveness with less concentration.</li>
              <li><strong>Linear Scale:</strong> Easier to compare, e.g., pIC50 7 is 10x more potent than 6.</li>
              <li><strong>Optimization:</strong> Aids in prioritizing drug candidates.</li>
              <li><strong>Binding Affinity:</strong> Correlates with how well a drug binds to its target.</li>
            </ul>
            <p>We use this model to enhance pIC50 for better drug candidates.</p>
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
            <h3>Optimize pIC50 with AI</h3>
            <p>Choose a predefined SMILES or input your own.</p>
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
                <option value="">Pick a SMILES</option>
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
            <button className="discover-button" onClick={handlePrediction}>
              Predict
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
                  <div className="feature-emoji" style={{ backgroundColor: '#66bb6a' }}>🧪</div>
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
                    <h3>Prediction {index + 1} {isCached ? '(Cached)' : ''}</h3>
                    <p className="tooltip smiles-text" data-tooltip={`SMILES: ${item.SMILES}`}>
                      <strong>SMILES:</strong> {item.SMILES}
                    </p>
                    <p><strong>pIC50:</strong> {parseFloat(item.Reward).toFixed(2)}</p>
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
                <p>No results yet. Make a prediction!</p>
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
          <span className="logo-icon">🧪</span>
          <h1>Denova Drug Analysis</h1>
        </div>
        <p>Optimize pIC50 for drug candidates using AI-driven algorithms</p>
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
          © 2025 Denova Drug Analysis. Powered by{' '}
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

export default Reinforcement;