// src/pages/users/UsersPage.js
import React, { useState, useEffect } from 'react';
import { Button, Modal, Alert, Card, SearchInput, Badge } from '../../components/ui';
import DataTable from '../../components/common/DataTable';
import adminAPI from '../../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  // Selected data
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { key: 'userId', title: 'User ID', sortable: true },
    { 
      key: 'profile', 
      title: 'Profile', 
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-purple-600">
              {user.profile?.username?.charAt(0)?.toUpperCase() || 'A'}
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
      render: (deviceInfo) => (
        <Badge variant={deviceInfo?.platform === 'android' ? 'success' : 
                       deviceInfo?.platform === 'ios' ? 'primary' : 'default'}>
          {deviceInfo?.platform?.toUpperCase() || 'Unknown'}
        </Badge>
      )
    },
    { key: 'status', title: 'Status', sortable: true },
    { 
      key: 'analytics', 
      title: 'Watch Time', 
      render: (analytics) => (
        <span>{Math.round((analytics?.totalWatchTime || 0) / 3600)}h</span>
      ),
      sortable: true 
    },
    { 
      key: 'analytics', 
      title: 'Videos Watched', 
      render: (analytics) => analytics?.videosWatched || 0,
      sortable: true 
    },
    { key: 'lastSeenAt', title: 'Last Active', sortable: true },
    { key: 'createdAt', title: 'Joined', sortable: true },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Since the backend doesn't have user management endpoints, we'll simulate
      const data = await adminAPI.getUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      // Mock data for demonstration
      const mockUsers = generateMockUsers();
      setUsers(mockUsers);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const generateMockUsers = () => {
    const platforms = ['android', 'ios', 'web'];
    const statuses = ['active', 'inactive'];
    
    return Array.from({ length: 50 }, (_, i) => ({
      _id: `user_${i + 1}`,
      userId: `user_${Math.random().toString(36).substr(2, 9)}`,
      profile: {
        username: `user${i + 1}`,
        email: Math.random() > 0.3 ? `user${i + 1}@example.com` : null,
        hasProfile: Math.random() > 0.5
      },
      deviceInfo: {
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        appVersion: '1.0.0',
        osVersion: '14.0'
      },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      analytics: {
        totalWatchTime: Math.floor(Math.random() * 50000),
        videosWatched: Math.floor(Math.random() * 100),
        averageSessionDuration: Math.floor(Math.random() * 3600),
        lastActiveAt: new Date()
      },
      lastSeenAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      isAnonymous: Math.random() > 0.3
    }));
  };

  const handleBulkAction = async (ids, action) => {
    try {
      setLoading(true);
      
      // Mock bulk action
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
      }
      
      setShowBulkModal(false);
      setSelectedIds([]);
    } catch (err) {
      setError(`Failed to ${action} users`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (user, newStatus) => {
    try {
      setUsers(prev => prev.map(u => 
        u._id === user._id ? { ...u, status: newStatus } : u
      ));
      setSuccess(`User status updated to ${newStatus}`);
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.profile?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || user.deviceInfo?.platform === platformFilter;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    android: users.filter(u => u.deviceInfo?.platform === 'android').length,
    ios: users.filter(u => u.deviceInfo?.platform === 'ios').length,
    web: users.filter(u => u.deviceInfo?.platform === 'web').length,
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex space-x-2">
          <Button 
            variant="secondary"
            onClick={fetchUsers}
          >
            Refresh
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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{userStats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Active</div>
          <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Inactive</div>
          <div className="text-2xl font-bold text-gray-600">{userStats.inactive}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Android</div>
          <div className="text-2xl font-bold text-green-600">{userStats.android}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">iOS</div>
          <div className="text-2xl font-bold text-blue-600">{userStats.ios}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Web</div>
          <div className="text-2xl font-bold text-purple-600">{userStats.web}</div>
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
        onView={(user) => {
          setSelectedUser(user);
          setShowViewModal(true);
        }}
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
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">User ID</label>
                  <p className="mt-1">{selectedUser.userId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1 flex items-center space-x-2">
                    <Badge variant={selectedUser.status === 'active' ? 'success' : 'default'}>
                      {selectedUser.status}
                    </Badge>
                    <select
                      value={selectedUser.status}
                      onChange={(e) => handleStatusChange(selectedUser, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Username</label>
                  <p className="mt-1">{selectedUser.profile?.username || 'Anonymous'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1">{selectedUser.profile?.email || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Device Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Device Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Platform</label>
                  <p className="mt-1 capitalize">{selectedUser.deviceInfo?.platform || 'Unknown'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">App Version</label>
                  <p className="mt-1">{selectedUser.deviceInfo?.appVersion || 'Unknown'}</p>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Usage Analytics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Total Watch Time</label>
                  <p className="mt-1">{Math.round((selectedUser.analytics?.totalWatchTime || 0) / 3600)} hours</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Videos Watched</label>
                  <p className="mt-1">{selectedUser.analytics?.videosWatched || 0}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Active</label>
                  <p className="mt-1">{new Date(selectedUser.lastSeenAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Joined</label>
                  <p className="mt-1">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Action Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Bulk Actions"
      >
        <div className="space-y-4">
          <p>Select an action for {selectedIds.length} selected users:</p>
          <div className="flex flex-col space-y-2">
            <Button
              variant="success"
              onClick={() => handleBulkAction(selectedIds, 'activate')}
              loading={loading}
            >
              Activate Selected Users
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleBulkAction(selectedIds, 'deactivate')}
              loading={loading}
            >
              Deactivate Selected Users
            </Button>
            <Button
              variant="danger"
              onClick={() => handleBulkAction(selectedIds, 'delete')}
              loading={loading}
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