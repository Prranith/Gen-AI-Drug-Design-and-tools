// import React, { useState } from 'react';
// import axios from 'axios';
// import '../styles/Chembert.css'; // Import the CSS file

// const Chembert = () => {
//   const [selectedDisease, setSelectedDisease] = useState('');
//   const [showInfo, setShowInfo] = useState(false);
//   const [smiles, setSmiles] = useState('');
//   const [prediction, setPrediction] = useState([]);
//   const [error, setError] = useState(null);

//   const diseaseInfo = {
//     alzheimers: {
//       name: 'Alzheimer’s Disease',
//       description:
//         'Alzheimer’s is a progressive neurological disorder that causes brain cells to waste away. One therapeutic strategy involves targeting JAK2, a tyrosine kinase involved in neuroinflammation and cell survival. Predicting suitable inhibitors using SMILES with masked tokens helps explore novel compounds for this target.',
//     },
//   };

//   const handleDiseaseSelect = (e) => {
//     setSelectedDisease(e.target.value);
//     setShowInfo(true);
//     setPrediction([]);
//     setSmiles('');
//     setError(null);
//   };

//   const handlePredict = async () => {
//     if (!smiles.includes('<mask>')) {
//       setError('SMILES must contain <mask>');
//       return;
//     }

//     setError(null);
//     try {
//       const res = await axios.post('http://localhost:5000/api/mask', {state:  smiles });
//       setPrediction(res.data.top_results.split('\n'));
//     } catch (err) {
//       setError('Prediction failed');
//     }
//   };

//   return (
//     <div className="container">
//       {/* Animation keyframes are now in PredictPage.css */}

//       <h2 className="heading">Masked SMILES Predictor</h2>

//       <div className="centerBox">
//         <div className="contentBox">
//           <label className="label">Select Disease</label>
//           <select className="dropdown" onChange={handleDiseaseSelect} value={selectedDisease}>
//             <option value="">-- Select --</option>
//             <option value="alzheimers">Alzheimer’s</option>
//           </select>

//           {showInfo && selectedDisease && (
//             <div className="infoBox">
//               <h3 className="infoTitle">{diseaseInfo[selectedDisease].name}</h3>
//               <p className="infoText">{diseaseInfo[selectedDisease].description}</p>
//             </div>
//           )}

//           {selectedDisease && (
//             <>
//               <label className="label">Enter SMILES (with &lt;mask&gt;)</label>
//               <input
//                 type="text"
//                 value={smiles}
//                 onChange={(e) => setSmiles(e.target.value)}
//                 placeholder="Example: CC<mask>OC"
//                 className="input"
//               />
//               <button onClick={handlePredict} className="button">Predict</button>
//               {error && <p className="error">{error}</p>}

//               {prediction.length > 0 && (
//                 <div className="resultBox">
//                   <h4 className="resultTitle">Predictions:</h4>
//                   <ul style={{ paddingLeft: '20px' }}>
//                     {prediction.map((p, idx) => (
//                       <li
//                         key={idx}
//                         className="resultItem"
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor = '#37474f';
//                           e.currentTarget.style.transform = 'scale(1.02)';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = '#263238';
//                           e.currentTarget.style.transform = 'scale(1)';
//                         }}
//                       >
//                         {p}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chembert;
// src/pages/ChemBERT.jsx
import React, { useState } from 'react';
import axios from 'axios';
import "../styles/Chembert.css"; // Import the CSS file

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
      <div className="disease-panel">
        <h2 className="disease-title">{diseaseInfo.name}</h2>
        <p className="disease-description">{diseaseInfo.description}</p>
      </div>

      <div className="predictor-panel">
        <h1 className="predictor-title">Masked SMILES Predictor</h1>

        <div className="input-section">
          <label className="input-label">Enter SMILES String (with &lt;mask&gt;)</label>
          <input
            type="text"
            value={smiles}
            onChange={handleSmilesChange}
            placeholder="e.g., CC<mask>OC"
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
        </div>

        {predictions.length > 0 ? (
          <div className="prediction-section">
            <h3 className="prediction-title">Predicted Compounds</h3>
            <div className="prediction-list">
              {predictions.map((p, idx) => (
                <div key={idx} className="prediction-item">
                  {p}
                </div>
              ))}
            </div>
          </div>
        ) : (
          predictions.length === 0 && smiles && !isLoading && !error && (
            <p className="no-predictions">No predictions available. Try a different SMILES string.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Chembert;