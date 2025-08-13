import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { instance };
// src/services/api.js
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
    this.timeout = 30000; // 30 seconds
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('adminToken');
  }

  // Set auth token
  setAuthToken(token) {
    localStorage.setItem('adminToken', token);
  }

  // Remove auth token
  clearAuthToken() {
    localStorage.removeItem('adminToken');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuthToken();
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    const url = searchParams.toString() ? `${endpoint}?${searchParams}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// API endpoints organized by feature
export class AdminAPI extends ApiService {
  // Authentication
  async login(credentials) {
    return this.post('/admin/login', credentials);
  }

  async logout() {
    this.clearAuthToken();
    return Promise.resolve();
  }

  // Content Management
  async getContent(params = {}) {
    return this.get('/admin/content', params);
  }

  async createContent(data) {
    return this.post('/admin/content', data);
  }

  async updateContent(contentId, data) {
    return this.put(`/admin/content/${contentId}`, data);
  }

  async deleteContent(contentId, options = {}) {
    return this.delete(`/admin/content/${contentId}`, {
      body: JSON.stringify(options),
    });
  }

  async publishContent(contentId) {
    return this.post(`/admin/content/${contentId}/publish`);
  }

  async updateFeedSettings(contentId, settings) {
    return this.put(`/admin/content/${contentId}/feed-settings`, settings);
  }

  async bulkUpdateContent(contentIds, updates) {
    return this.put('/admin/content/bulk-update', { contentIds, updates });
  }

  // Video Upload
  async uploadVideo(formData, onProgress = null) {
    const endpoint = '/admin/upload-video';
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Upload timeout'));

      xhr.open('POST', url);
      xhr.timeout = 300000; // 5 minutes for file uploads
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }

  async batchUploadVideos(formData, onProgress = null) {
    return this.uploadVideo(formData, onProgress);
  }

  // Analytics
  async getPlatformAnalytics(params = {}) {
    return this.get('/admin/analytics/platform', params);
  }

  async getContentAnalytics(contentId, params = {}) {
    return this.get(`/admin/content/${contentId}/analytics`, params);
  }

  async getRealTimeAnalytics() {
    return this.get('/admin/analytics/realtime');
  }

  async generateReport(params = {}) {
    return this.get('/admin/analytics/report', params);
  }

  // System Management
  async getSystemHealth() {
    return this.get('/admin/system/health');
  }

  async getGCPHealth() {
    return this.get('/admin/system/gcp-health');
  }

  async getStorageStats() {
    return this.get('/admin/storage/stats');
  }

  async getCacheStats() {
    return this.get('/admin/cache/stats');
  }

  async clearCache() {
    return this.post('/admin/cache/clear');
  }

  async warmCache() {
    return this.post('/admin/cache/warm');
  }

  // User Management (mock endpoints - extend based on your backend)
  async getUsers(params = {}) {
    return this.get('/admin/users', params);
  }

  async getUserById(userId) {
    return this.get(`/admin/users/${userId}`);
  }

  async updateUserStatus(userId, status) {
    return this.put(`/admin/users/${userId}/status`, { status });
  }

  async getUserAnalytics(userId, params = {}) {
    return this.get(`/admin/users/${userId}/analytics`, params);
  }

  // Settings
  async getSettings() {
    return this.get('/admin/settings');
  }

  async updateSettings(settings) {
    return this.put('/admin/settings', settings);
  }
}

// Create singleton instance
export const adminAPI = new AdminAPI();

// Export both class and instance
export default adminAPI;