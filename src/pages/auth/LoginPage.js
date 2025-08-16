// src/pages/auth/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Alert } from '../../components/ui';
import { PlayCircle, Eye, EyeOff, Lock, User, Shield, Monitor } from 'lucide-react';
import adminAPI from '../../services/api';

const LoginPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    checkSystemHealth();
    checkLockoutStatus();
  }, []);

  useEffect(() => {
    let interval;
    if (isLocked && lockoutTime) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        if (now >= lockoutTime) {
          setIsLocked(false);
          setLockoutTime(null);
          setLoginAttempts(0);
          localStorage.removeItem('loginLockout');
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockoutTime]);

  const checkSystemHealth = async () => {
    try {
      const health = await adminAPI.healthCheck();
      setSystemHealth(health);
    } catch (err) {
      setSystemHealth({ status: 'degraded', message: 'System check failed' });
    }
  };

  const checkLockoutStatus = () => {
    const lockout = localStorage.getItem('loginLockout');
    if (lockout) {
      const lockoutData = JSON.parse(lockout);
      const now = new Date().getTime();
      if (now < lockoutData.unlockTime) {
        setIsLocked(true);
        setLockoutTime(lockoutData.unlockTime);
        setLoginAttempts(lockoutData.attempts);
      } else {
        localStorage.removeItem('loginLockout');
      }
    }
  };

  const handleLockout = (attempts) => {
    const lockoutDuration = Math.min(attempts * 60000, 900000); // Max 15 minutes
    const unlockTime = new Date().getTime() + lockoutDuration;
    
    localStorage.setItem('loginLockout', JSON.stringify({
      attempts,
      unlockTime
    }));
    
    setIsLocked(true);
    setLockoutTime(unlockTime);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError('Account temporarily locked. Please try again later.');
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await adminAPI.login(formData);
      
      if (response.success) {
        // Reset login attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem('loginLockout');
        
        // Track successful login
        await adminAPI.trackAnalyticsEvent({
          eventType: 'admin_login_success',
          category: 'authentication',
          eventData: {
            username: formData.username,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            fromPath: from
          }
        });

        onLoginSuccess?.();
        navigate(from, { replace: true });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Track failed login attempt
      try {
        await adminAPI.trackAnalyticsEvent({
          eventType: 'admin_login_failed',
          category: 'authentication',
          eventData: {
            username: formData.username,
            attempt: newAttempts,
            error: err.message,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        });
      } catch (trackErr) {
        console.error('Failed to track login attempt:', trackErr);
      }

      if (newAttempts >= 5) {
        handleLockout(newAttempts);
        setError(`Too many failed attempts. Account locked for ${Math.min(newAttempts, 15)} minutes.`);
      } else {
        setError(err.message || 'Invalid credentials');
        if (newAttempts >= 3) {
          setError(`Invalid credentials. ${5 - newAttempts} attempts remaining before lockout.`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (credentials) => {
    setFormData(credentials);
    setError(null);
  };

  const demoCredentials = [
    { 
      username: 'admin', 
      password: 'admin123', 
      role: 'Super Administrator',
      description: 'Full system access'
    },
    { 
      username: 'manager', 
      password: 'manager123', 
      role: 'Content Manager',
      description: 'Content & user management'
    },
    { 
      username: 'editor', 
      password: 'editor123', 
      role: 'Content Editor',
      description: 'Content creation & editing'
    }
  ];

  const getRemainingLockoutTime = () => {
    if (!isLocked || !lockoutTime) return '';
    const remaining = Math.max(0, lockoutTime - new Date().getTime());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSystemStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'unhealthy': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSystemStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return '🟢';
      case 'degraded': return '🟡';
      case 'unhealthy': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <PlayCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Cino Admin Portal
          </h2>
          <p className="mt-2 text-sm text-purple-100">
            Professional content management system
          </p>
          
          {/* System Status */}
          {systemHealth && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              <span className={`text-sm ${getSystemStatusColor(systemHealth.status)}`}>
                {getSystemStatusIcon(systemHealth.status)} System {systemHealth.status || 'unknown'}
              </span>
            </div>
          )}
        </div>

        {/* Login Form */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <Alert type="error" className="mb-4">
                {error}
              </Alert>
            )}

            {/* Lockout Warning */}
            {isLocked && (
              <Alert type="warning" className="mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Account locked. Unlock in: {getRemainingLockoutTime()}</span>
                </div>
              </Alert>
            )}

            {/* Login Attempts Warning */}
            {loginAttempts >= 3 && !isLocked && (
              <Alert type="warning" className="mb-4">
                {5 - loginAttempts} login attempts remaining before temporary lockout
              </Alert>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
                  placeholder="Enter your username"
                  disabled={loading || isLocked}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
                  placeholder="Enter your password"
                  disabled={loading || isLocked}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || isLocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-purple-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-purple-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-white border-opacity-30 bg-white bg-opacity-20 text-purple-600 focus:ring-purple-500 focus:ring-opacity-50"
                  disabled={loading || isLocked}
                />
                <span className="ml-2 text-sm text-purple-100">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-purple-200 hover:text-white underline"
                disabled={loading || isLocked}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              disabled={!formData.username || !formData.password || isLocked}
              className="w-full bg-white bg-opacity-20 backdrop-blur-sm text-white border border-white border-opacity-30 hover:bg-opacity-30 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              {loading ? 'Signing in...' : isLocked ? 'Account Locked' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-white border-opacity-20">
            <p className="text-sm text-purple-100 mb-3 text-center">Demo Credentials:</p>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(cred)}
                  className="w-full text-left p-3 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || isLocked}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-white">{cred.username}</p>
                      <p className="text-xs text-purple-200">{cred.role}</p>
                      <p className="text-xs text-purple-300">{cred.description}</p>
                    </div>
                    <div className="text-xs text-purple-200">
                      Click to fill
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-white border-opacity-20">
            <div className="flex items-center space-x-2 text-xs text-purple-200">
              <Shield className="w-4 h-4" />
              <span>Secured with enterprise-grade authentication</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-purple-200 mt-1">
              <Monitor className="w-4 h-4" />
              <span>All login attempts are monitored and logged</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center space-y-2">
          <p className="text-sm text-purple-200">
            Need help? Contact{' '}
            <a href="mailto:support@cino.com" className="text-white underline">
              support@cino.com
            </a>
          </p>
          <p className="text-xs text-purple-300">
            Version 1.2.0 • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;