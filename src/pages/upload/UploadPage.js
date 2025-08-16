// src/pages/upload/UploadPage.js
import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, ProgressBar, Modal, Badge, SearchInput } from '../../components/ui';
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
  const [batchResults, setBatchResults] = useState([]);

  // Video Form Data (Enhanced for API)
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    contentId: '',
    episodeNumber: 1,
    seasonNumber: 1,
    duration: 0,
    generateQualities: true
  });

  // Content Search
  const [contentSearch, setContentSearch] = useState('');
  const [showContentModal, setShowContentModal] = useState(false);

  // Upload History
  const [uploadHistory, setUploadHistory] = useState([]);

  useEffect(() => {
    fetchContent();
    loadUploadHistory();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await adminAPI.getContent({ limit: 100 });
      setContentList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch content:', err);
    }
  };

  const loadUploadHistory = () => {
    const history = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
    setUploadHistory(history.slice(0, 10)); // Last 10 uploads
  };

  const saveToUploadHistory = (uploadData) => {
    const history = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
    history.unshift({
      ...uploadData,
      timestamp: new Date().toISOString(),
      id: Date.now()
    });
    localStorage.setItem('uploadHistory', JSON.stringify(history.slice(0, 50)));
    loadUploadHistory();
  };

  const handleVideoFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVideoForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getContentInfo = (contentId) => {
    return contentList.find(c => c._id === contentId);
  };

  const filteredContent = contentList.filter(content =>
    content.title.toLowerCase().includes(contentSearch.toLowerCase()) ||
    content.type.toLowerCase().includes(contentSearch.toLowerCase())
  );

  // Single Video Upload
  const handleSingleUpload = async (e) => {
    e.preventDefault();
    
    if (!singleFile) {
      setError('Please select a video file');
      return;
    }

    if (!videoForm.title || !videoForm.episodeNumber) {
      setError('Please fill in required fields (title and episode number)');
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
      formData.append('episodeNumber', videoForm.episodeNumber.toString());
      formData.append('seasonNumber', videoForm.seasonNumber.toString());
      formData.append('duration', videoForm.duration.toString());
      formData.append('generateQualities', videoForm.generateQualities.toString());
      
      if (videoForm.contentId) {
        formData.append('contentId', videoForm.contentId);
      }

      const result = await adminAPI.uploadVideo(formData, (progress) => {
        setSingleProgress(progress);
      });

      const uploadData = {
        fileName: singleFile.name,
        title: videoForm.title,
        episodeNumber: videoForm.episodeNumber,
        seasonNumber: videoForm.seasonNumber,
        contentTitle: getContentInfo(videoForm.contentId)?.title,
        status: 'completed',
        episodeId: result.data?.episodeId
      };

      saveToUploadHistory(uploadData);
      setSuccess(`Video uploaded successfully! Episode ID: ${result.data?.episodeId || 'Generated'}`);
      
      // Reset form
      setSingleFile(null);
      setSingleProgress(0);
      setVideoForm({
        title: '',
        description: '',
        contentId: '',
        episodeNumber: 1,
        seasonNumber: 1,
        duration: 0,
        generateQualities: true
      });
      
      // Reset file input
      const fileInput = document.getElementById('single-video-input');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      setError(err.message || 'Upload failed');
      saveToUploadHistory({
        fileName: singleFile.name,
        title: videoForm.title,
        status: 'failed',
        error: err.message
      });
    } finally {
      setSingleUploading(false);
    }
  };

  // Batch Upload
  const handleBatchUpload = async (e) => {
    e.preventDefault();
    
    if (batchFiles.length === 0) {
      setError('Please select video files');
      return;
    }

    if (!videoForm.contentId) {
      setError('Please select a content for batch upload');
      return;
    }

    try {
      setBatchUploading(true);
      setError(null);
      setBatchProgress(0);
      setBatchResults([]);

      const results = [];
      const totalFiles = batchFiles.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = batchFiles[i];
        const formData = new FormData();
        
        formData.append('videos', file);
        formData.append('contentId', videoForm.contentId);
        formData.append('seasonNumber', videoForm.seasonNumber.toString());

        try {
          const result = await adminAPI.batchUploadVideos(formData);
          results.push({
            fileName: file.name,
            status: 'success',
            episodeId: result.data?.episodeId,
            message: 'Upload successful'
          });
          
          saveToUploadHistory({
            fileName: file.name,
            contentTitle: getContentInfo(videoForm.contentId)?.title,
            seasonNumber: videoForm.seasonNumber,
            status: 'completed',
            episodeId: result.data?.episodeId
          });
        } catch (err) {
          results.push({
            fileName: file.name,
            status: 'error',
            message: err.message || 'Upload failed'
          });
          
          saveToUploadHistory({
            fileName: file.name,
            status: 'failed',
            error: err.message
          });
        }

        setBatchProgress(((i + 1) / totalFiles) * 100);
      }

      setBatchResults(results);
      const successCount = results.filter(r => r.status === 'success').length;
      const failCount = results.filter(r => r.status === 'error').length;
      
      if (failCount === 0) {
        setSuccess(`All ${successCount} videos uploaded successfully!`);
      } else {
        setError(`${successCount} videos uploaded, ${failCount} failed. Check results below.`);
      }

      setBatchFiles([]);
      setBatchProgress(0);
      
      // Reset file input
      const fileInput = document.getElementById('batch-video-input');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      setError(err.message || 'Batch upload failed');
    } finally {
      setBatchUploading(false);
    }
  };

  const validateVideoFile = (file) => {
    const validTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please select a video file (MP4, MPEG, MOV, AVI, WebM).';
    }

    if (file.size > maxSize) {
      return 'File too large. Maximum size is 500MB.';
    }

    return null;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(Math.round(video.duration));
      };
      video.onerror = () => resolve(0);
      video.src = URL.createObjectURL(file);
    });
  };

  const handleSingleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateVideoFile(file);
      if (error) {
        setError(error);
        e.target.value = '';
        return;
      }
      setSingleFile(file);
      
      // Auto-fill title if empty
      if (!videoForm.title) {
        const titleFromFile = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
        setVideoForm(prev => ({ ...prev, title: titleFromFile }));
      }
      
      // Get video duration
      try {
        const duration = await getVideoDuration(file);
        setVideoForm(prev => ({ ...prev, duration }));
      } catch (err) {
        console.error('Could not get video duration:', err);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Video Upload Center</h1>
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowContentModal(true)}
          >
            Browse Content
          </Button>
          <Button 
            variant="secondary" 
            onClick={fetchContent}
          >
            Refresh Content
          </Button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Single Video Upload */}
        <div className="xl:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Single Episode Upload
            </h2>
            
            <form onSubmit={handleSingleUpload} className="space-y-4">
              {/* Video File */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File *
                </label>
                <input
                  id="single-video-input"
                  type="file"
                  accept="video/*"
                  onChange={handleSingleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  disabled={singleUploading}
                />
                {singleFile && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{singleFile.name}</p>
                        <p className="text-xs text-gray-500">
                          Size: {formatFileSize(singleFile.size)}
                          {videoForm.duration > 0 && ` • Duration: ${Math.floor(videoForm.duration / 60)}:${(videoForm.duration % 60).toString().padStart(2, '0')}`}
                        </p>
                      </div>
                      <Badge variant="info">Ready</Badge>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Episode Title */}
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
                    placeholder="Episode 1: The Beginning"
                    disabled={singleUploading}
                    required
                  />
                </div>

                {/* Content Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Series
                  </label>
                  <select
                    name="contentId"
                    value={videoForm.contentId}
                    onChange={handleVideoFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={singleUploading}
                  >
                    <option value="">Select content (optional)</option>
                    {contentList.map(content => (
                      <option key={content._id} value={content._id}>
                        {content.title} ({content.type})
                      </option>
                    ))}
                  </select>
                </div>

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

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Episode Description
                </label>
                <textarea
                  name="description"
                  value={videoForm.description}
                  onChange={handleVideoFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="First episode of the series..."
                  disabled={singleUploading}
                />
              </div>

              {/* Options */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="generateQualities"
                    checked={videoForm.generateQualities}
                    onChange={handleVideoFormChange}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    disabled={singleUploading}
                  />
                  <span className="ml-2 text-sm text-gray-700">Generate multiple quality versions (480p, 720p, 1080p)</span>
                </label>
              </div>

              {/* Progress */}
              {singleUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{singleProgress}%</span>
                  </div>
                  <ProgressBar 
                    value={singleProgress} 
                    showLabel={false}
                    color="purple"
                  />
                </div>
              )}

              <Button
                type="submit"
                loading={singleUploading}
                disabled={!singleFile || singleUploading}
                className="w-full"
              >
                {singleUploading ? 'Uploading...' : 'Upload Episode'}
              </Button>
            </form>
          </Card>

          {/* Batch Upload */}
          <Card className="p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Batch Upload
            </h2>
            
            <form onSubmit={handleBatchUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Content Selection (Required for batch) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Content Series *
                  </label>
                  <select
                    name="contentId"
                    value={videoForm.contentId}
                    onChange={handleVideoFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={batchUploading}
                    required
                  >
                    <option value="">Select content series</option>
                    {contentList.map(content => (
                      <option key={content._id} value={content._id}>
                        {content.title} ({content.type})
                      </option>
                    ))}
                  </select>
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
                    disabled={batchUploading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Files *
                </label>
                <input
                  id="batch-video-input"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={batchUploading}
                />
                
                {batchFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Selected {batchFiles.length} files:
                    </p>
                    <div className="max-h-32 overflow-y-auto space-y-1 bg-gray-50 p-3 rounded">
                      {batchFiles.map((file, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">{file.name}</span>
                          <span className="text-gray-500">{formatFileSize(file.size)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress */}
              {batchUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Batch uploading...</span>
                    <span>{Math.round(batchProgress)}%</span>
                  </div>
                  <ProgressBar 
                    value={batchProgress} 
                    showLabel={false}
                    color="blue"
                  />
                </div>
              )}

              {/* Batch Results */}
              {batchResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-gray-900">Upload Results:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {batchResults.map((result, index) => (
                      <div key={index} className="flex justify-between items-center text-sm p-2 rounded bg-gray-50">
                        <span>{result.fileName}</span>
                        <Badge variant={result.status === 'success' ? 'success' : 'danger'}>
                          {result.status === 'success' ? 'Success' : 'Failed'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                loading={batchUploading}
                disabled={batchFiles.length === 0 || !videoForm.contentId || batchUploading}
                className="w-full"
              >
                {batchUploading ? 'Uploading...' : `Upload ${batchFiles.length} Videos`}
              </Button>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upload Guidelines */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Upload Guidelines</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Max file size: 500MB
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Formats: MP4, AVI, MOV, WebM
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Auto-generate quality versions
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Batch upload for series
              </div>
            </div>
          </Card>

          {/* Recent Uploads */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Uploads</h3>
            <div className="space-y-2">
              {uploadHistory.length > 0 ? (
                uploadHistory.slice(0, 5).map((upload) => (
                  <div key={upload.id} className="p-2 bg-gray-50 rounded text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium truncate">{upload.title || upload.fileName}</span>
                      <Badge variant={upload.status === 'completed' ? 'success' : 'danger'}>
                        {upload.status}
                      </Badge>
                    </div>
                    {upload.contentTitle && (
                      <p className="text-gray-500 text-xs mt-1">{upload.contentTitle}</p>
                    )}
                    <p className="text-gray-400 text-xs">
                      {new Date(upload.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent uploads</p>
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Content</span>
                <span className="text-sm font-medium">{contentList.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Recent Uploads</span>
                <span className="text-sm font-medium">{uploadHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {uploadHistory.length > 0 
                    ? Math.round((uploadHistory.filter(u => u.status === 'completed').length / uploadHistory.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Content Modal */}
      <Modal
        isOpen={showContentModal}
        onClose={() => setShowContentModal(false)}
        title="Browse Content"
        size="lg"
      >
        <div className="space-y-4">
          <SearchInput
            value={contentSearch}
            onChange={setContentSearch}
            placeholder="Search content..."
            className="w-full"
          />
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredContent.map((content) => (
              <div key={content._id} 
                   className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                   onClick={() => {
                     setVideoForm(prev => ({ ...prev, contentId: content._id }));
                     setShowContentModal(false);
                   }}>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{content.title}</h4>
                    <p className="text-sm text-gray-500">
                      {content.type} • {content.totalEpisodes} episodes
                    </p>
                  </div>
                  <Badge variant={content.status === 'published' ? 'success' : 'default'}>
                    {content.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadPage;