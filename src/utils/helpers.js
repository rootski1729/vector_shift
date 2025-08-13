// src/utils/helpers.js

// Format file size to human readable format
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
};

// Format duration from seconds to human readable format
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format numbers with commas
export const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat().format(num);
};

// Format large numbers (1K, 1M, 1B)
export const formatLargeNumber = (num) => {
  if (!num) return '0';
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Calculate time ago
export const timeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate video file
export const isValidVideoFile = (file) => {
  const validTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  const maxSize = 100 * 1024 * 1024; // 100MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};

// Validate image file
export const isValidImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Sanitize filename
export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    published: 'text-green-600',
    draft: 'text-yellow-600',
    archived: 'text-gray-600',
    processing: 'text-blue-600',
    failed: 'text-red-600',
    active: 'text-green-600',
    inactive: 'text-gray-600',
    suspended: 'text-red-600',
    healthy: 'text-green-600',
    degraded: 'text-yellow-600',
    unhealthy: 'text-red-600'
  };
  
  return colors[status] || 'text-gray-600';
};

// Get status background color
export const getStatusBgColor = (status) => {
  const colors = {
    published: 'bg-green-100',
    draft: 'bg-yellow-100',
    archived: 'bg-gray-100',
    processing: 'bg-blue-100',
    failed: 'bg-red-100',
    active: 'bg-green-100',
    inactive: 'bg-gray-100',
    suspended: 'bg-red-100',
    healthy: 'bg-green-100',
    degraded: 'bg-yellow-100',
    unhealthy: 'bg-red-100'
  };
  
  return colors[status] || 'bg-gray-100';
};

// Download file
export const downloadFile = (data, filename, type = 'application/json') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// URL helpers
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return searchParams.toString();
};

// Error handling
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('401')) {
    return 'Authentication failed. Please login again.';
  }
  
  if (error.message.includes('403')) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.message.includes('404')) {
    return 'The requested resource was not found.';
  }
  
  if (error.message.includes('429')) {
    return 'Too many requests. Please try again later.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please check your connection.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

// General helper functions
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str, length = 100) {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export function isEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}

// Constants
export const CONTENT_TYPES = {
  MOVIE: 'movie',
  SERIES: 'series',
  WEB_SERIES: 'web-series'
};

export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  PROCESSING: 'processing'
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

export const VIDEO_QUALITIES = {
  LOW: '480p',
  MEDIUM: '720p',
  HIGH: '1080p',
  ULTRA: '4k'
};

export const PLATFORMS = {
  ANDROID: 'android',
  IOS: 'ios',
  WEB: 'web'
};

// Chart colors
export const CHART_COLORS = [
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#6366f1', // Indigo
  '#84cc16', // Lime
  '#f97316', // Orange
  '#ec4899', // Pink
  '#14b8a6'  // Teal
];

export default {
  formatFileSize,
  formatDuration,
  formatNumber,
  formatLargeNumber,
  timeAgo,
  debounce,
  throttle,
  deepClone,
  generateId,
  isValidEmail,
  isValidVideoFile,
  isValidImageFile,
  getFileExtension,
  sanitizeFilename,
  calculatePercentage,
  getStatusColor,
  getStatusBgColor,
  downloadFile,
  copyToClipboard,
  storage,
  buildQueryString,
  handleApiError,
  CONTENT_TYPES,
  CONTENT_STATUS,
  USER_STATUS,
  VIDEO_QUALITIES,
  PLATFORMS,
  CHART_COLORS,
  capitalize,
  truncate,
  isEmpty
};