import React, { useState } from 'react';
import axios from 'axios';
import useParticleEffect from '../hooks/useParticleEffect';
import '../styles/Chembert.css';

const Chembert = () => {
  const [smiles, setSmiles] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const diseaseInfo = {
    name: 'Alzheimer’s Disease',
    description:
      'Alzheimer’s is a progressive neurological disorder that causes brain cells to waste away. One therapeutic strategy involves targeting JAK2, a tyrosine kinase involved in neuroinflammation and cell survival. Predicting suitable inhibitors using SMILES with masked tokens helps explore novel compounds for this target.',
  };

  useParticleEffect('chembert-wrapper');

  const handleSmilesChange = (e) => {
    const value = e.target.value.trim();
    setSmiles(value);
    setError(null);
    setPredictions([]);
  };

  const handlePredict = async () => {
    if (!smiles.includes('<mask>')) {
      setError('SMILES must contain <mask>');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/mask',
        { state: smiles },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('API Response:', res.data);

      if (res.data && res.data.top_results && typeof res.data.top_results === 'string') {
        const results = res.data.top_results.split('\n').filter(Boolean);
        if (results.length > 0) {
          setPredictions(results);
        } else {
          setError('No valid predictions returned');
        }
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Prediction failed. Please check if the server is running at http://localhost:5000/api/mask';
      setError(errorMessage);
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chembert-wrapper">
      <div className="disease-panel panel-card">
        <div className="feature-emoji" style={{ backgroundColor: '#7b1fa2' }}>
          🧠
        </div>
        <h2 className="disease-title">{diseaseInfo.name}</h2>
        <p className="disease-description">{diseaseInfo.description}</p>
        <div className="neural-network">
          <div className="node node-1"></div>
          <div className="node node-2"></div>
          <div className="node node-3"></div>
          <div className="connection conn-1"></div>
          <div className="connection conn-2"></div>
          <div className="scan-pulse"></div>
        </div>
      </div>

      <div className="predictor-panel">
        <h1 className="predictor-title">Masked SMILES Predictor</h1>

        <div className="panel-card input-section">
          <div className="feature-emoji" style={{ backgroundColor: '#f06292' }}>
            🔬
          </div>
          <label className="input-label">Enter SMILES String (with &lt;mask&gt;)</label>
          <input
            type="text"
            value={smiles}
            onChange={handleSmilesChange}
            placeholder="e.g., CC&lt;mask&gt;OC"
            className="smiles-input"
            disabled={isLoading}
          />
          {error && <p className="error-message">{error}</p>}
          <button
            className="predict-button"
            onClick={handlePredict}
            disabled={isLoading}
          >
            {isLoading ? 'Predicting...' : 'Predict'}
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

        {predictions.length > 0 ? (
          <div className="prediction-section">
            {predictions.map((p, idx) => (
              <div key={idx} className="panel-card prediction-item">
                <div className="feature-emoji" style={{ backgroundColor: '#ffab91' }}>
                  🧪
                </div>
                <h3 className="prediction-title">Prediction {idx + 1}</h3>
                <div className="prediction-content">
                  <div className="result-image-container">
                    <div className="image-fallback">Image Placeholder</div>
                  </div>
                  <div className="prediction-details">
                    <p><strong>SMILES:</strong> {p}</p>
                  </div>
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
            ))}
          </div>
        ) : (
          predictions.length === 0 && smiles && !isLoading && !error && (
            <div className="panel-card">
              <p className="no-predictions">No predictions available. Try a different SMILES string.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Chembert;