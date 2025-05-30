import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import useParticleEffect from '../hooks/useParticleEffect';
import '../styles/DockingForm.css';

function DockingForm({ isAuthenticated, onLogout }) {
  const [ecNumber, setEcNumber] = useState('');
  const [ligandId, setLigandId] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nglError, setNglError] = useState('');
  const [activeTab, setActiveTab] = useState('input');
  const [headerVisible, setHeaderVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const outputDivRef = useRef(null);

  useParticleEffect('hub-wrapper');

  useEffect(() => {
    const handleScroll = () => {
      setHeaderVisible(window.scrollY > 100);
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (outputDivRef.current && predictionResult?.visualization_html) {
      outputDivRef.current.innerHTML = predictionResult.visualization_html;

      const ensureNglLoaded = () => {
        return new Promise((resolve, reject) => {
          const urls = [
            'https://unpkg.com/ngl@2.1.0/dist/ngl.min.js',
            'https://cdn.jsdelivr.net/npm/ngl@2.1.0/dist/ngl.min.js'
          ];
          let currentUrlIndex = 0;
          const maxAttemptsPerUrl = 10;
          let attempts = 0;

          const tryLoadNgl = () => {
            if (window.NGL) {
              resolve();
              return;
            }
            if (attempts >= maxAttemptsPerUrl) {
              currentUrlIndex++;
              attempts = 0;
              if (currentUrlIndex >= urls.length) {
                reject(new Error("NGL library failed to load from all sources"));
                return;
              }
              const script = document.createElement('script');
              script.src = urls[currentUrlIndex];
              script.async = true;
              script.onload = () => tryLoadNgl();
              script.onerror = () => tryLoadNgl();
              document.head.appendChild(script);
              return;
            }
            attempts++;
            setTimeout(tryLoadNgl, 500);
          };

          tryLoadNgl();
        });
      };

      const executeScripts = async () => {
        try {
          await ensureNglLoaded();
          const scripts = outputDivRef.current.getElementsByTagName('script');
          Array.from(scripts).forEach(script => {
            const scriptTag = document.createElement('script');
            Array.from(script.attributes).forEach(attr => {
              scriptTag.setAttribute(attr.name, attr.value);
            });
            scriptTag.textContent = script.textContent;
            outputDivRef.current.appendChild(scriptTag);
            script.remove();
          });

          const checkNglError = () => {
            const nglErrorDiv = outputDivRef.current.querySelector('#ngl-error');
            const fallbackMessageDiv = outputDivRef.current.querySelector('#fallback-message');
            if (nglErrorDiv && nglErrorDiv.innerText) {
              setNglError(nglErrorDiv.innerText);
            }
            if (fallbackMessageDiv && fallbackMessageDiv.style.display !== "none") {
              setNglError(fallbackMessageDiv.innerText || "NGL viewer failed to initialize");
            }
          };

          setTimeout(checkNglError, 6000);
        } catch (err) {
          setNglError(err.message);
        }
      };

      executeScripts();
    }
  }, [predictionResult]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setNglError('');
    setPredictionResult(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('http://localhost:8000/predict/docking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ec_number: ecNumber, ligand_id: ligandId }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage.detail || 'Failed to fetch prediction'}`);
      }

      const data = await response.json();
      if (!data.visualization_html) {
        throw new Error('No visualization HTML returned from the server');
      }
      setPredictionResult(data);
      setActiveTab('results');
    } catch (err) {
      setError(err.name === 'AbortError' ? 'Request timed out after 30 seconds' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEcNumber('');
    setLigandId('');
    setPredictionResult(null);
    setError('');
    setNglError('');
    setActiveTab('input');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPanel = () => {
    switch (activeTab) {
      case 'input':
        return (
          <div className="feature-card input-panel" style={{ '--card-index': 0 }}>
            <div className="feature-emoji" style={{ backgroundColor: '#26a69a' }}>⚛️</div>
            <h3>Docking Prediction</h3>
            <p>Enter EC Number and Ligand ID to predict docking interactions.</p>
            <form onSubmit={handleSubmit} className="docking-form">
              <div className="form-group">
                <label htmlFor="ecNumber">EC Number</label>
                <input
                  type="text"
                  id="ecNumber"
                  value={ecNumber}
                  onChange={(e) => setEcNumber(e.target.value)}
                  placeholder="e.g., 1.1.1.1"
                  required
                  aria-label="Enter EC Number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ligandId">Ligand ID</label>
                <input
                  type="text"
                  id="ligandId"
                  value={ligandId}
                  onChange={(e) => setLigandId(e.target.value)}
                  placeholder="e.g., NAD or PubChem CID"
                  required
                  aria-label="Enter Ligand ID"
                />
              </div>
              <div className="button-group">
                <button type="submit" className="discover-button predict-button" disabled={loading}>
                  {loading ? 'Predicting...' : 'Predict Docking'}
                </button>
                <button type="button" className="discover-button reset-button" onClick={handleReset} disabled={loading}>
                  Reset
                </button>
              </div>
              {error && (
                <div className="error tooltip" data-tooltip={error}>
                  {error}
                </div>
              )}
            </form>
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
            {predictionResult ? (
              <div className="feature-card result-item" style={{ '--card-index': 0 }}>
                <div className="feature-emoji" style={{ backgroundColor: '#9575cd' }}>🧪</div>
                <h3>Prediction Result</h3>
                <div className="prediction-output" ref={outputDivRef}></div>
                {nglError && (
                  <div className="error tooltip" data-tooltip={nglError}>
                    {nglError}
                  </div>
                )}
                {predictionResult.interactions && (
                  <>
                    <h4>Interaction Affinities</h4>
                    <table className="affinity-table">
                      <thead>
                        <tr>
                          <th>Interaction Type</th>
                          <th>Affinity (kcal/mol)</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predictionResult.interactions.map((interaction, index) => (
                          <tr key={index} style={{ backgroundColor: interaction.color + '20' }}>
                            <td>{interaction.type}</td>
                            <td>{interaction.affinity.toFixed(2)}</td>
                            <td>{interaction.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
                {predictionResult.color_legend && (
                  <>
                    <h4>Color Legend</h4>
                    <div className="color-legend">
                      {predictionResult.color_legend.map((item, index) => (
                        <div key={index} className="legend-item">
                          <span
                            className="color-box"
                            style={{ backgroundColor: item.color }}
                          ></span>
                          <span>{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </>
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
            <button className="discover-button retry-button" onClick={() => setActiveTab('input')}>
              Try Another Prediction
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
          <span className="logo-icon">⚛️</span>
          <h1>Docking Prediction</h1>
        </div>
        <p>Simulate interactions between small molecules and proteins using AI.</p>
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
            disabled={!predictionResult}
          >
            Results
          </button>
        </div>
        {loading && (
          <div className="navigation-overlay">
            <div className="loader">
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
            </div>
          </div>
        )}
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
          © 2025 Gen-AI Med Diagnosis. Powered by{' '}
          <a href="https://x.ai" target="_blank" rel="noopener noreferrer" className="footer-link">
            xAI
          </a>.
        </p>
      </footer>
    </div>
  );
}

export default DockingForm;