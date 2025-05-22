import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict/uploadnii', formData);
      const { uploadPath, predictedPath } = response.data;

      // Normalize paths and extract filenames (handle both / and \)
      const uploadFileName = uploadPath.replace(/\\/g, '/').split('/').pop();
      const predictedFileName = predictedPath.replace(/\\/g, '/').split('/').pop();

      // Navigate to the Papaya viewer with the file paths as query parameters
      navigate(`/papaya?upload_path=/public/uploads/${uploadFileName}&predicted_path=/public/uploads/3d_predictions/${predictedFileName}`);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload .nii.gz File</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="file"
              accept=".nii.gz"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;