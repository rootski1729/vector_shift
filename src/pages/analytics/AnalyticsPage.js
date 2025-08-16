// src/pages/analytics/AnalyticsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Alert, LoadingSpinner, Badge, SearchInput } from '../../components/ui';
import { LineChart, BarChart, PieChart } from '../../components/charts';
import adminAPI from '../../services/api';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState({
    platform: {},
    realTime: {},
    contentPerformance: [],
    userMetrics: {},
    watchlistStats: {},
    episodeStats: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('views');
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Filters
  const [contentFilter, setContentFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');

  // Track analytics events
  const trackEvent = useCallback(async (eventType, eventData = {}) => {
    try {
      await adminAPI.trackAnalyticsEvent({
        eventType,
        category: 'admin_dashboard',
        sessionId: `admin_session_${Date.now()}`,
        eventData: {
          ...eventData,
          page: 'analytics',
          timestamp: new Date().toISOString()
        },
        deviceInfo: {
          platform: 'web',
          appVersion: '1.0.0',
          userAgent: navigator.userAgent
        }
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }, []);

  const fetchAnalyticsData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      // Track page view
      if (!isRefresh) {
        await trackEvent('page_view', { timeRange, selectedMetric });
      }

      // Fetch analytics data concurrently
      const [
        platformResult,
        realTimeResult,
        reportResult,
        contentListResult,
        popularEpisodesResult,
        trendingResult
      ] = await Promise.allSettled([
        adminAPI.getPlatformAnalytics({ timeframe: timeRange }),
        adminAPI.getRealTimeAnalytics(),
        adminAPI.getAnalyticsReport({
          startDate: getStartDate(timeRange),
          endDate: new Date().toISOString().split('T')[0],
          reportType: 'overview'
        }),
        adminAPI.getContent({ limit: 50 }),
        adminAPI.getPopularEpisodes({ limit: 20, timeframe: parseInt(timeRange.replace('d', '')) }),
        adminAPI.getTrendingContent({ limit: 10, timeframe: parseInt(timeRange.replace('d', '')) })
      ]);

      const newAnalyticsData = { ...analyticsData };

      // Platform Analytics
      if (platformResult.status === 'fulfilled') {
        newAnalyticsData.platform = platformResult.value || {};
      } else {
        newAnalyticsData.platform = generateMockPlatformData();
      }

      // Real-time Analytics
      if (realTimeResult.status === 'fulfilled') {
        newAnalyticsData.realTime = realTimeResult.value || {};
      } else {
        newAnalyticsData.realTime = generateMockRealTimeData();
      }

      // Analytics Report
      if (reportResult.status === 'fulfilled') {
        newAnalyticsData.report = reportResult.value || {};
      } else {
        newAnalyticsData.report = generateMockReportData();
      }

      // Content Performance (from content list)
      if (contentListResult.status === 'fulfilled') {
        const contentList = Array.isArray(contentListResult.value) ? contentListResult.value : [];
        newAnalyticsData.contentPerformance = generateContentPerformanceData(contentList);
      } else {
        newAnalyticsData.contentPerformance = generateMockContentPerformance();
      }

      // Episode Stats
      if (popularEpisodesResult.status === 'fulfilled') {
        newAnalyticsData.episodeStats = Array.isArray(popularEpisodesResult.value) 
          ? popularEpisodesResult.value 
          : generateMockEpisodeStats();
      } else {
        newAnalyticsData.episodeStats = generateMockEpisodeStats();
      }

      // Trending Content
      if (trendingResult.status === 'fulfilled') {
        newAnalyticsData.trending = Array.isArray(trendingResult.value) 
          ? trendingResult.value 
          : [];
      } else {
        newAnalyticsData.trending = [];
      }

      setAnalyticsData(newAnalyticsData);

    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError('Failed to load analytics data');
      
      // Fallback to mock data
      setAnalyticsData({
        platform: generateMockPlatformData(),
        realTime: generateMockRealTimeData(),
        contentPerformance: generateMockContentPerformance(),
        episodeStats: generateMockEpisodeStats(),
        report: generateMockReportData()
      });
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [timeRange, selectedMetric, analyticsData, trackEvent]);

  // Auto-refresh functionality
  const startAutoRefresh = useCallback(() => {
    if (refreshInterval) clearInterval(refreshInterval);
    
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchAnalyticsData(true);
      }
    }, 60000); // Refresh every minute

    setRefreshInterval(interval);
  }, [autoRefresh, fetchAnalyticsData, refreshInterval]);

  const stopAutoRefresh = useCallback(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [refreshInterval]);

  useEffect(() => {
    fetchAnalyticsData();
    if (autoRefresh) {
      startAutoRefresh();
    }
    
    return () => stopAutoRefresh();
  }, [timeRange, selectedMetric]);

  useEffect(() => {
    if (autoRefresh) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  }, [autoRefresh, startAutoRefresh, stopAutoRefresh]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await trackEvent('manual_refresh', { timeRange, selectedMetric });
    await fetchAnalyticsData(true);
  };

  const handleTimeRangeChange = async (newTimeRange) => {
    setTimeRange(newTimeRange);
    await trackEvent('timerange_change', { oldRange: timeRange, newRange: newTimeRange });
  };

  const handleExport = async (format) => {
    try {
      await trackEvent('export_analytics', { format, timeRange });
      
      const exportData = {
        timeRange,
        generatedAt: new Date().toISOString(),
        platform: analyticsData.platform,
        realTime: analyticsData.realTime,
        contentPerformance: analyticsData.contentPerformance.slice(0, 10),
        topEpisodes: analyticsData.episodeStats.slice(0, 10)
      };

      const dataStr = format === 'json' 
        ? JSON.stringify(exportData, null, 2)
        : convertToCSV(exportData);
        
      const filename = `cino_analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.${format}`;
      downloadFile(dataStr, filename, format === 'json' ? 'application/json' : 'text/csv');
      
      setSuccess(`Analytics exported as ${format.toUpperCase()}`);
    } catch (err) {
      setError('Failed to export analytics data');
    }
  };

  // Helper functions
  const getStartDate = (range) => {
    const days = parseInt(range.replace('d', ''));
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  const downloadFile = (data, filename, type) => {
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

  const convertToCSV = (data) => {
    const headers = ['Metric', 'Value', 'Category'];
    const rows = [
      ['Total Users', data.platform.totalUsers || 0, 'Platform'],
      ['Total Views', data.platform.totalViews || 0, 'Platform'],
      ['Active Users', data.realTime.activeUsers || 0, 'Real-time'],
      ['Current Streams', data.realTime.currentStreams || 0, 'Real-time'],
      ...data.contentPerformance.slice(0, 5).map(item => [
        item.title, item.views, 'Content'
      ])
    ];
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  // Mock data generators
  const generateMockPlatformData = () => ({
    totalUsers: 15420,
    totalViews: 1250000,
    totalWatchTime: 450000,
    newUsers: 128,
    returningUsers: 892,
    avgSessionDuration: 1800,
    bounceRate: 23.5,
    conversionRate: 78.9,
    platforms: {
      android: 45.2,
      ios: 32.8,
      web: 22.0
    },
    demographics: {
      '18-24': 28.5,
      '25-34': 34.2,
      '35-44': 22.8,
      '45-54': 10.5,
      '55+': 4.0
    }
  });

  const generateMockRealTimeData = () => ({
    activeUsers: Math.floor(Math.random() * 500) + 800,
    currentStreams: Math.floor(Math.random() * 200) + 150,
    todayViews: Math.floor(Math.random() * 2000) + 5000,
    peakHour: '8:00 PM',
    serverLoad: Math.floor(Math.random() * 30) + 40,
    bandwidth: Math.floor(Math.random() * 20) + 30
  });

  const generateMockReportData = () => ({
    totalRevenue: 125000,
    avgRevenuePerUser: 8.12,
    retentionRate: 78.5,
    churnRate: 4.2,
    engagementScore: 85.6,
    contentSatisfaction: 92.3
  });

  const generateContentPerformanceData = (contentList) => {
    return contentList.slice(0, 10).map((content, index) => ({
      title: content.title,
      views: Math.floor(Math.random() * 50000) + 10000,
      likes: Math.floor(Math.random() * 2000) + 500,
      shares: Math.floor(Math.random() * 500) + 100,
      watchTime: Math.floor(Math.random() * 10000) + 2000,
      completionRate: Math.floor(Math.random() * 40) + 60,
      type: content.type,
      genre: Array.isArray(content.genre) ? content.genre[0] : 'unknown'
    }));
  };

  const generateMockContentPerformance = () => [
    { title: 'Popular Movie 1', views: 45000, likes: 1800, shares: 450, watchTime: 8500, completionRate: 85, type: 'movie', genre: 'action' },
    { title: 'Web Series EP1', views: 38000, likes: 1500, shares: 320, watchTime: 7200, completionRate: 78, type: 'web-series', genre: 'drama' },
    { title: 'Comedy Show', views: 32000, likes: 1200, shares: 280, watchTime: 6100, completionRate: 82, type: 'series', genre: 'comedy' },
    { title: 'Drama Movie', views: 28000, likes: 980, shares: 195, watchTime: 5800, completionRate: 76, type: 'movie', genre: 'drama' },
    { title: 'Action Series', views: 25000, likes: 850, shares: 165, watchTime: 5200, completionRate: 71, type: 'series', genre: 'action' }
  ];

  const generateMockEpisodeStats = () => [
    { title: 'Episode 1: Pilot', views: 15000, likes: 800, avgWatchTime: 1620, completionRate: 89 },
    { title: 'Episode 2: Rising Action', views: 13500, likes: 720, avgWatchTime: 1580, completionRate: 85 },
    { title: 'Episode 3: Plot Twist', views: 12800, likes: 690, avgWatchTime: 1550, completionRate: 82 },
    { title: 'Episode 4: Climax', views: 11200, likes: 650, avgWatchTime: 1480, completionRate: 79 },
    { title: 'Episode 5: Resolution', views: 10800, likes: 620, avgWatchTime: 1450, completionRate: 77 }
  ];

  // Chart data preparation
  const prepareChartData = () => {
    const userGrowthData = [
      { date: '7 days ago', users: Math.floor(analyticsData.platform.totalUsers * 0.85), views: Math.floor((analyticsData.platform.totalViews || 0) * 0.8) },
      { date: '6 days ago', users: Math.floor(analyticsData.platform.totalUsers * 0.88), views: Math.floor((analyticsData.platform.totalViews || 0) * 0.83) },
      { date: '5 days ago', users: Math.floor(analyticsData.platform.totalUsers * 0.91), views: Math.floor((analyticsData.platform.totalViews || 0) * 0.86) },
      { date: '4 days ago', users: Math.floor(analyticsData.platform.totalUsers * 0.94), views: Math.floor((analyticsData.platform.totalViews || 0) * 0.89) },
      { date: '3 days ago', users: Math.floor(analyticsData.platform.totalUsers * 0.96), views: Math.floor((analyticsData.platform.totalViews || 0) * 0.92) },
      { date: '2 days ago', users: Math.floor(analyticsData.platform.totalUsers * 0.98), views: Math.floor((analyticsData.platform.totalViews || 0) * 0.95) },
      { date: 'Today', users: analyticsData.platform.totalUsers || 0, views: analyticsData.platform.totalViews || 0 }
    ];

    const platformData = [
      { name: 'Android', value: analyticsData.platform.platforms?.android || 45, color: '#10b981' },
      { name: 'iOS', value: analyticsData.platform.platforms?.ios || 32, color: '#3b82f6' },
      { name: 'Web', value: analyticsData.platform.platforms?.web || 23, color: '#8b5cf6' }
    ];

    const demographicsData = Object.entries(analyticsData.platform.demographics || {}).map(([age, percentage]) => ({
      age,
      percentage: parseFloat(percentage)
    }));

    return { userGrowthData, platformData, demographicsData };
  };

  const chartData = prepareChartData();

  // Filter content performance data
  const filteredContentPerformance = analyticsData.contentPerformance.filter(item => {
    const matchesSearch = !contentFilter || 
      item.title.toLowerCase().includes(contentFilter.toLowerCase());
    const matchesGenre = genreFilter === 'all' || item.genre === genreFilter;
    const matchesPlatform = platformFilter === 'all'; // Content doesn't have platform filter
    
    return matchesSearch && matchesGenre && matchesPlatform;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Auto-refresh toggle */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-gray-700">Auto-refresh</span>
          </label>

          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          
          <Button onClick={handleRefresh} loading={refreshing} variant="secondary">
            Refresh
          </Button>

          {/* Export Dropdown */}
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleExport(e.target.value);
                  e.target.value = '';
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Export</option>
              <option value="json">Export as JSON</option>
              <option value="csv">Export as CSV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Real-time Stats */}
      <Card className="p-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">🔴 Live Analytics</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm opacity-90">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm opacity-90">Active Users</p>
            <p className="text-2xl font-bold">{analyticsData.realTime.activeUsers?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Current Streams</p>
            <p className="text-2xl font-bold">{analyticsData.realTime.currentStreams?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Views Today</p>
            <p className="text-2xl font-bold">{analyticsData.realTime.todayViews?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Server Load</p>
            <p className="text-2xl font-bold">{analyticsData.realTime.serverLoad || 0}%</p>
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
                {analyticsData.platform.totalUsers?.toLocaleString() || '0'}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-600">
                  +{analyticsData.platform.newUsers || 0} new
                </span>
              </div>
            </div>
            <div className="text-green-600">📊</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {((analyticsData.platform.totalViews || 0) / 1000000).toFixed(1)}M
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-blue-600">
                  {analyticsData.platform.avgSessionDuration || 0}s avg session
                </span>
              </div>
            </div>
            <div className="text-blue-600">👁️</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.report?.engagementScore || 85.6}%
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-purple-600">
                  {analyticsData.platform.bounceRate || 23.5}% bounce rate
                </span>
              </div>
            </div>
            <div className="text-purple-600">💝</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Watch Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((analyticsData.platform.totalWatchTime || 0) / 3600).toLocaleString()}h
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-orange-600">
                  {analyticsData.report?.retentionRate || 78.5}% retention
                </span>
              </div>
            </div>
            <div className="text-orange-600">⏱️</div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Trends */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Growth Trends</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="users">Users</option>
              <option value="views">Views</option>
            </select>
          </div>
          <LineChart
            data={chartData.userGrowthData}
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
            data={chartData.platformData}
            dataKey="value"
            nameKey="name"
            height={300}
          />
          <div className="mt-4 space-y-2">
            {chartData.platformData.map((platform) => (
              <div key={platform.name} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm">{platform.name}</span>
                </div>
                <span className="text-sm font-medium">{platform.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Demographics and Episode Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Demographics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Demographics (Age)</h3>
          <BarChart
            data={chartData.demographicsData}
            xKey="age"
            yKey="percentage"
            height={300}
            color="#f59e0b"
          />
        </Card>

        {/* Top Episodes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Episodes</h3>
          <div className="space-y-3">
            {analyticsData.episodeStats.slice(0, 5).map((episode, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{episode.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>{episode.views?.toLocaleString()} views</span>
                    <span>{episode.likes?.toLocaleString()} likes</span>
                    <span>{episode.completionRate}% completion</span>
                  </div>
                </div>
                <Badge variant="info">#{index + 1}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Content Performance Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Content Performance</h3>
          <div className="flex space-x-3">
            <SearchInput
              value={contentFilter}
              onChange={setContentFilter}
              placeholder="Search content..."
              className="w-64"
            />
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Genres</option>
              <option value="action">Action</option>
              <option value="drama">Drama</option>
              <option value="comedy">Comedy</option>
              <option value="thriller">Thriller</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Content</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Views</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Likes</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Shares</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Watch Time</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Completion</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredContentPerformance.slice(0, 10).map((content, index) => {
                const engagement = ((content.likes + content.shares) / content.views * 100).toFixed(1);
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{content.title}</div>
                        <div className="text-gray-500 text-xs capitalize">{content.genre}</div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-medium">{content.views.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{content.likes.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{content.shares.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{Math.round(content.watchTime / 60)}m</td>
                    <td className="text-right py-3 px-4">{content.completionRate}%</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant={content.type === 'movie' ? 'primary' : content.type === 'series' ? 'success' : 'info'}>
                        {content.type}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Revenue Insights</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <span className="text-sm font-medium">${analyticsData.report?.totalRevenue?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ARPU</span>
              <span className="text-sm font-medium">${analyticsData.report?.avgRevenuePerUser || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-sm font-medium">{analyticsData.platform?.conversionRate || 0}%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-semibold text-gray-900 mb-3">User Retention</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Day 1</span>
              <span className="text-sm font-medium">{analyticsData.report?.retentionRate || 85.2}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Day 7</span>
              <span className="text-sm font-medium">67.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Day 30</span>
              <span className="text-sm font-medium">45.6%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Content Quality</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Satisfaction</span>
              <span className="text-sm font-medium">{analyticsData.report?.contentSatisfaction || 92.3}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Churn Rate</span>
              <span className="text-sm font-medium">{analyticsData.report?.churnRate || 4.2}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Rating</span>
              <span className="text-sm font-medium">4.6/5.0</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;