import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Reinforcement.css'; // Assuming you have a CSS file for styling

const predefinedSmiles = [
  { name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
  { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' },
  { name: 'Ibuprofen', smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O' },
  { name: 'Paracetamol', smiles: 'CC(=O)Nc1ccc(cc1)O' },
  { name: 'Ethanol', smiles: 'CCO' },
];

const Reinforcement = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [selectedSmiles, setSelectedSmiles] = useState('');
  const [customSmiles, setCustomSmiles] = useState('');
  const [usePredefined, setUsePredefined] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredefinedChange = (event) => {
    setSelectedSmiles(event.target.value);
    setCustomSmiles('');
  };

  const handleCustomChange = (event) => {
    setCustomSmiles(event.target.value);
    setSelectedSmiles('');
    setUsePredefined(false);
  };

  const handleToggleInput = (event) => {
    setUsePredefined(event.target.value === 'predefined');
    setCustomSmiles('');
    setSelectedSmiles('');
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
    try {
      setError(null);
      //http://localhost:8000
      const response = await axios.post('https://4c2b-2401-4900-4fe7-3cc7-1594-65c6-8521-d5d4.ngrok-free.app/predict/reinforcement', {
        SMILES: currentInput,
      });
      console.log(response.data);
      setResult(response.data);
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setError('Failed to get prediction. Please try again.');
    }
  };

  const renderPanel = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="info-panel">
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
          </div>
        );
      case 'input':
        return (
          <div className="input-panel">
            <h2>Optimize pIC50 with AI</h2>
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
            <button className="predict-button" onClick={handlePrediction}>
              Predict
            </button>
            {error && <div className="error">{error}</div>}
          </div>
        );
      case 'results':
        return (
          <div className="results-panel">
            {result && result.top_results && (
              <>
                <h3>Top pIC50 Predictions</h3>
                <div className="results-slider">
                  {result.top_results.slice(0, 5).map((item, index) => (
                    <div key={index} className="result-item">
                      <div className="result-icon">🧪</div>
                      <div className="result-details">
                        {item.structureImage && (
                          <img
                            src={`data:image/png;base64,${item.structureImage}`}
                            alt={`2D structure of ${item.SMILES}`}
                            className="structure-image"
                            onError={(e) => {
                              console.error(`Failed to load structure image for SMILES: ${item.SMILES}`);
                              e.target.style.display = 'none'; // Hide image if it fails to load
                            }}
                          />
                        )}
                        <p><strong>SMILES:</strong> {item.SMILES}</p>
                        <p><strong>pIC50:</strong> {parseFloat(item.Reward).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {!result && <p className="no-results">No results yet. Make a prediction!</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="tool-wrapper">
      <div className="tab-nav">
        <button
          className={activeTab === 'info' ? 'tab-active' : ''}
          onClick={() => setActiveTab('info')}
        >
          Info
        </button>
        <button
          className={activeTab === 'input' ? 'tab-active' : ''}
          onClick={() => setActiveTab('input')}
        >
          Input
        </button>
        <button
          className={activeTab === 'results' ? 'tab-active' : ''}
          onClick={() => setActiveTab('results')}
        >
          Results
        </button>
      </div>
      {renderPanel()}
    </div>
  );
};

export default Reinforcement;