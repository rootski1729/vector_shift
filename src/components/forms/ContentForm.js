// src/components/forms/ContentForm.js
import React, { useState, useEffect } from 'react';
import { Button, Alert } from '../ui';

const ContentForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: [],
    language: [],
    type: 'movie',
    category: 'bollywood',
    releaseYear: new Date().getFullYear(),
    rating: '',
    totalEpisodes: 1,
    cast: [],
    director: '',
    producer: '',
    tags: [],
    ageRating: '13+'
  });

  const [feedSettings, setFeedSettings] = useState({
    isInRandomFeed: true,
    feedPriority: 5,
    feedWeight: 50,
    targetAudience: []
  });

  const [errors, setErrors] = useState({});
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        genre: Array.isArray(initialData.genre) ? initialData.genre : [],
        language: Array.isArray(initialData.language) ? initialData.language : [],
        type: initialData.type || 'movie',
        category: initialData.category || 'bollywood',
        releaseYear: initialData.releaseYear || new Date().getFullYear(),
        rating: initialData.rating || '',
        totalEpisodes: initialData.totalEpisodes || 1,
        cast: Array.isArray(initialData.cast) ? initialData.cast : [],
        director: initialData.director || '',
        producer: initialData.producer || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags : [],
        ageRating: initialData.ageRating || '13+'
      });

      if (initialData.feedSettings) {
        setFeedSettings({
          isInRandomFeed: initialData.feedSettings.isInRandomFeed ?? true,
          feedPriority: initialData.feedSettings.feedPriority || 5,
          feedWeight: initialData.feedSettings.feedWeight || 50,
          targetAudience: Array.isArray(initialData.feedSettings.targetAudience) ? 
            initialData.feedSettings.targetAudience : []
        });
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFeedSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFeedSettings(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFeedSettings(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFeedSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleTargetAudienceChange = (value) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setFeedSettings(prev => ({
      ...prev,
      targetAudience: array
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.genre.length === 0) {
      newErrors.genre = 'At least one genre is required';
    }

    if (formData.language.length === 0) {
      newErrors.language = 'At least one language is required';
    }

    // Year validation
    const currentYear = new Date().getFullYear();
    if (formData.releaseYear < 1900 || formData.releaseYear > currentYear + 5) {
      newErrors.releaseYear = `Release year must be between 1900 and ${currentYear + 5}`;
    }

    // Episodes validation
    if (formData.totalEpisodes < 1) {
      newErrors.totalEpisodes = 'Total episodes must be at least 1';
    }

    // Feed settings validation
    if (feedSettings.feedPriority < 1 || feedSettings.feedPriority > 10) {
      newErrors.feedPriority = 'Feed priority must be between 1 and 10';
    }

    if (feedSettings.feedWeight < 0 || feedSettings.feedWeight > 100) {
      newErrors.feedWeight = 'Feed weight must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        feedSettings: showAdvancedSettings ? feedSettings : undefined
      };
      onSubmit(submitData);
    }
  };

  const genreOptions = [
    'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary',
    'drama', 'family', 'fantasy', 'history', 'horror', 'music', 'musical',
    'mystery', 'romance', 'sci-fi', 'thriller', 'war', 'western'
  ];

  const languageOptions = [
    'hindi', 'english', 'tamil', 'telugu', 'kannada', 'malayalam',
    'bengali', 'gujarati', 'marathi', 'punjabi', 'korean', 'japanese',
    'spanish', 'french', 'german'
  ];

  const targetAudienceOptions = [
    '18-25', '26-35', '36-45', '46-55', '55+',
    'action-lovers', 'comedy-fans', 'drama-enthusiasts',
    'family-viewers', 'young-adults', 'teenagers'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter content title (e.g., Avengers: Endgame Shorts)"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="web-series">Web Series</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="bollywood">Bollywood</option>
              <option value="hollywood">Hollywood</option>
              <option value="regional">Regional</option>
              <option value="korean">Korean</option>
              <option value="anime">Anime</option>
            </select>
          </div>

          {/* Release Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Release Year *
            </label>
            <input
              type="number"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 5}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.releaseYear ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.releaseYear && (
              <p className="mt-1 text-sm text-red-600">{errors.releaseYear}</p>
            )}
          </div>

          {/* Total Episodes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Episodes *
            </label>
            <input
              type="number"
              name="totalEpisodes"
              value={formData.totalEpisodes}
              onChange={handleChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.totalEpisodes ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.totalEpisodes && (
              <p className="mt-1 text-sm text-red-600">{errors.totalEpisodes}</p>
            )}
          </div>

          {/* Age Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Rating *
            </label>
            <select
              name="ageRating"
              value={formData.ageRating}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Ages</option>
              <option value="13+">13+</option>
              <option value="16+">16+</option>
              <option value="18+">18+</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Rating
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Rating</option>
              <option value="U">U (Universal)</option>
              <option value="U/A">U/A (Parental Guidance)</option>
              <option value="A">A (Adults Only)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Content Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genres * (comma separated)
            </label>
            <input
              type="text"
              value={formData.genre.join(', ')}
              onChange={(e) => handleArrayChange('genre', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.genre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="action, superhero, epic"
            />
            <div className="mt-1 text-xs text-gray-500">
              Available: {genreOptions.join(', ')}
            </div>
            {errors.genre && (
              <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
            )}
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages * (comma separated)
            </label>
            <input
              type="text"
              value={formData.language.join(', ')}
              onChange={(e) => handleArrayChange('language', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.language ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="english, hindi"
            />
            <div className="mt-1 text-xs text-gray-500">
              Available: {languageOptions.join(', ')}
            </div>
            {errors.language && (
              <p className="mt-1 text-sm text-red-600">{errors.language}</p>
            )}
          </div>

          {/* Director */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Director
            </label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Russo Brothers"
            />
          </div>

          {/* Producer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Producer
            </label>
            <input
              type="text"
              name="producer"
              value={formData.producer}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Marvel Studios"
            />
          </div>

          {/* Cast */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cast (comma separated)
            </label>
            <input
              type="text"
              value={formData.cast.join(', ')}
              onChange={(e) => handleArrayChange('cast', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Robert Downey Jr, Chris Evans, Scarlett Johansson"
            />
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleArrayChange('tags', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="marvel, superhero, action, epic"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Short clips from the epic Marvel movie..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Feed Settings */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Feed Settings</h3>
          <button
            type="button"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAdvancedSettings ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>

        {showAdvancedSettings && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Include in Random Feed */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isInRandomFeed"
                  checked={feedSettings.isInRandomFeed}
                  onChange={handleFeedSettingChange}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include in Random Feed</span>
              </label>
            </div>

            {/* Feed Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feed Priority (1-10)
              </label>
              <input
                type="number"
                name="feedPriority"
                value={feedSettings.feedPriority}
                onChange={handleFeedSettingChange}
                min="1"
                max="10"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.feedPriority ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.feedPriority && (
                <p className="mt-1 text-sm text-red-600">{errors.feedPriority}</p>
              )}
            </div>

            {/* Feed Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feed Weight (0-100)
              </label>
              <input
                type="number"
                name="feedWeight"
                value={feedSettings.feedWeight}
                onChange={handleFeedSettingChange}
                min="0"
                max="100"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.feedWeight ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.feedWeight && (
                <p className="mt-1 text-sm text-red-600">{errors.feedWeight}</p>
              )}
            </div>

            {/* Target Audience */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience (comma separated)
              </label>
              <input
                type="text"
                value={feedSettings.targetAudience.join(', ')}
                onChange={(e) => handleTargetAudienceChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="18-35, action-lovers"
              />
              <div className="mt-1 text-xs text-gray-500">
                Options: {targetAudienceOptions.join(', ')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {initialData ? 'Update Content' : 'Create Content'}
        </Button>
      </div>
    </form>
  );
};

export default ContentForm;