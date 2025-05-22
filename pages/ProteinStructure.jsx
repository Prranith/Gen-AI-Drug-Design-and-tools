import React, { useState } from 'react';
import ProteinViewer from '../components/ProteinViewer';
import '../styles/ProteinStructure.css';

const SequenceInput = ({ sequence, setSequence, onPredict, loading, error }) => (
  <div className="sequence-input-area">
    <h2>Input Protein Sequence</h2>
    <p>Enter a protein sequence to predict its 3D structure.</p>
    <textarea
      className="textarea"
      value={sequence}
      onChange={(e) => setSequence(e.target.value)}
      placeholder="Enter protein sequence (e.g., MGSSHHHHHHSSGLVPRGSHM...)"
    />
    <button className="predict-button" onClick={onPredict} disabled={loading}>
      {loading ? 'Predicting...' : 'Predict'}
    </button>
    {error && <p className="error-message">{error}</p>}
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

  const renderPanel = () => {
    switch (activeTab) {
      case 'input':
        return (
          <div className="input-panel">
            <SequenceInput
              sequence={sequence}
              setSequence={setSequence}
              onPredict={handlePredict}
              loading={loading}
              error={error}
            />
          </div>
        );
      case 'results':
        return (
          <div className="results-panel">
            <h2>Prediction Results</h2>
            {pdbData ? (
              <div className="result-container">
                <div className="result-slide">
                  <div className="result-icon">🧬</div>
                  <h3>Predicted Structure</h3>
                  <div className="protein-viewer-container">
                    {loading ? (
                      <div className="spinner">Loading...</div>
                    ) : (
                      <ProteinViewer pdbData={pdbData} />
                    )}
                  </div>
                  <h3>pLDDT Confidence</h3>
                  <div className="plddt-box">
                    <p>pLDDT is a confidence estimate (0-100).</p>
                    <div className="plddt-value">pLDDT: {calculatePlDDT(pdbData)}</div>
                  </div>
                  <div className="button-group">
                    <button className="download-pdb-button" onClick={downloadPdb}>
                      Download PDB
                    </button>
                    <button className="reset-button" onClick={() => setPdbData(null)}>
                      Reset View
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="no-results">No results to display.</p>
            )}
            {error && <p className="error-message">{error}</p>}
            <button className="retry-button" onClick={() => setActiveTab('input')}>
              Try Another Sequence
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="convert-wrapper">
      <div className="tab-nav">
        <button
          className={activeTab === 'input' ? 'tab-active' : ''}
          onClick={() => setActiveTab('input')}
        >
          Input
        </button>
        <button
          className={activeTab === 'results' ? 'tab-active' : ''}
          onClick={() => setActiveTab('results')}
          disabled={!pdbData}
        >
          Results
        </button>
      </div>
      {renderPanel()}
    </div>
  );
}

export default ProteinStructure;