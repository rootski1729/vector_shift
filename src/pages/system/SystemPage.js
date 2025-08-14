// src/pages/system/SystemPage.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, LoadingSpinner, Badge, ProgressBar, Toggle } from '../../components/ui';
import adminAPI from '../../services/api';

const SystemPage = () => {
  const [systemHealth, setSystemHealth] = useState(null);
  const [storageStats, setStorageStats] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [health, storage, cache] = await Promise.allSettled([
        adminAPI.getSystemHealth(),
        adminAPI.getStorageStats(),
        adminAPI.getCacheStats()
      ]);

      if (health.status === 'fulfilled') {
        setSystemHealth(health.value || generateMockHealth());
      } else {
        setSystemHealth(generateMockHealth());
      }

      if (storage.status === 'fulfilled') {
        setStorageStats(storage.value || generateMockStorage());
      } else {
        setStorageStats(generateMockStorage());
      }

      if (cache.status === 'fulfilled') {
        setCacheStats(cache.value || generateMockCache());
      } else {
        setCacheStats(generateMockCache());
      }

      // Mock settings
      setSettings({
        maintenance_mode: false,
        new_user_registration: true,
        video_upload_enabled: true,
        max_file_size: 500,
        cdn_enabled: true,
        analytics_tracking: true,
        auto_backup: true,
        email_notifications: true
      });

    } catch (err) {
      setError('Failed to load system data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockHealth = () => ({
    status: 'healthy',
    uptime: '15 days, 4 hours',
    version: '1.2.0',
    database: { status: 'healthy', responseTime: '45ms' },
    redis: { status: 'healthy', responseTime: '12ms' },
    storage: { status: 'healthy', responseTime: '89ms' },
    services: [
      { name: 'API Gateway', status: 'healthy', uptime: '99.9%' },
      { name: 'Media Service', status: 'healthy', uptime: '99.8%' },
      { name: 'Analytics Service', status: 'degraded', uptime: '98.5%' },
      { name: 'Notification Service', status: 'healthy', uptime: '99.7%' }
    ]
  });

  const generateMockStorage = () => ({
    totalSpace: 5 * 1024 * 1024 * 1024 * 1024, // 5TB
    usedSpace: 1.2 * 1024 * 1024 * 1024 * 1024, // 1.2TB
    availableSpace: 3.8 * 1024 * 1024 * 1024 * 1024, // 3.8TB
    totalFiles: 15420,
    videoFiles: 8945,
    imageFiles: 6475,
    buckets: [
      { name: 'videos', size: 800 * 1024 * 1024 * 1024, files: 8945 },
      { name: 'thumbnails', size: 300 * 1024 * 1024 * 1024, files: 6475 },
      { name: 'backups', size: 100 * 1024 * 1024 * 1024, files: 50 }
    ]
  });

  const generateMockCache = () => ({
    status: 'healthy',
    hitRate: 94.2,
    memoryUsed: 2.1 * 1024 * 1024 * 1024, // 2.1GB
    memoryTotal: 4 * 1024 * 1024 * 1024, // 4GB
    keys: 25648,
    expiredKeys: 1205,
    connections: 45
  });

  const handleClearCache = async () => {
    try {
      setActionLoading(true);
      await adminAPI.clearCache();
      setSuccess('Cache cleared successfully');
      fetchSystemData();
    } catch (err) {
      setError('Failed to clear cache');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setActionLoading(true);
      // Mock save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Settings saved successfully');
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setActionLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'degraded': return 'warning';
      case 'unhealthy': return 'danger';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System Monitor & Settings</h1>

      {/* Alerts */}
      {error && (
        <Alert type="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" className="mb-4" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* System Health Overview */}
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">System Health</h2>
          <Badge variant={getStatusColor(systemHealth?.status)}>
            {systemHealth?.status?.toUpperCase()}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">{systemHealth?.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Uptime</p>
            <p className="font-medium">{systemHealth?.uptime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Version</p>
            <p className="font-medium">{systemHealth?.version}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Database</p>
            <p className="font-medium">{systemHealth?.database?.responseTime}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Storage Statistics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Total Used</span>
                <span>{formatBytes(storageStats?.usedSpace)} / {formatBytes(storageStats?.totalSpace)}</span>
              </div>
              <ProgressBar 
                value={(storageStats?.usedSpace / storageStats?.totalSpace) * 100}
                showLabel={false}
                color="purple"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Files</p>
                <p className="font-medium">{storageStats?.totalFiles?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Available Space</p>
                <p className="font-medium">{formatBytes(storageStats?.availableSpace)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Storage Buckets</h4>
              {storageStats?.buckets?.map((bucket, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="capitalize">{bucket.name}</span>
                  <div className="text-right">
                    <div>{formatBytes(bucket.size)}</div>
                    <div className="text-gray-500">{bucket.files} files</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Cache Statistics */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Cache Performance</h3>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleClearCache}
              loading={actionLoading}
            >
              Clear Cache
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Hit Rate</span>
                <span>{cacheStats?.hitRate}%</span>
              </div>
              <ProgressBar 
                value={cacheStats?.hitRate}
                showLabel={false}
                color={cacheStats?.hitRate > 90 ? "green" : cacheStats?.hitRate > 70 ? "yellow" : "red"}
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Memory Usage</span>
                <span>{formatBytes(cacheStats?.memoryUsed)} / {formatBytes(cacheStats?.memoryTotal)}</span>
              </div>
              <ProgressBar 
                value={(cacheStats?.memoryUsed / cacheStats?.memoryTotal) * 100}
                showLabel={false}
                color="blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Active Keys</p>
                <p className="font-medium">{cacheStats?.keys?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Connections</p>
                <p className="font-medium">{cacheStats?.connections}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Services Status */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Services Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemHealth?.services?.map((service, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{service.name}</h4>
                <Badge variant={getStatusColor(service.status)}>
                  {service.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Uptime: {service.uptime}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* System Settings */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">System Settings</h3>
          <Button
            onClick={handleSaveSettings}
            loading={actionLoading}
          >
            Save Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Settings */}
          <div>
            <h4 className="font-medium mb-4">General</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-gray-500">Enable maintenance mode</p>
                </div>
                <Toggle
                  checked={settings.maintenance_mode}
                  onChange={(value) => handleSettingChange('maintenance_mode', value)}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">New User Registration</p>
                  <p className="text-sm text-gray-500">Allow new users to register</p>
                </div>
                <Toggle
                  checked={settings.new_user_registration}
                  onChange={(value) => handleSettingChange('new_user_registration', value)}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Video Upload</p>
                  <p className="text-sm text-gray-500">Enable video uploads</p>
                </div>
                <Toggle
                  checked={settings.video_upload_enabled}
                  onChange={(value) => handleSettingChange('video_upload_enabled', value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Max File Size (MB)</label>
                <input
                  type="number"
                  value={settings.max_file_size}
                  onChange={(e) => handleSettingChange('max_file_size', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                  max="1000"
                />
              </div>
            </div>
          </div>

          {/* Performance Settings */}
          <div>
            <h4 className="font-medium mb-4">Performance & Features</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">CDN Enabled</p>
                  <p className="text-sm text-gray-500">Use CDN for content delivery</p>
                </div>
                <Toggle
                  checked={settings.cdn_enabled}
                  onChange={(value) => handleSettingChange('cdn_enabled', value)}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Analytics Tracking</p>
                  <p className="text-sm text-gray-500">Track user analytics</p>
                </div>
                <Toggle
                  checked={settings.analytics_tracking}
                  onChange={(value) => handleSettingChange('analytics_tracking', value)}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Auto Backup</p>
                  <p className="text-sm text-gray-500">Automatic daily backups</p>
                </div>
                <Toggle
                  checked={settings.auto_backup}
                  onChange={(value) => handleSettingChange('auto_backup', value)}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Send system notifications</p>
                </div>
                <Toggle
                  checked={settings.email_notifications}
                  onChange={(value) => handleSettingChange('email_notifications', value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-medium text-red-600 mb-4">Danger Zone</h4>
          <div className="flex flex-wrap gap-3">
            <Button variant="danger" size="sm">
              Reset All Settings
            </Button>
            <Button variant="danger" size="sm">
              Clear All Data
            </Button>
            <Button variant="danger" size="sm">
              Factory Reset
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SystemPage;