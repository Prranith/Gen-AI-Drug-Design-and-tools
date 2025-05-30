import React, { useState, useEffect } from 'react';
import ProteinViewer from '../components/ProteinViewer';
import useParticleEffect from '../hooks/useParticleEffect';
import '../styles/ProteinStructure.css';

const SequenceInput = ({ sequence, setSequence, onPredict, loading, error }) => (
  <div className="feature-card input-panel" style={{ '--card-index': 0 }}>
    <div className="feature-emoji" style={{ backgroundColor: '#3b82f6' }}>🧬</div>
    <h3>Protein Structure Prediction</h3>
    <p>Enter a protein sequence to predict its 3D structure.</p>
    <div className="sequence-input-area">
      <textarea
        className="textarea"
        value={sequence}
        onChange={(e) => setSequence(e.target.value)}
        placeholder="Enter protein sequence (e.g., MGSSHHHHHHSSGLVPRGSHM...)"
      />
      <div className="button-group">
        <button className="discover-button predict-button" onClick={onPredict} disabled={loading}>
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </div>
      {error && <div className="error tooltip" data-tooltip={error}>{error}</div>}
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
);

function ProteinStructure() {
  const [activeTab, setActiveTab] = useState('input');
  const [sequence, setSequence] = useState(
    "MGSSHHHHHHSSGLVPRGSHMRGPNPTAASLEASAGPFTVRSFTVSRPSGYGAGTVYYPTNAGGTVGAIAIVPGYTARQSSIKWWGPRLASHGFVVITIDTNSTLDQPSSRSSQQMAALRQVASLNGTSSSPIYGKVDTARMGVMGWSMGGGGSLISAANNPSLKAAAPQAPWDSSTNFSSVTVPTLIFACENDSIAPVNSSALPIYDSMSRNAKQFLEINGGSHSCANSGNSNQALIGKKGVAWMKRFMDNDTRYSTFACENPNSTRVSDFRTANCSLEDPAANKARKEAELAAATAEQ"
  );
  const [pdbData, setPdbData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const calculatePlDDT = (pdbString) => {
    if (!pdbString) return 0;
    const lines = pdbString.split('\n');
    let sum = 0;
    let count = 0;

    lines.forEach((line) => {
      if (line.startsWith('ATOM')) {
        const bFactor = parseFloat(line.substring(60, 66).trim());
        sum += bFactor;
        count++;
      }
    });

    return count > 0 ? (sum / count).toFixed(4) : 0;
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!sequence || sequence.length < 10) {
        throw new Error('Please enter a valid protein sequence (minimum 10 characters)');
      }

      const response = await fetch('http://localhost:5000/api/fold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sequence }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed - server error');
      }

      const data = await response.json();
      if (!data.pdb) {
        throw new Error('Invalid PDB data received');
      }
      setPdbData(data.pdb);
      setActiveTab('results');
    } catch (err) {
      setError(err.message);
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdb = () => {
    if (!pdbData) return;
    const element = document.createElement('a');
    const file = new Blob([pdbData], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'predicted.pdb';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPanel = () => {
    switch (activeTab) {
      case 'input':
        return (
          <SequenceInput
            sequence={sequence}
            setSequence={setSequence}
            onPredict={handlePredict}
            loading={loading}
            error={error}
          />
        );
      case 'results':
        return (
          <div className="results-container">
            {pdbData ? (
              <div className="feature-card result-item" style={{ '--card-index': 0 }}>
                <div className="feature-emoji" style={{ backgroundColor: '#8b5cf6' }}>🧪</div>
                <h3>Prediction Results</h3>
                <div className="protein-viewer-container">
                  {loading ? (
                    <div className="spinner">Loading...</div>
                  ) : (
                    <ProteinViewer pdbData={pdbData} />
                  )}
                </div>
                <h4>pLDDT Confidence</h4>
                <div className="plddt-box">
                  <p>pLDDT is a confidence estimate (0-100).</p>
                  <div className="plddt-value">pLDDT: {calculatePlDDT(pdbData)}</div>
                </div>
                <div className="button-group">
                  <button className="discover-button download-pdb-button" onClick={downloadPdb}>
                    Download PDB
                  </button>
                  <button className="discover-button reset-button" onClick={() => setPdbData(null)}>
                    Reset View
                  </button>
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
            ) : (
              <div className="feature-card no-results" style={{ '--card-index': 0 }}>
                <p>No results to display.</p>
              </div>
            )}
            {error && <div className="error tooltip" data-tooltip={error}>{error}</div>}
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
      <header className={`hub-header ${headerVisible ? 'visible' : ''}`}>
        <div className="logo-container">
          <span className="logo-icon">🧬</span>
          <h1>Protein Structure Prediction</h1>
        </div>
        <p>Predict the 3D structure of a protein from its amino acid sequence using AI.</p>
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
            disabled={!pdbData}
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

export default ProteinStructure;