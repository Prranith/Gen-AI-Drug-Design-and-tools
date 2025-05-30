import React, { useState, useEffect } from "react";
import axios from "axios";
import useParticleEffect from '../hooks/useParticleEffect';
import "../styles/Vit.css";

const Vit = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [smiles, setSmiles] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async () => {
    setError("");
    setPrediction(null);
    setImage(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/predict/vit", { SMILES: smiles });

      console.log("🔄 API Response:", response.data);

      setPrediction(response.data.activity);
      setImage(response.data.image);
      setActiveTab("results");
    } catch (error) {
      setError("❌ Error: Unable to predict activity. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPanel = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="feature-card info-panel" style={{ '--card-index': 0 }}>
            <div className="feature-emoji" style={{ backgroundColor: '#3b82f6' }}>ℹ️</div>
            <h3>About Active/Inactive Prediction</h3>
            <p>
              <strong>What is Active/Inactive Prediction?</strong> Active/Inactive prediction determines whether a drug molecule is likely to be active, inactive, or intermediate in its biological activity against a target. This is often based on molecular features like weight, lipophilicity, and hydrogen bonding.
            </p>
            <h3>Importance in Drug Discovery</h3>
            <ul>
              <li><strong>Screening Efficiency:</strong> Identifies promising drug candidates early.</li>
              <li><strong>Cost Reduction:</strong> Reduces the need for extensive experimental testing.</li>
              <li><strong>Feature-Based Insights:</strong> Uses molecular descriptors to predict activity.</li>
              <li><strong>Decision Making:</strong> Helps prioritize compounds for further development.</li>
            </ul>
            <p>This tool uses a machine learning model to predict activity based on SMILES input.</p>
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
      case "input":
        return (
          <div className="feature-card input-panel" style={{ '--card-index': 0 }}>
            <div className="feature-emoji" style={{ backgroundColor: '#3b82f6' }}>🔬</div>
            <h3>Predict Drug Activity</h3>
            <p>Enter a SMILES string to predict whether the molecule is Active, Inactive, or Intermediate.</p>
            <div className="input-group">
              <textarea
                className="textarea"
                value={smiles}
                onChange={(e) => setSmiles(e.target.value)}
                placeholder="Enter SMILES notation (e.g., CCO)"
              />
            </div>
            <div className="button-group">
              <button
                className="discover-button predict-button"
                onClick={handleSubmit}
                disabled={loading || !smiles.trim()}
              >
                {loading ? "Predicting..." : "Predict"}
              </button>
            </div>
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
      case "results":
        return (
          <div className="results-panel">
            {prediction && !loading ? (
              <div className="feature-card result-item" style={{ '--card-index': 0 }}>
                <div className="feature-emoji" style={{ backgroundColor: '#8b5cf6' }}>🧪</div>
                <h3>Prediction Result</h3>
                <div className="result-details">
                  {image && (
                    <img
                      src={`data:image/png;base64,${image}`}
                      alt="Molecular Structure"
                      className="structure-image"
                      onError={(e) => {
                        console.error("Failed to load structure image");
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <p><strong>SMILES:</strong> {smiles}</p>
                  <p><strong>Activity:</strong> {prediction}</p>
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
                <p>No results yet. Make a prediction!</p>
              </div>
            )}
            <button className="discover-button retry-button" onClick={() => setActiveTab("input")}>
              Try Another SMILES
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
          <span className="logo-icon">🔬</span>
          <h1>Drug Activity Prediction</h1>
        </div>
        <p>Predict the activity of a drug molecule using SMILES notation.</p>
      </header>
      <main className="tab-nav-container">
        <div className="tab-nav">
          <button
            className={`discover-button ${activeTab === "info" ? 'tab-active' : ''}`}
            onClick={() => setActiveTab("info")}
          >
            Info
          </button>
          <button
            className={`discover-button ${activeTab === "input" ? 'tab-active' : ''}`}
            onClick={() => setActiveTab("input")}
          >
            Input
          </button>
          <button
            className={`discover-button ${activeTab === "results" ? 'tab-active' : ''}`}
            onClick={() => setActiveTab("results")}
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
};

export default Vit;