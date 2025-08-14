// src/config/constants.js

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Storage Keys
export const TOKEN_KEY = 'adminToken';
export const USER_KEY = 'cino_admin_user';
export const SETTINGS_KEY = 'cino_admin_settings';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
};

// Content Status
export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  PROCESSING: 'processing',
  FAILED: 'failed'
};

// Content Types
export const CONTENT_TYPES = {
  MOVIE: 'movie',
  SERIES: 'series',
  WEB_SERIES: 'web-series'
};

// Content Categories
export const CONTENT_CATEGORIES = {
  BOLLYWOOD: 'bollywood',
  HOLLYWOOD: 'hollywood',
  REGIONAL: 'regional',
  KOREAN: 'korean',
  ANIME: 'anime'
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

// Platforms
export const PLATFORMS = {
  ANDROID: 'android',
  IOS: 'ios',
  WEB: 'web'
};

// Video Quality Options
export const VIDEO_QUALITIES = {
  LOW: '480p',
  MEDIUM: '720p',
  HIGH: '1080p',
  ULTRA: '4k'
};

// File Upload Limits
export const FILE_LIMITS = {
  VIDEO: {
    MAX_SIZE: 500 * 1024 * 1024, // 500MB
    ALLOWED_TYPES: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm']
  },
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  }
};

// System Status
export const SYSTEM_STATUS = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  UNHEALTHY: 'unhealthy',
  UNKNOWN: 'unknown'
};

// Navigation Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CONTENT: '/content',
  CONTENT_CREATE: '/content/create',
  CONTENT_DETAILS: '/content/:id',
  USERS: '/users',
  USER_DETAILS: '/users/:id',
  UPLOAD: '/upload',
  ANALYTICS: '/analytics',
  SYSTEM: '/system',
  SETTINGS: '/settings',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm',
  ISO: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'
};

// Analytics Time Ranges
export const TIME_RANGES = {
  LAST_24_HOURS: '1d',
  LAST_7_DAYS: '7d',
  LAST_30_DAYS: '30d',
  LAST_90_DAYS: '90d',
  LAST_YEAR: '1y'
};

// Chart Colors
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

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Storage Providers
export const STORAGE_PROVIDERS = {
  GCP: 'gcp',
  AWS: 'aws',
  CLOUDFLARE: 'cloudflare',
  LOCAL: 'local'
};

// CDN Providers
export const CDN_PROVIDERS = {
  CLOUDFLARE: 'cloudflare',
  GCP: 'gcp',
  AWS: 'aws'
};

// Age Ratings
export const AGE_RATINGS = {
  ALL: 'all',
  TEEN: '13+',
  MATURE: '16+',
  ADULT: '18+'
};

// Languages
export const LANGUAGES = [
  'hindi',
  'english', 
  'tamil',
  'telugu',
  'kannada',
  'malayalam',
  'bengali',
  'gujarati',
  'marathi',
  'punjabi',
  'korean',
  'japanese',
  'spanish',
  'french',
  'german'
];

// Genres
export const GENRES = [
  'action',
  'adventure',
  'animation',
  'comedy',
  'crime',
  'documentary',
  'drama',
  'family',
  'fantasy',
  'history',
  'horror',
  'music',
  'musical',
  'mystery',
  'romance',
  'sci-fi',
  'thriller',
  'war',
  'western'
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a valid file.',
  UPLOAD_FAILED: 'Upload failed. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  CONTENT_CREATED: 'Content created successfully',
  CONTENT_UPDATED: 'Content updated successfully',
  CONTENT_DELETED: 'Content deleted successfully',
  CONTENT_PUBLISHED: 'Content published successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  UPLOAD_SUCCESS: 'Upload completed successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
  CACHE_CLEARED: 'Cache cleared successfully'
};

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_REAL_TIME: true,
  ENABLE_BULK_OPERATIONS: true,
  ENABLE_ADVANCED_SEARCH: true,
  ENABLE_EXPORT: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: false,
  ENABLE_TWO_FACTOR: false
};

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  GOOD_LOAD_TIME: 2000, // 2 seconds
  WARNING_LOAD_TIME: 5000, // 5 seconds
  GOOD_CACHE_HIT_RATE: 90, // 90%
  WARNING_CACHE_HIT_RATE: 70, // 70%
  GOOD_ERROR_RATE: 1, // 1%
  WARNING_ERROR_RATE: 5 // 5%
};

// Rate Limits (requests per minute)
export const RATE_LIMITS = {
  GENERAL: 100,
  UPLOAD: 10,
  SEARCH: 30,
  ANALYTICS: 50
};

// Cache TTL (in seconds)
export const CACHE_TTL = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 1800,  // 30 minutes
  LONG: 3600,    // 1 hour
  VERY_LONG: 86400 // 24 hours
};

// App Metadata
export const APP_INFO = {
  NAME: 'Cino Admin Dashboard',
  VERSION: '1.2.0',
  AUTHOR: 'Cino Team',
  DESCRIPTION: 'Professional admin dashboard for content management'
};

export default {
  API_BASE_URL,
  TOKEN_KEY,
  USER_KEY,
  USER_ROLES,
  CONTENT_STATUS,
  CONTENT_TYPES,
  CONTENT_CATEGORIES,
  USER_STATUS,
  PLATFORMS,
  VIDEO_QUALITIES,
  FILE_LIMITS,
  SYSTEM_STATUS,
  ROUTES,
  PAGINATION,
  DATE_FORMATS,
  TIME_RANGES,
  CHART_COLORS,
  NOTIFICATION_TYPES,
  STORAGE_PROVIDERS,
  CDN_PROVIDERS,
  AGE_RATINGS,
  LANGUAGES,
  GENRES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
  PERFORMANCE_THRESHOLDS,
  RATE_LIMITS,
  CACHE_TTL,
  APP_INFO
};