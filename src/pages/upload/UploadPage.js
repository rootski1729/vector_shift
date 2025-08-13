import React, { useState } from 'react';
import adminAPI from '../../services/api';

const UploadPage = () => {
  const [singleFile, setSingleFile] = useState(null);
  const [batchFiles, setBatchFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Single upload
  const handleSingleUpload = async (e) => {
    e.preventDefault();
    if (!singleFile) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append('file', singleFile);
    try {
      await adminAPI.uploadVideo(formData, setProgress);
      setSuccess('File uploaded successfully');
      setSingleFile(null);
      setProgress(0);
    } catch (err) {
      setError('Upload failed');
    }
    setUploading(false);
  };

  // Batch upload
  const handleBatchUpload = async (e) => {
    e.preventDefault();
    if (!batchFiles.length) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    batchFiles.forEach((file, idx) => {
      formData.append(`files[${idx}]`, file);
    });
    try {
      await adminAPI.batchUploadVideos(formData, setProgress);
      setSuccess('Batch upload successful');
      setBatchFiles([]);
      setProgress(0);
    } catch (err) {
      setError('Batch upload failed');
    }
    setUploading(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Upload Content</h2>

      {/* Single Upload */}
      <form onSubmit={handleSingleUpload} className="mb-8">
        <label className="block mb-2 font-semibold">Single Upload</label>
        <input type="file" onChange={e => setSingleFile(e.target.files[0])} />
        <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded" type="submit" disabled={uploading || !singleFile}>Upload</button>
        {uploading && <div className="mt-2">Progress: {progress.toFixed(0)}%</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </form>

      {/* Batch Upload */}
      <form onSubmit={handleBatchUpload}>
        <label className="block mb-2 font-semibold">Batch Upload</label>
        <input type="file" multiple onChange={e => setBatchFiles(Array.from(e.target.files))} />
        <button className="ml-4 px-4 py-2 bg-green-600 text-white rounded" type="submit" disabled={uploading || !batchFiles.length}>Upload Batch</button>
        {uploading && <div className="mt-2">Progress: {progress.toFixed(0)}%</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </form>
    </div>
  );
};

export default UploadPage;
