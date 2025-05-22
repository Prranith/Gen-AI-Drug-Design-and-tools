import React, { useState } from "react";
import axios from "axios";
import "../styles/Vit.css";

const Vit = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [smiles, setSmiles] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setActiveTab("results"); // Switch to results tab after prediction
    } catch (error) {
      setError("❌ Error: Unable to predict activity. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  const renderPanel = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="info-panel">
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
          </div>
        );
      case "input":
        return (
          <div className="input-panel">
            <h2>Predict Drug Activity</h2>
            <p>Enter a SMILES string to predict whether the molecule is Active, Inactive, or Intermediate.</p>
            <div className="input-group">
              <textarea
                className="textarea"
                value={smiles}
                onChange={(e) => setSmiles(e.target.value)}
                placeholder="Enter SMILES notation (e.g., CCO)"
              />
            </div>
            <button
              className="predict-button"
              onClick={handleSubmit}
              disabled={loading || !smiles.trim()}
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
            {error && <div className="error">{error}</div>}
          </div>
        );
      case "results":
        return (
          <div className="results-panel">
            {prediction && !loading ? (
              <>
                <h3>Prediction Result</h3>
                <div className="results-slider">
                  <div className="result-item">
                    <div className="result-icon">🔬</div>
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
                  </div>
                </div>
              </>
            ) : (
              <p className="no-results">No results yet. Make a prediction!</p>
            )}
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
          className={activeTab === "info" ? "tab-active" : ""}
          onClick={() => setActiveTab("info")}
        >
          Info
        </button>
        <button
          className={activeTab === "input" ? "tab-active" : ""}
          onClick={() => setActiveTab("input")}
        >
          Input
        </button>
        <button
          className={activeTab === "results" ? "tab-active" : ""}
          onClick={() => setActiveTab("results")}
        >
          Results
        </button>
      </div>
      {renderPanel()}
    </div>
  );
};

export default Vit;