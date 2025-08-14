// src/pages/dashboard/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, LoadingSpinner } from '../../components/ui';
import { LineChart, BarChart, PieChart } from '../../components/charts';
import { Link } from 'react-router-dom';
import adminAPI from '../../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({});
  const [systemHealth, setSystemHealth] = useState(null);
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch multiple data sources in parallel
      const [
        platformStats,
        healthData,
        contentData
      ] = await Promise.allSettled([
        adminAPI.getPlatformAnalytics(),
        adminAPI.getSystemHealth(),
        adminAPI.getContent({ limit: 5, sort: '-createdAt' })
      ]);

      // Handle platform stats
      if (platformStats.status === 'fulfilled') {
        setStats(platformStats.value || {});
      }

      // Handle system health
      if (healthData.status === 'fulfilled') {
        setSystemHealth(healthData.value || {});
      }

      // Handle recent content
      if (contentData.status === 'fulfilled') {
        setRecentContent(Array.isArray(contentData.value) ? contentData.value.slice(0, 5) : []);
      }

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthBg = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100';
      case 'degraded': return 'bg-yellow-100';
      case 'unhealthy': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  // Mock chart data (you can replace with real data from your analytics)
  const chartData = {
    usage: [
      { name: 'Jan', users: 400, views: 2400 },
      { name: 'Feb', users: 300, views: 1398 },
      { name: 'Mar', users: 500, views: 9800 },
      { name: 'Apr', users: 278, views: 3908 },
      { name: 'May', users: 189, views: 4800 },
      { name: 'Jun', users: 239, views: 3800 },
    ],
    contentTypes: [
      { name: 'Movies', value: stats.totalMovies || 120 },
      { name: 'Series', value: stats.totalSeries || 80 },
      { name: 'Web Series', value: stats.totalWebSeries || 45 },
    ],
    platforms: [
      { name: 'Android', users: stats.androidUsers || 350 },
      { name: 'iOS', users: stats.iosUsers || 200 },
      { name: 'Web', users: stats.webUsers || 150 },
    ]
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button
          onClick={handleRefresh}
          loading={refreshing}
          variant="secondary"
        >
          Refresh Data
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.activeUsers || 0} active today
              </p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Total Content</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalContent?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.publishedContent || 0} published
              </p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6v11h6V6H9z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalViews?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.todayViews || 0} today
              </p>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">System Health</p>
              <p className={`text-2xl font-bold ${getHealthColor(systemHealth?.status)}`}>
                {systemHealth?.status?.toUpperCase() || 'UNKNOWN'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Uptime: {systemHealth?.uptime || 'N/A'}
              </p>
            </div>
            <div className="ml-4">
              <div className={`w-12 h-12 ${getHealthBg(systemHealth?.status)} rounded-lg flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${getHealthColor(systemHealth?.status)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth & Views</h3>
          <LineChart
            data={chartData.usage}
            xKey="name"
            yKey="users"
            height={300}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Content Distribution</h3>
          <PieChart
            data={chartData.contentTypes}
            dataKey="value"
            nameKey="name"
            height={300}
          />
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Content */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Content</h3>
            <Link to="/content">
              <Button variant="secondary" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentContent.length > 0 ? (
              recentContent.map((content) => (
                <div key={content._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{content.title}</p>
                    <p className="text-sm text-gray-500">
                      {content.type} • {content.status}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No recent content found
              </div>
            )}
          </div>
        </Card>

        {/* Platform Usage */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Usage</h3>
          <BarChart
            data={chartData.platforms}
            xKey="name"
            yKey="users"
            height={250}
          />
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/content">
            <Button variant="primary">Manage Content</Button>
          </Link>
          <Link to="/upload">
            <Button variant="secondary">Upload Videos</Button>
          </Link>
          <Link to="/analytics">
            <Button variant="secondary">View Analytics</Button>
          </Link>
          <Link to="/system">
            <Button variant="secondary">System Monitor</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;