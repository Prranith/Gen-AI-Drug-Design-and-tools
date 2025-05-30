import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadNiiFile } from '../services/api';
import Navbar from '../components/Navbar';
import useParticleEffect from '../hooks/useParticleEffect';
import '../styles/Visualization.css';

const Visualization = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [uploadError, setUploadError] = useState(null);
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('No file selected.');
      return;
    }

    setUploading(true);
    setIsNavigating(true);

    try {
      const response = await uploadNiiFile(selectedFile);

      if (response && response.success) {
        window.location.href = 'http://localhost:8000/papaya';
      } else {
        setUploadError(response.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError(error.message || 'Upload error');
    } finally {
      setUploading(false);
      setIsNavigating(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="hub-wrapper">
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <header className={`hub-header ${headerVisible ? 'visible' : ''}`}>
        <div className="logo-container">
          <span className="logo-icon">🧠</span>
          <h1>3D Tumor Analysis</h1>
        </div>
        <p>Upload a NIfTI file to visualize 3D medical imaging data with AI-powered segmentation.</p>
      </header>
      <main className="visualization-main">
        <div
          className={`feature-card upload-area ${dragActive ? 'active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="region"
          aria-label="File upload area"
          style={{ '--card-index': 0 }}
        >
          <div className="feature-emoji" style={{ backgroundColor: '#3b82f6' }}>📄</div>
          <h3>Upload NIfTI File</h3>
          <p>Drag & drop a .nii.gz file or browse to upload.</p>
          <input
            type="file"
            accept=".nii.gz"
            hidden
            id="fileUpload"
            onChange={handleFileChange}
          />
          <label htmlFor="fileUpload" className="discover-button browse-button">
            {uploading ? 'Uploading...' : 'Browse'}
          </label>
          {selectedFile && (
            <div className="file-details">
              <span className="file-icon">📄</span>
              <p>Selected: {selectedFile.name}</p>
            </div>
          )}
          {uploadError && (
            <div className="error tooltip" data-tooltip={uploadError}>
              {uploadError}
            </div>
          )}
          <div className="neural-network">
            <div className="node node-1"></div>
            <div className="node node-2"></div>
            <div className="node node-3"></div>
            <div className="connection conn-1"></div>
            <div className="connection conn-2"></div>
            <div className="scan-pulse"></div>
          </div>
        </div>
        <button
          className="discover-button predict-button"
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          aria-label="Predict and Visualize"
        >
          Predict & Visualize
        </button>
        {uploading && (
          <p className="status-message">This may take a few minutes! Please wait...</p>
        )}
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

export default Visualization;