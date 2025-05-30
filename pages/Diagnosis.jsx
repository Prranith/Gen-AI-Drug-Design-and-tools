import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage } from '../services/api';
import Navbar from '../components/Navbar';
import useParticleEffect from '../hooks/useParticleEffect';
import '../styles/Diagnosis.css';

const Diagnosis = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [predictedMask, setPredictedMask] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [modelType, setModelType] = useState('brain');
  const [headerVisible, setHeaderVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const fileInputRef = useRef(null);

  useParticleEffect('hub-wrapper');

  useEffect(() => {
    const handleScroll = () => {
      setHeaderVisible(window.scrollY > 100);
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload an image file.');
        setSelectedFile(null);
        setOriginalImage(null);
        return;
      }

      const maxSizeMB = 5;
      if (file.size > maxSizeMB * 1024 * 1024) {
        setUploadError(`File size exceeds the limit of ${maxSizeMB}MB.`);
        setSelectedFile(null);
        setOriginalImage(null);
        return;
      }

      setSelectedFile(file);
      setOriginalImage(URL.createObjectURL(file));
      setPredictedMask(null);
      setOverlayImage(null);
      setUploadError('');
    }
  };

  const createOverlayImage = async () => {
    if (!originalImage || !predictedMask) return;

    const original = new Image();
    const mask = new Image();

    original.src = originalImage;
    mask.src = predictedMask;

    await Promise.all([
      new Promise((resolve) => (original.onload = resolve)),
      new Promise((resolve) => (mask.onload = resolve)),
    ]);

    const canvas = document.createElement('canvas');
    canvas.width = original.width;
    canvas.height = original.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(original, 0, 0, canvas.width, canvas.height);

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = mask.width;
    maskCanvas.height = mask.height;
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.drawImage(mask, 0, 0, maskCanvas.width, maskCanvas.height);
    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
        data[i] = 255;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 150;
      } else {
        data[i + 3] = 0;
      }
    }

    maskCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);
    setOverlayImage(canvas.toDataURL());
  };

  useEffect(() => {
    createOverlayImage();
  }, [predictedMask]);

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select an image.');
      return;
    }

    setLoading(true);
    setIsNavigating(true);
    setUploadProgress(0);
    setUploadError('');
    setActiveTab('processing');

    try {
      const data = await uploadImage(selectedFile, modelType, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      if (data.success) {
        const filePath = data.predictedImage;
        const normalizedPath = filePath.replace(/\\/g, '/');
        const filename = normalizedPath.split('/').pop();
        setPredictedMask(`/${filename}`);
        setActiveTab('results');
      } else {
        setUploadError('Prediction failed.');
        setActiveTab('upload');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('An error occurred during upload.');
      setActiveTab('upload');
    } finally {
      setLoading(false);
      setIsNavigating(false);
    }
  };

  const handleRetry = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setPredictedMask(null);
    setOverlayImage(null);
    setLoading(false);
    setUploadProgress(0);
    setUploadError('');
    setActiveTab('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const images = [
    originalImage && { title: 'Original Image', src: originalImage },
    predictedMask && { title: 'Predicted Mask', src: predictedMask },
    overlayImage && { title: 'Overlay Visualization', src: overlayImage },
  ].filter(Boolean);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPanel = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div className="feature-card input-panel" style={{ '--card-index': 0 }}>
            <div className="feature-emoji" style={{ backgroundColor: '#26a69a' }}>📤</div>
            <h3>Upload MRI/CT Scan</h3>
            <p>Select a model and upload an image to predict tumor regions.</p>
            <select
              className="select-model"
              onChange={(e) => setModelType(e.target.value)}
              value={modelType}
            >
              <option value="brain">Brain Tumor</option>
              <option value="lung">Lung Tumor</option>
            </select>
            <div
              className="upload-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="feature-emoji">📷</div>
              <p>Drag & drop your image here or click to browse</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
                multiple={false}
              />
              <button
                type="button"
                className="discover-button browse-button"
                onClick={() => fileInputRef.current.click()}
              >
                Browse
              </button>
            </div>
            {selectedFile && (
              <p>
                Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}
            {uploadError && (
              <div className="error tooltip" data-tooltip={uploadError}>
                {uploadError}
              </div>
            )}
            <button
              className="discover-button"
              onClick={handleUpload}
              disabled={loading || !selectedFile}
            >
              Upload
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
        );
      case 'processing':
        return (
          <div className="feature-card input-panel" style={{ '--card-index': 0 }}>
            <div className="feature-emoji" style={{ backgroundColor: '#ff6f61' }}>⏳</div>
            <h3>Processing...</h3>
            <p>Analyzing your image... {uploadProgress}% Complete</p>
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
          <div className="cards-container">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div
                  key={index}
                  className="feature-card result-item"
                  style={{ '--card-index': index }}
                >
                  <div className="feature-emoji" style={{ backgroundColor: '#66bb6a' }}>
                    🩻
                  </div>
                  <h3>{image.title}</h3>
                  <img
                    src={image.src}
                    alt={image.title}
                    className="result-image"
                  />
                  <div className="neural-network">
                    <div className="node node-1"></div>
                    <div className="node node-2"></div>
                    <div className="node node-3"></div>
                    <div className="connection conn-1"></div>
                    <div className="connection conn-2"></div>
                    <div className="scan-pulse"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="feature-card no-results">
                <p>No results to display.</p>
              </div>
            )}
            {uploadError && (
              <div className="error tooltip" data-tooltip={uploadError}>
                {uploadError}
              </div>
            )}
            <button className="discover-button retry-button" onClick={handleRetry}>
              Try Another Image
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
          <span className="logo-icon">🩻</span>
          <h1>Medical Image Diagnosis</h1>
        </div>
        <p>Upload MRI/CT scans to detect tumor regions using AI</p>
      </header>
      <main className="tab-nav-container">
        <div className="tab-nav">
          <button
            className={`discover-button ${activeTab === 'upload' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
          <button
            className={`discover-button ${activeTab === 'processing' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('processing')}
            disabled
          >
            Processing
          </button>
          <button
            className={`discover-button ${activeTab === 'results' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('results')}
            disabled={!predictedMask}
          >
            Results
          </button>
        </div>
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
          © 2025 Medical Image Diagnosis. Powered by{' '}
          <a href="https://x.ai" target="_blank" rel="noopener noreferrer" className="footer-link">
            xAI
          </a>.
        </p>
      </footer>
      {isNavigating && (
        <div className="navigation-overlay">
          <div className="loader">
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diagnosis;