// src/components/forms/ContentForm.js
import React, { useState, useEffect } from 'react';
import { Button } from '../ui';

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
    ageRating: 'all',
    status: 'draft'
  });

  const [errors, setErrors] = useState({});

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
        ageRating: initialData.ageRating || 'all',
        status: initialData.status || 'draft'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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

  const validateForm = () => {
    const newErrors = {};

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

    if (formData.releaseYear < 1900 || formData.releaseYear > new Date().getFullYear() + 5) {
      newErrors.releaseYear = 'Release year is invalid';
    }

    if (formData.totalEpisodes < 1) {
      newErrors.totalEpisodes = 'Total episodes must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const genreOptions = [
    'action', 'comedy', 'drama', 'thriller', 'romance', 'horror',
    'adventure', 'crime', 'fantasy', 'sci-fi', 'documentary', 'musical'
  ];

  const languageOptions = [
    'hindi', 'english', 'tamil', 'telugu', 'kannada', 'malayalam',
    'bengali', 'gujarati', 'marathi', 'punjabi', 'korean', 'japanese'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Enter content title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type *
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
            Release Year
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
            Total Episodes
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
            placeholder="action, drama, comedy"
          />
          <div className="mt-1 text-xs text-gray-500">
            Suggestions: {genreOptions.join(', ')}
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
            placeholder="hindi, english"
          />
          <div className="mt-1 text-xs text-gray-500">
            Suggestions: {languageOptions.join(', ')}
          </div>
          {errors.language && (
            <p className="mt-1 text-sm text-red-600">{errors.language}</p>
          )}
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
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

        {/* Age Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age Rating
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
            placeholder="Director name"
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
            placeholder="Producer name"
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
            placeholder="Actor 1, Actor 2, Actor 3"
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
            placeholder="tag1, tag2, tag3"
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
            placeholder="Enter content description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
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
        >
          {initialData ? 'Update Content' : 'Create Content'}
        </Button>
      </div>
    </form>
  );
};

export default ContentForm;