// App-wide constants
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
export const TOKEN_KEY = 'cino_admin_token';
export const USER_KEY = 'cino_admin_user';
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};
export const CDN_PROVIDERS = ['cloudflare', 'gcp', 'aws'];
export const STORAGE_TYPES = ['r2', 'gcp', 'local'];