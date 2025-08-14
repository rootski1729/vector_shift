// src/pages/upload/UploadPage.js
import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, ProgressBar, Modal } from '../../components/ui';
import adminAPI from '../../services/api';

const UploadPage = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Single Upload State
  const [singleFile, setSingleFile] = useState(null);
  const [singleProgress, setSingleProgress] = useState(0);
  const [singleUploading, setSingleUploading] = useState(false);

  // Batch Upload State
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchUploading, setBatchUploading] = useState(false);

  // Video Form Data
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    contentId: '',
    episodeNumber: 1,
    seasonNumber: 1,
    duration: 0,
    genre: [],
    language: [],
    tags: []
  });

  // Thumbnail Upload State
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [episodeId, setEpisodeId] = useState('');
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await adminAPI.getContent();
      setContentList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch content:', err);
    }
  };

  const handleVideoFormChange = (e) => {
    const { name, value } = e.target;
    setVideoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayFormChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setVideoForm(prev => ({
      ...prev,
      [field]: array
    }));
  };

  // Single Video Upload
  const handleSingleUpload = async (e) => {
    e.preventDefault();
    
    if (!singleFile) {
      setError('Please select a video file');
      return;
    }

    if (!videoForm.title || !videoForm.episodeNumber) {
      setError('Please fill in required fields');
      return;
    }

    try {
      setSingleUploading(true);
      setError(null);
      setSingleProgress(0);

      const formData = new FormData();
      formData.append('video', singleFile);
      formData.append('title', videoForm.title);
      formData.append('description', videoForm.description);
      formData.append('contentId', videoForm.contentId);
      formData.append('episodeNumber', videoForm.episodeNumber);
      formData.append('seasonNumber', videoForm.seasonNumber);
      formData.append('duration', videoForm.duration);
      formData.append('genre', JSON.stringify(videoForm.genre));
      formData.append('language', JSON.stringify(videoForm.language));
      formData.append('tags', JSON.stringify(videoForm.tags));

      const result = await adminAPI.uploadVideo(formData, (progress) => {
        setSingleProgress(progress);
      });

      setSuccess(`Video uploaded successfully! Episode ID: ${result.data?.episodeId}`);
      setSingleFile(null);
      setSingleProgress(0);
      setVideoForm({
        title: '',
        description: '',
        contentId: '',
        episodeNumber: 1,
        seasonNumber: 1,
        duration: 0,
        genre: [],
        language: [],
        tags: []
      });

    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setSingleUploading(false);
    }
  };

  // Batch Upload (simplified - you can extend this)
  const handleBatchUpload = async (e) => {
    e.preventDefault();
    
    if (batchFiles.length === 0) {
      setError('Please select video files');
      return;
    }

    try {
      setBatchUploading(true);
      setError(null);
      setBatchProgress(0);

      const totalFiles = batchFiles.length;
      let completedFiles = 0;

      for (const file of batchFiles) {
        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', file.name.replace(/\.[^/.]+$/, "")); // Remove extension
        formData.append('episodeNumber', completedFiles + 1);
        formData.append('seasonNumber', 1);

        await adminAPI.uploadVideo(formData);
        completedFiles++;
        setBatchProgress((completedFiles / totalFiles) * 100);
      }

      setSuccess(`${totalFiles} videos uploaded successfully!`);
      setBatchFiles([]);
      setBatchProgress(0);

    } catch (err) {
      setError(err.message || 'Batch upload failed');
    } finally {
      setBatchUploading(false);
    }
  };

  // Thumbnail Upload
  const handleThumbnailUpload = async (e) => {
    e.preventDefault();
    
    if (!thumbnailFile || !episodeId) {
      setError('Please select a thumbnail file and enter episode ID');
      return;
    }

    try {
      setThumbnailUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('thumbnail', thumbnailFile);

      const result = await adminAPI.uploadThumbnail(episodeId, formData);
      setSuccess('Thumbnail uploaded successfully!');
      setThumbnailFile(null);
      setEpisodeId('');

    } catch (err) {
      setError(err.message || 'Thumbnail upload failed');
    } finally {
      setThumbnailUploading(false);
    }
  };

  const validateVideoFile = (file) => {
    const validTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please select a video file.';
    }

    if (file.size > maxSize) {
      return 'File too large. Maximum size is 500MB.';
    }

    return null;
  };

  const validateImageFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please select an image file.';
    }

    if (file.size > maxSize) {
      return 'File too large. Maximum size is 5MB.';
    }

    return null;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Content</h1>

      {/* Alerts */}
      {error && (
        <Alert type="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" className="mb-4" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single Video Upload */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Single Video Upload</h2>
          
          <form onSubmit={handleSingleUpload} className="space-y-4">
            {/* Video File */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video File *
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const error = validateVideoFile(file);
                    if (error) {
                      setError(error);
                      e.target.value = '';
                      return;
                    }
                    setSingleFile(file);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={singleUploading}
              />
              {singleFile && (
                <p className="mt-1 text-sm text-gray-600">
                  Selected: {singleFile.name} ({(singleFile.size / (1024*1024)).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Episode Title *
              </label>
              <input
                type="text"
                name="title"
                value={videoForm.title}
                onChange={handleVideoFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Episode title"
                disabled={singleUploading}
                required
              />
            </div>

            {/* Content Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (Optional)
              </label>
              <select
                name="contentId"
                value={videoForm.contentId}
                onChange={handleVideoFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={singleUploading}
              >
                <option value="">Select existing content (optional)</option>
                {contentList.map(content => (
                  <option key={content._id} value={content._id}>
                    {content.title} ({content.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Episode Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Episode Number *
                </label>
                <input
                  type="number"
                  name="episodeNumber"
                  value={videoForm.episodeNumber}
                  onChange={handleVideoFormChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={singleUploading}
                  required
                />
              </div>

              {/* Season Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Season Number
                </label>
                <input
                  type="number"
                  name="seasonNumber"
                  value={videoForm.seasonNumber}
                  onChange={handleVideoFormChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={singleUploading}
                />
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre (comma separated)
              </label>
              <input
                type="text"
                value={videoForm.genre.join(', ')}
                onChange={(e) => handleArrayFormChange('genre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="action, drama, comedy"
                disabled={singleUploading}
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language (comma separated)
              </label>
              <input
                type="text"
                value={videoForm.language.join(', ')}
                onChange={(e) => handleArrayFormChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="hindi, english"
                disabled={singleUploading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={videoForm.description}
                onChange={handleVideoFormChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Episode description"
                disabled={singleUploading}
              />
            </div>

            {/* Progress */}
            {singleUploading && (
              <div>
                <ProgressBar 
                  value={singleProgress} 
                  showLabel={true}
                  color="purple"
                />
              </div>
            )}

            <Button
              type="submit"
              loading={singleUploading}
              disabled={!singleFile}
              className="w-full"
            >
              {singleUploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </form>
        </Card>

        {/* Batch Upload */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Batch Video Upload</h2>
          
          <form onSubmit={handleBatchUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Files *
              </label>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const validFiles = [];
                  
                  for (const file of files) {
                    const error = validateVideoFile(file);
                    if (error) {
                      setError(`${file.name}: ${error}`);
                      return;
                    }
                    validFiles.push(file);
                  }
                  
                  setBatchFiles(validFiles);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={batchUploading}
              />
              
              {batchFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Selected {batchFiles.length} files:
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {batchFiles.map((file, index) => (
                      <div key={index} className="text-xs text-gray-500">
                        {file.name} ({(file.size / (1024*1024)).toFixed(2)} MB)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Progress */}
            {batchUploading && (
              <div>
                <ProgressBar 
                  value={batchProgress} 
                  showLabel={true}
                  color="purple"
                />
              </div>
            )}

            <Button
              type="submit"
              loading={batchUploading}
              disabled={batchFiles.length === 0}
              className="w-full"
            >
              {batchUploading ? 'Uploading...' : `Upload ${batchFiles.length} Videos`}
            </Button>
          </form>
        </Card>
      </div>

      {/* Thumbnail Upload */}
      <Card className="p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Upload Thumbnail</h2>
        
        <form onSubmit={handleThumbnailUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Episode ID *
              </label>
              <input
                type="text"
                value={episodeId}
                onChange={(e) => setEpisodeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter episode ID"
                disabled={thumbnailUploading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const error = validateImageFile(file);
                    if (error) {
                      setError(error);
                      e.target.value = '';
                      return;
                    }
                    setThumbnailFile(file);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={thumbnailUploading}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            loading={thumbnailUploading}
            disabled={!thumbnailFile || !episodeId}
          >
            {thumbnailUploading ? 'Uploading...' : 'Upload Thumbnail'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default UploadPage;