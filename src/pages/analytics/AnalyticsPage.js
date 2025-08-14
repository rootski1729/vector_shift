// src/pages/analytics/AnalyticsPage.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, LoadingSpinner } from '../../components/ui';
import { LineChart, BarChart, PieChart } from '../../components/charts';
import adminAPI from '../../services/api';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('users');

  useEffect(() => {
    fetchAnalytics();
    
    // Set up real-time data polling
    const interval = setInterval(fetchRealTimeData, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [platformStats, realTime] = await Promise.allSettled([
        adminAPI.getPlatformAnalytics({ timeRange }),
        adminAPI.getRealTimeAnalytics()
      ]);

      if (platformStats.status === 'fulfilled') {
        setAnalytics(platformStats.value || {});
      }

      if (realTime.status === 'fulfilled') {
        setRealTimeData(realTime.value || {});
      }

    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const data = await adminAPI.getRealTimeAnalytics();
      setRealTimeData(data || {});
    } catch (err) {
      console.error('Failed to fetch real-time data:', err);
    }
  };

  // Mock data for charts (replace with real data from analytics)
  const chartData = {
    userGrowth: [
      { date: '2024-01-01', users: 1200, sessions: 1800, views: 5400 },
      { date: '2024-01-02', users: 1350, sessions: 2100, views: 6200 },
      { date: '2024-01-03', users: 1100, sessions: 1650, views: 4800 },
      { date: '2024-01-04', users: 1500, sessions: 2400, views: 7200 },
      { date: '2024-01-05', users: 1650, sessions: 2800, views: 8100 },
      { date: '2024-01-06', users: 1800, sessions: 3200, views: 9600 },
      { date: '2024-01-07', users: 2000, sessions: 3600, views: 10800 },
    ],
    contentPerformance: [
      { title: 'Popular Movie 1', views: 15000, likes: 1200, shares: 450 },
      { title: 'Web Series EP1', views: 12000, likes: 980, shares: 320 },
      { title: 'Comedy Show', views: 10000, likes: 850, shares: 280 },
      { title: 'Drama Movie', views: 8500, likes: 720, shares: 195 },
      { title: 'Action Series', views: 7800, likes: 650, shares: 165 },
    ],
    platforms: [
      { name: 'Android', users: analytics?.androidUsers || 45, color: '#10b981' },
      { name: 'iOS', users: analytics?.iosUsers || 30, color: '#3b82f6' },
      { name: 'Web', users: analytics?.webUsers || 25, color: '#8b5cf6' },
    ],
    demographics: [
      { age: '18-24', count: 2500 },
      { age: '25-34', count: 4200 },
      { age: '35-44', count: 3100 },
      { age: '45-54', count: 1800 },
      { age: '55+', count: 900 },
    ]
  };

  const metrics = [
    { key: 'users', label: 'Users', value: analytics?.totalUsers || 0, change: '+12.5%', positive: true },
    { key: 'sessions', label: 'Sessions', value: analytics?.totalSessions || 0, change: '+8.2%', positive: true },
    { key: 'views', label: 'Views', value: analytics?.totalViews || 0, change: '+15.7%', positive: true },
    { key: 'retention', label: 'Retention', value: analytics?.retentionRate || '0%', change: '-2.1%', positive: false },
  ];

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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          
          <Button onClick={fetchAnalytics} variant="secondary">
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Real-time Stats */}
      {realTimeData && (
        <Card className="p-6 mb-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <h3 className="text-lg font-semibold mb-4">🔴 Live Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-90">Active Users</p>
              <p className="text-2xl font-bold">{realTimeData.activeUsers || 0}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Current Views</p>
              <p className="text-2xl font-bold">{realTimeData.currentViews || 0}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Sessions Today</p>
              <p className="text-2xl font-bold">{realTimeData.sessionsToday || 0}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Peak Hour</p>
              <p className="text-2xl font-bold">{realTimeData.peakHour || 'N/A'}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric) => (
          <Card key={metric.key} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </p>
              </div>
              <div className={`text-sm font-medium ${
                metric.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth Chart */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">User Growth Trends</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="users">Users</option>
              <option value="sessions">Sessions</option>
              <option value="views">Views</option>
            </select>
          </div>
          <LineChart
            data={chartData.userGrowth}
            xKey="date"
            yKey={selectedMetric}
            height={300}
            color="#8b5cf6"
          />
        </Card>

        {/* Platform Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Distribution</h3>
          <PieChart
            data={chartData.platforms}
            dataKey="users"
            nameKey="name"
            height={300}
          />
          <div className="mt-4 space-y-2">
            {chartData.platforms.map((platform) => (
              <div key={platform.name} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm">{platform.name}</span>
                </div>
                <span className="text-sm font-medium">{platform.users}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Content Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
          <BarChart
            data={chartData.contentPerformance}
            xKey="title"
            yKey="views"
            height={300}
            color="#10b981"
          />
        </Card>

        {/* User Demographics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Demographics (Age)</h3>
          <BarChart
            data={chartData.demographics}
            xKey="age"
            yKey="count"
            height={300}
            color="#f59e0b"
          />
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Content Performance Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Content</th>
                  <th className="text-right py-2">Views</th>
                  <th className="text-right py-2">Likes</th>
                  <th className="text-right py-2">Shares</th>
                  <th className="text-right py-2">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {chartData.contentPerformance.map((content, index) => {
                  const engagement = ((content.likes + content.shares) / content.views * 100).toFixed(1);
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-2">{content.title}</td>
                      <td className="text-right py-2">{content.views.toLocaleString()}</td>
                      <td className="text-right py-2">{content.likes.toLocaleString()}</td>
                      <td className="text-right py-2">{content.shares.toLocaleString()}</td>
                      <td className="text-right py-2">{engagement}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* System Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Load Time</span>
              <span className="font-medium">2.3s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="font-medium text-green-600">0.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">CDN Hit Rate</span>
              <span className="font-medium">95.6%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Storage Used</span>
              <span className="font-medium">1.2 TB / 5 TB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bandwidth (24h)</span>
              <span className="font-medium">45.2 GB</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Export Analytics</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">
            Export as PDF
          </Button>
          <Button variant="secondary">
            Export as CSV
          </Button>
          <Button variant="secondary">
            Generate Report
          </Button>
          <Button variant="secondary">
            Schedule Reports
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;