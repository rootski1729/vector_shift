// src/services/api.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AdminAPI {
  // Authentication
  async login(credentials) {
    const response = await api.post('/admin/login', credentials);
    if (response.data.success) {
      localStorage.setItem('adminToken', response.data.data.token);
    }
    return response.data;
  }

  // Content Management
  async getContent(params = {}) {
    const response = await api.get('/admin/content', { params });
    return response.data.data;
  }

  async createContent(data) {
    const response = await api.post('/admin/content', data);
    return response.data;
  }

  async updateContent(id, data) {
    const response = await api.put(`/admin/content/${id}`, data);
    return response.data;
  }

  async deleteContent(id) {
    const response = await api.delete(`/admin/content/${id}`);
    return response.data;
  }

  async bulkUpdateContent(data) {
    const response = await api.put('/admin/content/bulk-update', data);
    return response.data;
  }

  async publishContent(id) {
    const response = await api.post(`/admin/content/${id}/publish`);
    return response.data;
  }

  async updateFeedSettings(id, settings) {
    const response = await api.put(`/admin/content/${id}/feed-settings`, settings);
    return response.data;
  }

  // Video Upload
  async uploadVideo(formData, onProgress) {
    const response = await api.post('/admin/upload-video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(Math.round(progress));
        }
      },
    });
    return response.data;
  }

  async uploadThumbnail(episodeId, formData) {
    const response = await api.post(`/admin/upload-thumbnail/${episodeId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  // Analytics
  async getPlatformAnalytics() {
    const response = await api.get('/admin/analytics/platform');
    return response.data.data;
  }

  async getContentAnalytics(id) {
    const response = await api.get(`/admin/content/${id}/analytics`);
    return response.data.data;
  }

  async getRealTimeAnalytics() {
    const response = await api.get('/admin/analytics/realtime');
    return response.data.data;
  }

  // System
  async getSystemHealth() {
    const response = await api.get('/admin/system/health');
    return response.data.data;
  }

  async getStorageStats() {
    const response = await api.get('/admin/storage/stats');
    return response.data.data;
  }

  async clearCache() {
    const response = await api.post('/admin/cache/clear');
    return response.data;
  }

  // User Management (mock endpoints)
  async getUsers(params = {}) {
    const response = await api.get('/users/active/count', { params });
    return response.data.data || [];
  }

  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  }
}

export default new AdminAPI();