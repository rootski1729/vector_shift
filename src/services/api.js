// src/services/api.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Cino-Admin-Dashboard/1.0.0'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add device ID and session ID for tracking
    config.headers['X-Device-ID'] = 'admin_dashboard_' + Date.now();
    config.headers['X-Session-ID'] = 'session_' + Date.now();
    
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
      localStorage.removeItem('cino_admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AdminAPI {
  // ===== AUTHENTICATION =====
  async login(credentials) {
    try {
      const response = await api.post('/api/admin/login', credentials);
      if (response.data?.success) {
        const token = response.data.data?.token;
        if (token) {
          localStorage.setItem('adminToken', token);
          localStorage.setItem('cino_admin_user', JSON.stringify({
            username: credentials.username,
            role: 'admin',
            email: `${credentials.username}@cino.com`
          }));
        }
        return response.data;
      }
      throw new Error(response.data?.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  // ===== HEALTH CHECK =====
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }

  // ===== USER MANAGEMENT =====
  async getUsers(params = {}) {
    try {
      const response = await api.get('/api/users', { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get users failed:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const response = await api.get(`/api/users/${userId}`);
      return response.data?.data || {};
    } catch (error) {
      console.error('Get user failed:', error);
      throw error;
    }
  }

  async createAnonymousUser(userData) {
    try {
      const response = await api.post('/api/users', userData);
      return response.data;
    } catch (error) {
      console.error('Create user failed:', error);
      throw error;
    }
  }

  async updateUserPreferences(userId, preferences) {
    try {
      const response = await api.put(`/api/users/${userId}/preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Update user preferences failed:', error);
      throw error;
    }
  }

  async getUserStats(userId) {
    try {
      const response = await api.get(`/api/users/${userId}/stats`);
      return response.data?.data || {};
    } catch (error) {
      console.error('Get user stats failed:', error);
      throw error;
    }
  }

  async updateUserAnalytics(userId, analyticsData) {
    try {
      const response = await api.put(`/api/users/${userId}/analytics`, analyticsData);
      return response.data;
    } catch (error) {
      console.error('Update user analytics failed:', error);
      throw error;
    }
  }

  async getUserRecommendations(userId, limit = 10) {
    try {
      const response = await api.get(`/api/users/${userId}/recommendations`, {
        params: { limit }
      });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get user recommendations failed:', error);
      throw error;
    }
  }

  // ===== CONTENT MANAGEMENT =====
  async getContent(params = {}) {
    try {
      const response = await api.get('/api/admin/content', { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get content failed:', error);
      throw error;
    }
  }

  async getContentById(contentId, userId = null) {
    try {
      const params = userId ? { userId } : {};
      const response = await api.get(`/api/content/${contentId}`, { params });
      return response.data?.data || {};
    } catch (error) {
      console.error('Get content by ID failed:', error);
      throw error;
    }
  }

  async createContent(contentData) {
    try {
      const response = await api.post('/api/admin/content', contentData);
      return response.data;
    } catch (error) {
      console.error('Create content failed:', error);
      throw error;
    }
  }

  async updateContent(contentId, contentData) {
    try {
      const response = await api.put(`/api/admin/content/${contentId}`, contentData);
      return response.data;
    } catch (error) {
      console.error('Update content failed:', error);
      throw error;
    }
  }

  async deleteContent(contentId) {
    try {
      const response = await api.delete(`/api/admin/content/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Delete content failed:', error);
      throw error;
    }
  }

  async publishContent(contentId) {
    try {
      const response = await api.post(`/api/admin/content/${contentId}/publish`);
      return response.data;
    } catch (error) {
      console.error('Publish content failed:', error);
      throw error;
    }
  }

  async updateFeedSettings(contentId, feedSettings) {
    try {
      const response = await api.put(`/api/admin/content/${contentId}/feed-settings`, feedSettings);
      return response.data;
    } catch (error) {
      console.error('Update feed settings failed:', error);
      throw error;
    }
  }

  async getContentByGenre(genre, params = {}) {
    try {
      const response = await api.get(`/api/content/genre/${genre}`, { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get content by genre failed:', error);
      throw error;
    }
  }

  async getContentByType(type, params = {}) {
    try {
      const response = await api.get(`/api/content/type/${type}`, { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get content by type failed:', error);
      throw error;
    }
  }

  async getSimilarContent(contentId, limit = 10) {
    try {
      const response = await api.get(`/api/content/${contentId}/similar`, {
        params: { limit }
      });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get similar content failed:', error);
      throw error;
    }
  }

  // ===== EPISODE MANAGEMENT =====
  async getEpisodeById(episodeId, userId = null, quality = '720p') {
    try {
      const params = { quality };
      if (userId) params.userId = userId;
      
      const response = await api.get(`/api/episodes/${episodeId}`, { params });
      return response.data?.data || {};
    } catch (error) {
      console.error('Get episode failed:', error);
      throw error;
    }
  }

  async startWatchingEpisode(episodeId, watchData) {
    try {
      const response = await api.post(`/api/episodes/${episodeId}/start`, watchData);
      return response.data;
    } catch (error) {
      console.error('Start watching episode failed:', error);
      throw error;
    }
  }

  async updateWatchProgress(episodeId, progressData) {
    try {
      const response = await api.put(`/api/episodes/${episodeId}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error('Update watch progress failed:', error);
      throw error;
    }
  }

  async markEpisodeCompleted(episodeId, completionData) {
    try {
      const response = await api.post(`/api/episodes/${episodeId}/complete`, completionData);
      return response.data;
    } catch (error) {
      console.error('Mark episode completed failed:', error);
      throw error;
    }
  }

  async likeEpisode(episodeId, userId) {
    try {
      const response = await api.post(`/api/episodes/${episodeId}/like`, { userId });
      return response.data;
    } catch (error) {
      console.error('Like episode failed:', error);
      throw error;
    }
  }

  async shareEpisode(episodeId, shareData) {
    try {
      const response = await api.post(`/api/episodes/${episodeId}/share`, shareData);
      return response.data;
    } catch (error) {
      console.error('Share episode failed:', error);
      throw error;
    }
  }

  async getPopularEpisodes(params = {}) {
    try {
      const response = await api.get('/api/episodes/popular', { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get popular episodes failed:', error);
      throw error;
    }
  }

  // ===== FEED MANAGEMENT =====
  async getRandomFeed(params = {}) {
    try {
      const response = await api.get('/api/feed/random', { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get random feed failed:', error);
      throw error;
    }
  }

  async getContentEpisodes(contentId, params = {}) {
    try {
      const response = await api.get(`/api/feed/content/${contentId}/episodes`, { params });
      return response.data?.data || {};
    } catch (error) {
      console.error('Get content episodes failed:', error);
      throw error;
    }
  }

  async getTrendingContent(params = {}) {
    try {
      const response = await api.get('/api/feed/trending', { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get trending content failed:', error);
      throw error;
    }
  }

  async getPopularByGenre(genre, params = {}) {
    try {
      const response = await api.get(`/api/feed/popular/${genre}`, { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get popular by genre failed:', error);
      throw error;
    }
  }

  async getPersonalizedFeed(userId, params = {}) {
    try {
      const response = await api.get(`/api/feed/personalized/${userId}`, { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get personalized feed failed:', error);
      throw error;
    }
  }

  async getContinueWatching(userId, params = {}) {
    try {
      const response = await api.get(`/api/feed/continue/${userId}`, { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get continue watching failed:', error);
      throw error;
    }
  }

  async searchContent(params = {}) {
    try {
      const response = await api.get('/api/feed/search', { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Search content failed:', error);
      throw error;
    }
  }

  async getFeaturedContent(params = {}) {
    try {
      const response = await api.get('/api/feed/featured', { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get featured content failed:', error);
      throw error;
    }
  }

  // ===== WATCHLIST MANAGEMENT =====
  async getUserWatchlist(userId, params = {}) {
    try {
      const response = await api.get(`/api/watchlist/${userId}`, { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get user watchlist failed:', error);
      throw error;
    }
  }

  async getContinueWatchingList(userId, params = {}) {
    try {
      const response = await api.get(`/api/watchlist/${userId}/continue`, { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get continue watching list failed:', error);
      throw error;
    }
  }

  async getCompletedContent(userId, params = {}) {
    try {
      const response = await api.get(`/api/watchlist/${userId}/completed`, { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Get completed content failed:', error);
      throw error;
    }
  }

  async getUserWatchStats(userId, params = {}) {
    try {
      const response = await api.get(`/api/watchlist/${userId}/stats`, { params });
      return response.data?.data || {};
    } catch (error) {
      console.error('Get user watch stats failed:', error);
      throw error;
    }
  }

  async addToWatchlist(watchlistData) {
    try {
      const response = await api.post('/api/watchlist', watchlistData);
      return response.data;
    } catch (error) {
      console.error('Add to watchlist failed:', error);
      throw error;
    }
  }

  async rateContent(userId, contentId, rating) {
    try {
      const response = await api.post(`/api/watchlist/${userId}/${contentId}/rate`, { rating });
      return response.data;
    } catch (error) {
      console.error('Rate content failed:', error);
      throw error;
    }
  }

  async getContentProgress(userId, contentId) {
    try {
      const response = await api.get(`/api/watchlist/${userId}/${contentId}/progress`);
      return response.data?.data || {};
    } catch (error) {
      console.error('Get content progress failed:', error);
      throw error;
    }
  }

  // ===== VIDEO UPLOAD =====
  async uploadVideo(formData, onProgress) {
    try {
      const response = await api.post('/api/admin/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(Math.round(progress));
          }
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload video failed:', error);
      throw error;
    }
  }

  async batchUploadVideos(formData, onProgress) {
    try {
      const response = await api.post('/api/admin/batch-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(Math.round(progress));
          }
        },
      });
      return response.data;
    } catch (error) {
      console.error('Batch upload failed:', error);
      throw error;
    }
  }

  // ===== ANALYTICS =====
  async trackAnalyticsEvent(eventData) {
    try {
      const response = await api.post('/api/admin/analytics/track', eventData);
      return response.data;
    } catch (error) {
      console.error('Track analytics event failed:', error);
      throw error;
    }
  }

  async getAnalyticsReport(params = {}) {
    try {
      const response = await api.get('/api/admin/analytics/report', { params });
      return response.data?.data || {};
    } catch (error) {
      console.error('Get analytics report failed:', error);
      throw error;
    }
  }

  async getRealTimeAnalytics() {
    try {
      const response = await api.get('/api/admin/analytics/realtime');
      return response.data?.data || {};
    } catch (error) {
      console.error('Get real-time analytics failed:', error);
      throw error;
    }
  }

  async getPlatformAnalytics(params = {}) {
    try {
      const response = await api.get('/api/admin/analytics/platform', { params });
      return response.data?.data || {};
    } catch (error) {
      console.error('Get platform analytics failed:', error);
      throw error;
    }
  }

  async getContentAnalytics(contentId, params = {}) {
    try {
      const response = await api.get(`/api/admin/content/${contentId}/analytics`, { params });
      return response.data?.data || {};
    } catch (error) {
      console.error('Get content analytics failed:', error);
      throw error;
    }
  }

  // ===== SYSTEM MANAGEMENT =====
  async getSystemHealth() {
    try {
      const response = await api.get('/api/admin/system/health');
      return response.data?.data || {};
    } catch (error) {
      console.error('Get system health failed:', error);
      throw error;
    }
  }

  async getStorageStats() {
    try {
      const response = await api.get('/api/admin/storage/stats');
      return response.data?.data || {};
    } catch (error) {
      console.error('Get storage stats failed:', error);
      throw error;
    }
  }

  async clearCache() {
    try {
      const response = await api.post('/api/admin/cache/clear');
      return response.data;
    } catch (error) {
      console.error('Clear cache failed:', error);
      throw error;
    }
  }

  async optimizeStorage(optimizationData) {
    try {
      const response = await api.post('/api/admin/optimize/storage', optimizationData);
      return response.data;
    } catch (error) {
      console.error('Optimize storage failed:', error);
      throw error;
    }
  }

  async purgeCDNCache(purgeData) {
    try {
      const response = await api.post('/api/admin/cdn/purge', purgeData);
      return response.data;
    } catch (error) {
      console.error('Purge CDN cache failed:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====
  async bulkUpdateContent(data) {
    try {
      // This endpoint might not exist, but we'll implement the logic
      const promises = data.contentIds.map(id => 
        this.updateContent(id, data.updates)
      );
      await Promise.all(promises);
      return { success: true, message: 'Bulk update completed' };
    } catch (error) {
      console.error('Bulk update failed:', error);
      throw error;
    }
  }

  async getCacheStats() {
    // Mock method since not in API
    return {
      status: 'healthy',
      hitRate: 94.2,
      memoryUsed: 2.1 * 1024 * 1024 * 1024,
      memoryTotal: 4 * 1024 * 1024 * 1024,
      keys: 25648,
      connections: 45
    };
  }

  async getSettings() {
    // Mock method since not in API
    return {
      siteName: 'Cino Admin',
      siteDescription: 'Professional video streaming platform',
      maxFileSize: 500,
      allowedFormats: ['mp4', 'avi', 'mov'],
      cdnEnabled: true,
      analyticsEnabled: true
    };
  }

  async updateSettings(settings) {
    // Mock method since not in API
    console.log('Settings updated:', settings);
    return { success: true, message: 'Settings updated successfully' };
  }
}

export default new AdminAPI();