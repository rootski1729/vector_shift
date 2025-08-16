// src/pages/dashboard/DashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Alert, LoadingSpinner, Badge, ProgressBar } from '../../components/ui';
import { LineChart, BarChart, PieChart } from '../../components/charts';
import { Link } from 'react-router-dom';
import adminAPI from '../../services/api';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    systemHealth: null,
    recentContent: [],
    recentUsers: [],
    analyticsData: {},
    realTimeData: {}
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Real-time update interval
  const [realTimeInterval, setRealTimeInterval] = useState(null);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      // Fetch all dashboard data concurrently
      const [
        healthResult,
        analyticsResult,
        realTimeResult,
        contentResult,
        usersResult,
        trendingResult,
        popularEpisodesResult
      ] = await Promise.allSettled([
        adminAPI.getSystemHealth(),
        adminAPI.getPlatformAnalytics({ timeframe: '30d' }),
        adminAPI.getRealTimeAnalytics(),
        adminAPI.getContent({ limit: 10, sortBy: '-createdAt' }),
        adminAPI.getUsers({ limit: 10, sortBy: '-createdAt' }),
        adminAPI.getTrendingContent({ limit: 5 }),
        adminAPI.getPopularEpisodes({ limit: 5, timeframe: 7 })
      ]);

      // Process results
      const newDashboardData = {
        stats: {},
        systemHealth: null,
        recentContent: [],
        recentUsers: [],
        analyticsData: {},
        realTimeData: {},
        trendingContent: [],
        popularEpisodes: []
      };

      // System Health
      if (healthResult.status === 'fulfilled') {
        newDashboardData.systemHealth = healthResult.value;
      } else {
        newDashboardData.systemHealth = generateMockHealth();
      }

      // Analytics Data
      if (analyticsResult.status === 'fulfilled') {
        newDashboardData.analyticsData = analyticsResult.value;
      } else {
        newDashboardData.analyticsData = generateMockAnalytics();
      }

      // Real-time Data
      if (realTimeResult.status === 'fulfilled') {
        newDashboardData.realTimeData = realTimeResult.value;
      } else {
        newDashboardData.realTimeData = generateMockRealTime();
      }

      // Recent Content
      if (contentResult.status === 'fulfilled') {
        newDashboardData.recentContent = Array.isArray(contentResult.value) 
          ? contentResult.value.slice(0, 5) 
          : [];
      }

      // Recent Users
      if (usersResult.status === 'fulfilled') {
        newDashboardData.recentUsers = Array.isArray(usersResult.value) 
          ? usersResult.value.slice(0, 5) 
          : generateMockUsers();
      } else {
        newDashboardData.recentUsers = generateMockUsers();
      }

      // Trending Content
      if (trendingResult.status === 'fulfilled') {
        newDashboardData.trendingContent = Array.isArray(trendingResult.value) 
          ? trendingResult.value.slice(0, 5) 
          : [];
      }

      // Popular Episodes
      if (popularEpisodesResult.status === 'fulfilled') {
        newDashboardData.popularEpisodes = Array.isArray(popularEpisodesResult.value) 
          ? popularEpisodesResult.value.slice(0, 5) 
          : [];
      }

      // Calculate stats from analytics data
      newDashboardData.stats = {
        totalUsers: newDashboardData.analyticsData.totalUsers || 0,
        activeUsers: newDashboardData.realTimeData.activeUsers || 0,
        totalContent: newDashboardData.recentContent.length || 0,
        totalViews: newDashboardData.analyticsData.totalViews || 0,
        todayViews: newDashboardData.realTimeData.todayViews || 0,
        newUsersToday: newDashboardData.analyticsData.newUsersToday || 0,
        watchTime: newDashboardData.analyticsData.totalWatchTime || 0,
        engagement: newDashboardData.analyticsData.engagementRate || 0
      };

      setDashboardData(newDashboardData);
      setLastUpdated(new Date());

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
      
      // Fallback to mock data
      setDashboardData({
        stats: generateMockStats(),
        systemHealth: generateMockHealth(),
        recentContent: [],
        recentUsers: generateMockUsers(),
        analyticsData: generateMockAnalytics(),
        realTimeData: generateMockRealTime(),
        trendingContent: [],
        popularEpisodes: []
      });
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  // Start real-time updates
  const startRealTimeUpdates = useCallback(() => {
    if (realTimeInterval) clearInterval(realTimeInterval);
    
    const interval = setInterval(async () => {
      try {
        const realTimeData = await adminAPI.getRealTimeAnalytics();
        setDashboardData(prev => ({
          ...prev,
          realTimeData: realTimeData || generateMockRealTime(),
          stats: {
            ...prev.stats,
            activeUsers: realTimeData?.activeUsers || prev.stats.activeUsers,
            todayViews: realTimeData?.todayViews || prev.stats.todayViews
          }
        }));
      } catch (err) {
        console.error('Real-time update failed:', err);
      }
    }, 30000); // Update every 30 seconds

    setRealTimeInterval(interval);
  }, [realTimeInterval]);

  // Stop real-time updates
  const stopRealTimeUpdates = useCallback(() => {
    if (realTimeInterval) {
      clearInterval(realTimeInterval);
      setRealTimeInterval(null);
    }
  }, [realTimeInterval]);

  useEffect(() => {
    fetchDashboardData();
    startRealTimeUpdates();
    
    return () => stopRealTimeUpdates();
  }, [fetchDashboardData, startRealTimeUpdates, stopRealTimeUpdates]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData(true);
  };

  // Mock data generators
  const generateMockStats = () => ({
    totalUsers: 15420,
    activeUsers: 1250,
    totalContent: 245,
    totalViews: 1250000,
    todayViews: 5420,
    newUsersToday: 128,
    watchTime: 450000,
    engagement: 78.5
  });

  const generateMockHealth = () => ({
    status: 'healthy',
    uptime: '15 days, 4 hours',
    version: '1.2.0',
    cpu: 45.2,
    memory: 67.8,
    disk: 23.4,
    network: 'stable',
    services: {
      database: 'healthy',
      redis: 'healthy',
      storage: 'healthy',
      cdn: 'healthy'
    }
  });

  const generateMockAnalytics = () => ({
    totalUsers: 15420,
    totalViews: 1250000,
    totalWatchTime: 450000,
    engagementRate: 78.5,
    newUsersToday: 128,
    retention: {
      day1: 85.2,
      day7: 67.8,
      day30: 45.6
    }
  });

  const generateMockRealTime = () => ({
    activeUsers: Math.floor(Math.random() * 500) + 800,
    todayViews: Math.floor(Math.random() * 2000) + 5000,
    currentStreams: Math.floor(Math.random() * 200) + 150,
    serverLoad: Math.floor(Math.random() * 30) + 40
  });

  const generateMockUsers = () => [
    { _id: '1', username: 'user123', createdAt: new Date(), status: 'active', platform: 'android' },
    { _id: '2', username: 'movie_lover', createdAt: new Date(), status: 'active', platform: 'ios' },
    { _id: '3', username: 'bingewatcher', createdAt: new Date(), status: 'active', platform: 'web' },
    { _id: '4', username: 'casual_viewer', createdAt: new Date(), status: 'active', platform: 'android' },
    { _id: '5', username: 'series_fan', createdAt: new Date(), status: 'active', platform: 'ios' }
  ];

  // Chart data
  const chartData = {
    userGrowth: [
      { date: 'Mon', users: dashboardData.stats.totalUsers * 0.8, views: dashboardData.stats.totalViews * 0.7 },
      { date: 'Tue', users: dashboardData.stats.totalUsers * 0.85, views: dashboardData.stats.totalViews * 0.75 },
      { date: 'Wed', users: dashboardData.stats.totalUsers * 0.9, views: dashboardData.stats.totalViews * 0.8 },
      { date: 'Thu', users: dashboardData.stats.totalUsers * 0.92, views: dashboardData.stats.totalViews * 0.85 },
      { date: 'Fri', users: dashboardData.stats.totalUsers * 0.95, views: dashboardData.stats.totalViews * 0.9 },
      { date: 'Sat', users: dashboardData.stats.totalUsers * 0.98, views: dashboardData.stats.totalViews * 0.95 },
      { date: 'Sun', users: dashboardData.stats.totalUsers, views: dashboardData.stats.totalViews }
    ],
    platformDistribution: [
      { name: 'Android', value: 45, color: '#10b981' },
      { name: 'iOS', value: 30, color: '#3b82f6' },
      { name: 'Web', value: 25, color: '#8b5cf6' }
    ],
    contentTypes: [
      { name: 'Movies', count: Math.floor((dashboardData.stats.totalContent || 100) * 0.4) },
      { name: 'Series', count: Math.floor((dashboardData.stats.totalContent || 100) * 0.35) },
      { name: 'Web Series', count: Math.floor((dashboardData.stats.totalContent || 100) * 0.25) }
    ]
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleRefresh}
            loading={refreshing}
            variant="secondary"
            size="sm"
          >
            Refresh
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Real-time Stats Banner */}
      <Card className="p-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{dashboardData.realTimeData.activeUsers?.toLocaleString() || '0'}</div>
            <div className="text-sm opacity-90">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{dashboardData.realTimeData.todayViews?.toLocaleString() || '0'}</div>
            <div className="text-sm opacity-90">Views Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{dashboardData.realTimeData.currentStreams?.toLocaleString() || '0'}</div>
            <div className="text-sm opacity-90">Current Streams</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{dashboardData.realTimeData.serverLoad || '0'}%</div>
            <div className="text-sm opacity-90">Server Load</div>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.stats.totalUsers?.toLocaleString() || '0'}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-600">+{dashboardData.stats.newUsersToday || 0} today</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {(dashboardData.stats.totalViews / 1000000).toFixed(1)}M
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-600">+{dashboardData.stats.todayViews?.toLocaleString() || 0} today</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Watch Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((dashboardData.stats.watchTime || 0) / 3600).toLocaleString()}h
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-purple-600">Total hours</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">System Health</p>
              <p className={`text-2xl font-bold ${getHealthColor(dashboardData.systemHealth?.status)}`}>
                {dashboardData.systemHealth?.status?.toUpperCase() || 'UNKNOWN'}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-600">
                  {dashboardData.systemHealth?.uptime || 'N/A'}
                </span>
              </div>
            </div>
            <div className={`w-12 h-12 ${getHealthBg(dashboardData.systemHealth?.status)} rounded-lg flex items-center justify-center`}>
              <svg className={`w-6 h-6 ${getHealthColor(dashboardData.systemHealth?.status)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Overview</h3>
          <LineChart
            data={chartData.userGrowth}
            xKey="date"
            yKey="users"
            height={300}
            color="#8b5cf6"
          />
        </Card>

        {/* Platform Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Distribution</h3>
          <PieChart
            data={chartData.platformDistribution}
            dataKey="value"
            nameKey="name"
            height={300}
          />
        </Card>
      </div>

      {/* System Status & Content Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>CPU Usage</span>
                <span>{dashboardData.systemHealth?.cpu || 45}%</span>
              </div>
              <ProgressBar 
                value={dashboardData.systemHealth?.cpu || 45}
                color={dashboardData.systemHealth?.cpu > 80 ? "red" : dashboardData.systemHealth?.cpu > 60 ? "yellow" : "green"}
                showLabel={false}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Memory Usage</span>
                <span>{dashboardData.systemHealth?.memory || 67}%</span>
              </div>
              <ProgressBar 
                value={dashboardData.systemHealth?.memory || 67}
                color={dashboardData.systemHealth?.memory > 80 ? "red" : dashboardData.systemHealth?.memory > 60 ? "yellow" : "green"}
                showLabel={false}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Disk Usage</span>
                <span>{dashboardData.systemHealth?.disk || 23}%</span>
              </div>
              <ProgressBar 
                value={dashboardData.systemHealth?.disk || 23}
                color="blue"
                showLabel={false}
              />
            </div>
          </div>
        </Card>

        {/* Content Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Content Types</h3>
          <BarChart
            data={chartData.contentTypes}
            xKey="name"
            yKey="count"
            height={200}
            color="#10b981"
          />
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <div className="space-y-3">
            {dashboardData.recentUsers.slice(0, 5).map((user, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-purple-600">
                    {user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.username || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">{user.platform || 'unknown'}</p>
                </div>
                <Badge variant={user.status === 'active' ? 'success' : 'default'}>
                  {user.status || 'active'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/content">
            <Button className="w-full" variant="primary">
              Manage Content
            </Button>
          </Link>
          <Link to="/upload">
            <Button className="w-full" variant="secondary">
              Upload Videos
            </Button>
          </Link>
          <Link to="/analytics">
            <Button className="w-full" variant="secondary">
              View Analytics
            </Button>
          </Link>
          <Link to="/system">
            <Button className="w-full" variant="secondary">
              System Monitor
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;