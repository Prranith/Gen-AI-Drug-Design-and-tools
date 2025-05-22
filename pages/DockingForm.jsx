import React, { useState, useEffect, useRef } from 'react';
import '../styles/DockingForm.css';

function DockingForm() {
  const [ecNumber, setEcNumber] = useState('');
  const [ligandId, setLigandId] = useState('');
  const [predictionResultHTML, setPredictionResultHTML] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nglError, setNglError] = useState('');
  const outputDivRef = useRef(null);

  useEffect(() => {
    if (outputDivRef.current && predictionResultHTML) {
      console.log("Setting prediction HTML in outputDivRef");
      outputDivRef.current.innerHTML = predictionResultHTML;

      // Ensure NGL library is loaded before executing scripts
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
              console.log("NGL library loaded successfully");
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
              console.log(`Switching to fallback URL: ${urls[currentUrlIndex]}`);
              const script = document.createElement('script');
              script.src = urls[currentUrlIndex];
              script.async = true;
              script.onload = () => tryLoadNgl();
              script.onerror = () => tryLoadNgl();
              document.head.appendChild(script);
              return;
            }
            attempts++;
            console.log(`Attempt ${attempts} for URL ${urls[currentUrlIndex]}: Checking if NGL is loaded...`);
            setTimeout(tryLoadNgl, 500);
          };

          tryLoadNgl();
        });
      };

      // Execute script tags for NGL viewer
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
            console.log("Executed NGL script:", script.textContent);
          });

          // Check for NGL errors in the DOM
          const checkNglError = () => {
            const nglErrorDiv = outputDivRef.current.querySelector('#ngl-error');
            const fallbackMessageDiv = outputDivRef.current.querySelector('#fallback-message');
            if (nglErrorDiv && nglErrorDiv.innerText) {
              setNglError(nglErrorDiv.innerText);
              console.error("NGL error detected:", nglErrorDiv.innerText);
            }
            if (fallbackMessageDiv && fallbackMessageDiv.style.display !== "none") {
              setNglError(fallbackMessageDiv.innerText || "NGL viewer failed to initialize");
              console.error("Fallback message displayed:", fallbackMessageDiv.innerText);
            }
          };

          setTimeout(checkNglError, 6000);
        } catch (err) {
          console.error("Failed to execute NGL scripts:", err);
          setNglError(err.message);
        }
      };

      executeScripts();
    }
  }, [predictionResultHTML]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setNglError('');
    setPredictionResultHTML('');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000000);

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
      console.log("Received response from backend:", data);
      if (!data.visualization_html) {
        throw new Error('No visualization HTML returned from the server');
      }
      setPredictionResultHTML(data.visualization_html);
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setError(err.name === 'AbortError' ? 'Request timed out after 30 seconds' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEcNumber('');
    setLigandId('');
    setPredictionResultHTML('');
    setError('');
    setNglError('');
  };

  return (
    <div className="convert-wrapper">
      <div className="input-panel">
        <h2>Docking Prediction</h2>
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
            />
          </div>
          <div className="button-group">
            <button type="submit" className="predict-button" disabled={loading}>
              {loading ? 'Predicting...' : 'Predict Docking'}
            </button>
            <button type="button" className="reset-button" onClick={handleReset} disabled={loading}>
              Reset
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>

      {loading && <div className="spinner">Loading prediction...</div>}

      {predictionResultHTML && (
        <div className="results-panel">
          <h3>Prediction Result</h3>
          <div className="prediction-output" ref={outputDivRef}></div>
          {nglError && <p className="error-message">{nglError}</p>}
        </div>
      )}

      {!loading && !predictionResultHTML && !error && (
        <div className="no-results">Enter EC Number and Ligand ID to see the docking prediction.</div>
      )}
    </div>
  );
}

export default DockingForm;