// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ContentPage from './pages/content/ContentPage';
import UsersPage from './pages/users/UsersPage';
import UploadPage from './pages/upload/UploadPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import SystemPage from './pages/system/SystemPage';
import { Alert } from './components/ui';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Auth Route Component (redirect if already logged in)
const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Mock user data - in real app, you'd validate token with backend
      setUser({
        username: 'admin',
        role: 'admin',
        email: 'admin@cino.com'
      });
    }
    setLoading(false);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    navigate('/login');
    showNotification('Logged out successfully', 'success');
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Check if current route is login
  const isLoginPage = location.pathname === '/login';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Global Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            type={notification.type}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Alert>
        </div>
      )}

      {/* Login Page (Full Screen) */}
      {isLoginPage ? (
        <Routes>
          <Route 
            path="/login" 
            element={
              <AuthRoute>
                <LoginPage onLoginSuccess={() => {
                  setUser({ username: 'admin', role: 'admin' });
                  showNotification('Login successful', 'success');
                }} />
              </AuthRoute>
            } 
          />
        </Routes>
      ) : (
        /* Main App Layout */
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar 
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            user={user}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
              onLogout={handleLogout}
              user={user}
            />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
              <Routes>
                {/* Dashboard */}
                <Route 
                  path="/" 
                  element={<Navigate to="/dashboard" replace />} 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Content Management */}
                <Route 
                  path="/content" 
                  element={
                    <ProtectedRoute>
                      <ContentPage />
                    </ProtectedRoute>
                  } 
                />

                {/* User Management */}
                <Route 
                  path="/users" 
                  element={
                    <ProtectedRoute>
                      <UsersPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Upload */}
                <Route 
                  path="/upload" 
                  element={
                    <ProtectedRoute>
                      <UploadPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Analytics */}
                <Route 
                  path="/analytics" 
                  element={
                    <ProtectedRoute>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  } 
                />

                {/* System & Settings */}
                <Route 
                  path="/system" 
                  element={
                    <ProtectedRoute>
                      <SystemPage />
                    </ProtectedRoute>
                  } 
                />

                {/* 404 Page */}
                <Route 
                  path="*" 
                  element={
                    <div className="p-6">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-gray-600 mb-4">Page not found</p>
                        <button
                          onClick={() => navigate('/dashboard')}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          Go to Dashboard
                        </button>
                      </div>
                    </div>
                  } 
                />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;