// import React, { useState } from "react";
// import Navbar from "../components/Navbar";
// import axios from "axios";
// import RDKitMolecule from "./RDKitMolecule";
// import "../styles/UseModel.css";

// const Protein2Smiles = () => {
//   const [inputData, setInputData] = useState("");
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

//   const handlePrediction = async () => {
//     try {
//       setError(null);
//       const response = await axios.post("http://localhost:5000/api/protein2smiles", {
//         state: inputData,
//       });
//       setResult(response.data);
//     } catch (err) {
//       console.error("Error fetching prediction:", err);
//       setError("Failed to get prediction. Please try again.");
//     }
//   };

//   return (
//     <>
      
//       <div className="model-page-container">
//         <div className="input-section">
//           <h2>PROTEIN2SMILES</h2>
//           <p>Enter PROTEIN sequence to let the model predict it's SMILES sequence .</p>
//           <textarea
//             className="textarea"
//             value={inputData}
//             onChange={(e) => setInputData(e.target.value)}
//             placeholder="Enter PROTEIN (e.g., MM)"
//           />
//           <button className="button" onClick={handlePrediction}>
//             Predict Smiles
//           </button>
//           {error && <div className="error">{error}</div>}
//         </div>

//         <div className="results-section">
//           {result && result.top_results && Array.isArray(result.top_results) && (
//             <>
//               <h3>Top Results</h3>
//               <div className="boxes-container">
//                 {result.top_results.slice(0, 5).map((item, index) => (
//                   <div key={index} className="box">
//                     <div className="left-side">
//                       <RDKitMolecule smiles={item.SMILES} width={200} height={200} />
//                     </div>
//                     <div className="right-side">
//                       <p>
//                         <strong>SMILE:</strong> {item.SMILES}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}

//           {result && result.top_results && !Array.isArray(result.top_results) && (
//             <>
//               <h3>Prediction Result</h3>
//               <div className="box">
//                 <div className="left-side">
//                   <RDKitMolecule smiles={result.top_results.SMILES} width={200} height={200} />
//                 </div>
//                 <div className="right-side">
//                   <p>
//                     <strong>SMILE:</strong> {result.top_results.SMILES}
//                   </p>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Protein2Smiles;
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import RDKitMolecule from './RDKitMolecule'; // Adjust path as needed
import '../styles/Protein2Smiles.css'; // Adjust path as needed

const Protein2Smiles = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [inputData, setInputData] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

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

  useEffect(() => {
    if (carouselRef.current && resultsArray.length > 0) {
      carouselRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide, resultsArray]);

  const renderPanel = () => {
    switch (activeTab) {
      case 'input':
        return (
          <div className="input-panel">
            <h2>Protein to SMILES</h2>
            <p>Enter a protein sequence to predict its SMILES representation.</p>
            <textarea
              className="textarea"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Enter protein (e.g., MM)"
            />
            <button className="predict-button" onClick={handlePrediction}>
              Predict
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        );
      case 'results':
        return (
          <div className="results-panel">
            <h2>Prediction Results</h2>
            {resultsArray.length > 0 ? (
              <div className="result-carousel">
                <button className="carousel-arrow left" onClick={handlePrevSlide}>
                  ❮
                </button>
                <div className="carousel-track" ref={carouselRef}>
                  {resultsArray.map((item, index) => (
                    <div key={index} className="result-slide">
                      <div className="result-icon">🧪</div>
                      <div className="molecule-container">
                        <RDKitMolecule smiles={item.SMILES || ''} width={250} height={200} />
                      </div>
                      <p><strong>SMILES:</strong> {item.SMILES || 'N/A'}</p>
                    </div>
                  ))}
                </div>
                <button className="carousel-arrow right" onClick={handleNextSlide}>
                  ❯
                </button>
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
          disabled={!result}
        >
          Results
        </button>
      </div>
      {renderPanel()}
    </div>
  );
};

export default Protein2Smiles;