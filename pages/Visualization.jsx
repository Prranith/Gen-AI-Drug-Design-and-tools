import React, { useState } from 'react';
import { uploadNiiFile, uploadImage } from '../services/api';
import '../styles/Visualization.css';

const Visualization = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

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

        try {
            let response;
            if (selectedFile.name.endsWith('.nii.gz')) {
                response = await uploadNiiFile(selectedFile);
            } else {
                response = await uploadImage(selectedFile, 'lung');
            }

            if (response && response.success) {
                const originalPath = encodeURIComponent(response.originalImage || '');
                const predictedPath = encodeURIComponent(response.predictedImage || '');

                window.location.href = "http://localhost:8000/papaya";
            } else {
                setUploadError(response.error || 'Upload failed');
            }
        } catch (error) {
            setUploadError(error.message || 'Upload error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="visualization-wrapper">
            <header className="visualization-header">
                <h1>3D Diagnosis Viewer</h1>
                <p>Upload and visualize 3D medical imaging data with AI-powered segmentation.</p>
            </header>

            <main className="visualization-main">
                <div
                    className={`upload-area ${dragActive ? 'active' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    role="region"
                    aria-label="File upload area"
                >
                    <input
                        type="file"
                        accept=".nii.gz,image/*"
                        hidden
                        id="fileUpload"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="fileUpload" className="browse-button">
                        {uploading ? 'Uploading...' : 'Drag & drop or Browse files'}
                    </label>
                    {selectedFile && (
                        <div className="file-details">
                            <span className="file-icon">📄</span>
                            <p>Selected: {selectedFile.name}</p>
                        </div>
                    )}
                    {uploadError && <p className="error">{uploadError}</p>}
                </div>

                <button
                    className="predict-button"
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    aria-label={selectedFile?.name.endsWith('.nii.gz') ? 'Predict and Visualize' : 'Upload Image'}
                >
                    {selectedFile?.name.endsWith('.nii.gz') ? 'Predict & Visualize' : 'Upload Image'}
                </button>

                {uploading && <p className="status-message">This may take upto few minutes!  Please wait...</p>}
            </main>
        </div>
    );
};

export default Visualization;