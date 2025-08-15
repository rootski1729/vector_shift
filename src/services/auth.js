import adminAPI from './api';

export const login = (username, password) =>
  adminAPI.login({ username, password });

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('cino_admin_user');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('adminToken');
  const user = localStorage.getItem('cino_admin_user');
  
  if (token && user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  
  return null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};