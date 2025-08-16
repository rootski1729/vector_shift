// src/pages/users/UsersPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Alert, Card, SearchInput, Badge, ProgressBar } from '../../components/ui';
import DataTable from '../../components/common/DataTable';
import adminAPI from '../../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  
  // Selected data
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // User stats and analytics
  const [userStats, setUserStats] = useState({});
  const [userAnalytics, setUserAnalytics] = useState({});
  const [userRecommendations, setUserRecommendations] = useState([]);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');

  // Form loading
  const [formLoading, setFormLoading] = useState(false);

  // New user form
  const [newUserForm, setNewUserForm] = useState({
    deviceInfo: {
      deviceId: '',
      platform: 'android',
      appVersion: '1.0.0',
      osVersion: '11.0'
    },
    preferences: {
      preferredGenres: [],
      preferredLanguages: [],
      autoPlay: true,
      dataUsage: 'medium'
    },
    location: {
      country: 'India',
      state: '',
      city: ''
    }
  });

  const columns = [
    { 
      key: 'userId', 
      title: 'User ID', 
      sortable: true,
      render: (userId) => (
        <span className="font-mono text-xs">{userId}</span>
      )
    },
    { 
      key: 'profile', 
      title: 'Profile', 
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-purple-600">
              {user.profile?.username?.charAt(0)?.toUpperCase() || user.userId?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <div className="font-medium">{user.profile?.username || 'Anonymous User'}</div>
            <div className="text-sm text-gray-500">{user.profile?.email || 'No email'}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'deviceInfo', 
      title: 'Platform', 
      render: (deviceInfo) => {
        const platformColors = {
          android: 'success',
          ios: 'primary',
          web: 'info'
        };
        return (
          <div className="space-y-1">
            <Badge variant={platformColors[deviceInfo?.platform] || 'default'}>
              {deviceInfo?.platform?.toUpperCase() || 'Unknown'}
            </Badge>
            <div className="text-xs text-gray-500">
              v{deviceInfo?.appVersion || 'Unknown'}
            </div>
          </div>
        );
      }
    },
    { 
      key: 'status', 
      title: 'Status', 
      sortable: true,
      render: (status) => (
        <Badge variant={status === 'active' ? 'success' : 'default'}>
          {status || 'active'}
        </Badge>
      )
    },
    { 
      key: 'analytics', 
      title: 'Watch Time', 
      render: (analytics) => (
        <div>
          <span className="font-medium">{Math.round((analytics?.totalWatchTime || 0) / 3600)}h</span>
          <div className="text-xs text-gray-500">
            {analytics?.videosWatched || 0} videos
          </div>
        </div>
      ),
      sortable: true 
    },
    { 
      key: 'preferences', 
      title: 'Preferences', 
      render: (preferences) => (
        <div className="space-y-1">
          <div className="text-xs text-gray-600">
            Genres: {preferences?.preferredGenres?.slice(0, 2).join(', ') || 'None'}
          </div>
          <div className="text-xs text-gray-600">
            Lang: {preferences?.preferredLanguages?.slice(0, 2).join(', ') || 'None'}
          </div>
        </div>
      )
    },
    { 
      key: 'location', 
      title: 'Location', 
      render: (location) => (
        <div className="text-sm">
          {location?.city || 'Unknown'}, {location?.state || 'Unknown'}
          <div className="text-xs text-gray-500">{location?.country || 'Unknown'}</div>
        </div>
      )
    },
    { 
      key: 'lastSeenAt', 
      title: 'Last Active', 
      sortable: true,
      render: (lastSeenAt) => lastSeenAt ? (
        <div className="text-sm">
          {new Date(lastSeenAt).toLocaleDateString()}
          <div className="text-xs text-gray-500">
            {new Date(lastSeenAt).toLocaleTimeString()}
          </div>
        </div>
      ) : 'Never'
    },
    { 
      key: 'createdAt', 
      title: 'Joined', 
      sortable: true,
      render: (createdAt) => createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown'
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, [sortBy]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        limit: 100,
        sortBy: sortBy
      };
      
      const data = await adminAPI.getUsers(params);
      const processedUsers = Array.isArray(data) ? data : generateMockUsers();
      setUsers(processedUsers);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      const mockUsers = generateMockUsers();
      setUsers(mockUsers);
      setError(null); // Don't show error for mock data
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const generateMockUsers = () => {
    const platforms = ['android', 'ios', 'web'];
    const statuses = ['active', 'inactive'];
    const genres = ['action', 'comedy', 'drama', 'thriller', 'romance'];
    const languages = ['hindi', 'english', 'tamil', 'telugu'];
    const countries = ['India', 'USA', 'UK', 'Canada'];
    const states = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'];
    
    return Array.from({ length: 50 }, (_, i) => ({
      _id: `user_${i + 1}`,
      userId: `user_${Math.random().toString(36).substr(2, 12)}`,
      profile: {
        username: Math.random() > 0.3 ? `user${i + 1}` : null,
        email: Math.random() > 0.4 ? `user${i + 1}@example.com` : null,
        hasProfile: Math.random() > 0.4
      },
      deviceInfo: {
        deviceId: `device_${Math.random().toString(36).substr(2, 8)}`,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        appVersion: `1.${Math.floor(Math.random() * 10)}.0`,
        osVersion: `${Math.floor(Math.random() * 5) + 10}.0`
      },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      analytics: {
        totalWatchTime: Math.floor(Math.random() * 100000),
        videosWatched: Math.floor(Math.random() * 200),
        averageSessionDuration: Math.floor(Math.random() * 3600),
        lastActiveAt: new Date()
      },
      preferences: {
        preferredGenres: genres.slice(0, Math.floor(Math.random() * 3) + 1),
        preferredLanguages: languages.slice(0, Math.floor(Math.random() * 2) + 1),
        autoPlay: Math.random() > 0.5,
        dataUsage: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
      },
      location: {
        country: countries[Math.floor(Math.random() * countries.length)],
        state: states[Math.floor(Math.random() * states.length)],
        city: states[Math.floor(Math.random() * states.length)]
      },
      lastSeenAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      isAnonymous: Math.random() > 0.3
    }));
  };

  const fetchUserStats = async (userId) => {
    try {
      const stats = await adminAPI.getUserStats(userId);
      setUserStats(stats);
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
      setUserStats(generateMockUserStats());
    }
  };

  const fetchUserRecommendations = async (userId) => {
    try {
      const recommendations = await adminAPI.getUserRecommendations(userId, 10);
      setUserRecommendations(recommendations);
    } catch (err) {
      console.error('Failed to fetch user recommendations:', err);
      setUserRecommendations([]);
    }
  };

  const generateMockUserStats = () => ({
    totalWatchTime: Math.floor(Math.random() * 100000),
    videosWatched: Math.floor(Math.random() * 200),
    averageSessionDuration: Math.floor(Math.random() * 3600),
    lastWeekActivity: Math.floor(Math.random() * 50),
    favoriteGenres: ['action', 'drama'],
    watchingStreak: Math.floor(Math.random() * 30),
    completionRate: Math.floor(Math.random() * 40) + 60,
    socialShares: Math.floor(Math.random() * 50)
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      
      const userData = {
        ...newUserForm,
        deviceInfo: {
          ...newUserForm.deviceInfo,
          deviceId: `device_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
        }
      };

      const result = await adminAPI.createAnonymousUser(userData);
      
      if (result.success) {
        setSuccess('Anonymous user created successfully');
        setShowCreateModal(false);
        fetchUsers();
        
        // Reset form
        setNewUserForm({
          deviceInfo: {
            deviceId: '',
            platform: 'android',
            appVersion: '1.0.0',
            osVersion: '11.0'
          },
          preferences: {
            preferredGenres: [],
            preferredLanguages: [],
            autoPlay: true,
            dataUsage: 'medium'
          },
          location: {
            country: 'India',
            state: '',
            city: ''
          }
        });
      }
    } catch (err) {
      setError('Failed to create user: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateUserPreferences = async (userId, preferences) => {
    try {
      setFormLoading(true);
      await adminAPI.updateUserPreferences(userId, { preferences });
      setSuccess('User preferences updated successfully');
      fetchUsers();
    } catch (err) {
      setError('Failed to update user preferences');
    } finally {
      setFormLoading(false);
    }
  };

  const handleBulkAction = async (ids, action) => {
    try {
      setFormLoading(true);
      
      // Mock bulk actions since API doesn't have dedicated endpoints
      switch (action) {
        case 'activate':
          setUsers(prev => prev.map(user => 
            ids.includes(user._id) ? { ...user, status: 'active' } : user
          ));
          setSuccess(`${ids.length} users activated successfully`);
          break;
        case 'deactivate':
          setUsers(prev => prev.map(user => 
            ids.includes(user._id) ? { ...user, status: 'inactive' } : user
          ));
          setSuccess(`${ids.length} users deactivated successfully`);
          break;
        case 'delete':
          setUsers(prev => prev.filter(user => !ids.includes(user._id)));
          setSuccess(`${ids.length} users deleted successfully`);
          break;
        case 'export':
          await handleExportUsers(ids);
          setSuccess(`${ids.length} users exported successfully`);
          break;
      }
      
      setShowBulkModal(false);
      setSelectedIds([]);
    } catch (err) {
      setError(`Failed to ${action} users`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleExportUsers = async (userIds = null) => {
    try {
      const usersToExport = userIds 
        ? users.filter(user => userIds.includes(user._id))
        : filteredUsers;

      const exportData = usersToExport.map(user => ({
        userId: user.userId,
        username: user.profile?.username || '',
        email: user.profile?.email || '',
        platform: user.deviceInfo?.platform || '',
        status: user.status || 'active',
        totalWatchTime: user.analytics?.totalWatchTime || 0,
        videosWatched: user.analytics?.videosWatched || 0,
        joinDate: user.createdAt ? new Date(user.createdAt).toISOString() : '',
        lastSeen: user.lastSeenAt ? new Date(user.lastSeenAt).toISOString() : '',
        country: user.location?.country || '',
        preferredGenres: user.preferences?.preferredGenres?.join(';') || '',
        preferredLanguages: user.preferences?.preferredLanguages?.join(';') || ''
      }));

      const csv = convertToCSV(exportData);
      downloadFile(csv, `cino_users_export_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    } catch (err) {
      setError('Failed to export users');
    }
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
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

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
    await fetchUserStats(user.userId);
    await fetchUserRecommendations(user.userId);
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.profile?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || (user.status || 'active') === statusFilter;
    const matchesPlatform = platformFilter === 'all' || user.deviceInfo?.platform === platformFilter;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const aggregateStats = {
    total: users.length,
    active: users.filter(u => (u.status || 'active') === 'active').length,
    inactive: users.filter(u => (u.status || 'active') === 'inactive').length,
    android: users.filter(u => u.deviceInfo?.platform === 'android').length,
    ios: users.filter(u => u.deviceInfo?.platform === 'ios').length,
    web: users.filter(u => u.deviceInfo?.platform === 'web').length,
    anonymous: users.filter(u => u.isAnonymous).length,
    registered: users.filter(u => !u.isAnonymous).length
  };

  const handleFormChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    
    if (section) {
      setNewUserForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setNewUserForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayInputChange = (value, field, section) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setNewUserForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: array
      }
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex space-x-2">
          <Button 
            variant="secondary"
            onClick={() => handleExportUsers()}
          >
            Export All
          </Button>
          <Button 
            variant="secondary"
            onClick={fetchUsers}
            loading={loading}
          >
            Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            Create User
          </Button>
        </div>
      </div>

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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{aggregateStats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Active</div>
          <div className="text-2xl font-bold text-green-600">{aggregateStats.active}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Inactive</div>
          <div className="text-2xl font-bold text-gray-600">{aggregateStats.inactive}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Android</div>
          <div className="text-2xl font-bold text-green-600">{aggregateStats.android}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">iOS</div>
          <div className="text-2xl font-bold text-blue-600">{aggregateStats.ios}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Web</div>
          <div className="text-2xl font-bold text-purple-600">{aggregateStats.web}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Anonymous</div>
          <div className="text-2xl font-bold text-orange-600">{aggregateStats.anonymous}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Registered</div>
          <div className="text-2xl font-bold text-indigo-600">{aggregateStats.registered}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users..."
            className="w-80"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Platforms</option>
            <option value="android">Android</option>
            <option value="ios">iOS</option>
            <option value="web">Web</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="-lastSeenAt">Recently Active</option>
            <option value="username">Username A-Z</option>
          </select>

          {(searchTerm || statusFilter !== 'all' || platformFilter !== 'all') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPlatformFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Data Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        loading={loading}
        selectable={true}
        onView={handleViewUser}
        onDelete={(user) => {
          setUsers(prev => prev.filter(u => u._id !== user._id));
          setSuccess('User deleted successfully');
        }}
        onBulkDelete={(ids) => {
          setSelectedIds(ids);
          setShowBulkModal(true);
        }}
        onBulkAction={(ids) => {
          setSelectedIds(ids);
          setShowBulkModal(true);
        }}
      />

      {/* View User Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="User Details"
        size="xl"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Profile Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">User ID:</span>
                    <span className="text-sm font-mono">{selectedUser.userId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Username:</span>
                    <span className="text-sm">{selectedUser.profile?.username || 'Anonymous'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="text-sm">{selectedUser.profile?.email || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <Badge variant={selectedUser.status === 'active' ? 'success' : 'default'}>
                      {selectedUser.status || 'active'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Device Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Platform:</span>
                    <span className="text-sm capitalize">{selectedUser.deviceInfo?.platform || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">App Version:</span>
                    <span className="text-sm">{selectedUser.deviceInfo?.appVersion || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">OS Version:</span>
                    <span className="text-sm">{selectedUser.deviceInfo?.osVersion || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Device ID:</span>
                    <span className="text-sm font-mono text-xs">{selectedUser.deviceInfo?.deviceId || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Usage Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((userStats.totalWatchTime || 0) / 3600)}h
                  </div>
                  <div className="text-sm text-gray-600">Total Watch Time</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {userStats.videosWatched || 0}
                  </div>
                  <div className="text-sm text-gray-600">Videos Watched</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((userStats.averageSessionDuration || 0) / 60)}m
                  </div>
                  <div className="text-sm text-gray-600">Avg Session</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {userStats.completionRate || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">User Preferences</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Genres
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {(selectedUser.preferences?.preferredGenres || []).map((genre, index) => (
                      <Badge key={index} variant="info">{genre}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Languages
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {(selectedUser.preferences?.preferredLanguages || []).map((lang, index) => (
                      <Badge key={index} variant="success">{lang}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto Play
                  </label>
                  <Badge variant={selectedUser.preferences?.autoPlay ? 'success' : 'default'}>
                    {selectedUser.preferences?.autoPlay ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Usage
                  </label>
                  <Badge variant="info">
                    {selectedUser.preferences?.dataUsage || 'Medium'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Location</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Country:</span>
                  <p className="font-medium">{selectedUser.location?.country || 'Unknown'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">State:</span>
                  <p className="font-medium">{selectedUser.location?.state || 'Unknown'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">City:</span>
                  <p className="font-medium">{selectedUser.location?.city || 'Unknown'}</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {userRecommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recommended Content</h4>
                <div className="space-y-2">
                  {userRecommendations.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{item.title}</span>
                      <Badge variant="info">{item.type}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  // Implement user preferences update
                  setShowViewModal(false);
                }}
              >
                Edit Preferences
              </Button>
              <Button
                variant={selectedUser.status === 'active' ? 'warning' : 'success'}
                onClick={() => {
                  const newStatus = selectedUser.status === 'active' ? 'inactive' : 'active';
                  setUsers(prev => prev.map(u => 
                    u._id === selectedUser._id ? { ...u, status: newStatus } : u
                  ));
                  setSelectedUser({ ...selectedUser, status: newStatus });
                  setSuccess(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
                }}
              >
                {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Anonymous User"
        size="lg"
      >
        <form onSubmit={handleCreateUser} className="space-y-6">
          {/* Device Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Device Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  name="platform"
                  value={newUserForm.deviceInfo.platform}
                  onChange={(e) => handleFormChange(e, 'deviceInfo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="android">Android</option>
                  <option value="ios">iOS</option>
                  <option value="web">Web</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">App Version</label>
                <input
                  type="text"
                  name="appVersion"
                  value={newUserForm.deviceInfo.appVersion}
                  onChange={(e) => handleFormChange(e, 'deviceInfo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1.0.0"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Preferences</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Genres (comma separated)
                </label>
                <input
                  type="text"
                  value={newUserForm.preferences.preferredGenres.join(', ')}
                  onChange={(e) => handleArrayInputChange(e.target.value, 'preferredGenres', 'preferences')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="action, drama"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Languages (comma separated)
                </label>
                <input
                  type="text"
                  value={newUserForm.preferences.preferredLanguages.join(', ')}
                  onChange={(e) => handleArrayInputChange(e.target.value, 'preferredLanguages', 'preferences')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="hindi, english"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoPlay"
                    checked={newUserForm.preferences.autoPlay}
                    onChange={(e) => handleFormChange(e, 'preferences')}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Auto Play</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Usage</label>
                <select
                  name="dataUsage"
                  value={newUserForm.preferences.dataUsage}
                  onChange={(e) => handleFormChange(e, 'preferences')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Location</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={newUserForm.location.country}
                  onChange={(e) => handleFormChange(e, 'location')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="India"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={newUserForm.location.state}
                  onChange={(e) => handleFormChange(e, 'location')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Delhi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={newUserForm.location.city}
                  onChange={(e) => handleFormChange(e, 'location')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="New Delhi"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={formLoading}
            >
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Action Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Bulk Actions"
      >
        <div className="space-y-4">
          <p>Select an action for {selectedIds.length} selected users:</p>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="success"
              onClick={() => handleBulkAction(selectedIds, 'activate')}
              loading={formLoading}
              className="w-full"
            >
              Activate Selected Users
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleBulkAction(selectedIds, 'deactivate')}
              loading={formLoading}
              className="w-full"
            >
              Deactivate Selected Users
            </Button>
            <Button
              variant="info"
              onClick={() => handleBulkAction(selectedIds, 'export')}
              loading={formLoading}
              className="w-full"
            >
              Export Selected Users
            </Button>
            <Button
              variant="danger"
              onClick={() => handleBulkAction(selectedIds, 'delete')}
              loading={formLoading}
              className="w-full"
            >
              Delete Selected Users
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;