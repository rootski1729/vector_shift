// src/pages/content/ContentPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Alert, Card, SearchInput, Badge, ProgressBar, LoadingSpinner } from '../../components/ui';
import DataTable from '../../components/common/DataTable';
import ContentForm from '../../components/forms/ContentForm';
import adminAPI from '../../services/api';

const ContentPage = () => {
  const [content, setContent] = useState([]);
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showEpisodesModal, setShowEpisodesModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  // Selected data
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [contentEpisodes, setContentEpisodes] = useState([]);
  const [contentAnalytics, setContentAnalytics] = useState({});

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');

  // Form loading
  const [formLoading, setFormLoading] = useState(false);

  // Feed management
  const [feedStats, setFeedStats] = useState({});

  const columns = [
    { 
      key: 'title', 
      title: 'Title', 
      sortable: true,
      render: (title, item) => (
        <div>
          <div className="font-medium text-gray-900">{title}</div>
          <div className="text-sm text-gray-500">
            {Array.isArray(item.genre) ? item.genre.slice(0, 2).join(', ') : item.genre}
          </div>
        </div>
      )
    },
    { 
      key: 'type', 
      title: 'Type', 
      sortable: true,
      render: (type) => (
        <Badge variant={
          type === 'movie' ? 'primary' : 
          type === 'series' ? 'success' : 
          'info'
        }>
          {type}
        </Badge>
      )
    },
    { 
      key: 'category', 
      title: 'Category', 
      sortable: true,
      render: (category) => (
        <span className="capitalize text-sm">{category}</span>
      )
    },
    { 
      key: 'status', 
      title: 'Status', 
      sortable: true,
      render: (status) => (
        <Badge variant={
          status === 'published' ? 'success' : 
          status === 'draft' ? 'warning' : 
          status === 'archived' ? 'default' :
          status === 'processing' ? 'info' :
          'danger'
        }>
          {status || 'draft'}
        </Badge>
      )
    },
    { 
      key: 'language', 
      title: 'Languages', 
      render: (language) => (
        <div className="text-sm">
          {Array.isArray(language) ? language.slice(0, 2).join(', ') : language}
        </div>
      )
    },
    { 
      key: 'totalEpisodes', 
      title: 'Episodes', 
      sortable: true,
      render: (totalEpisodes, item) => (
        <div>
          <span className="font-medium">{totalEpisodes || 1}</span>
          {item.uploadedEpisodes && (
            <div className="text-xs text-gray-500">
              {item.uploadedEpisodes} uploaded
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'releaseYear', 
      title: 'Year', 
      sortable: true,
      render: (year) => year || 'N/A'
    },
    { 
      key: 'feedSettings', 
      title: 'Feed Status', 
      render: (feedSettings) => (
        <div className="space-y-1">
          <Badge variant={feedSettings?.isInRandomFeed ? 'success' : 'default'} size="sm">
            {feedSettings?.isInRandomFeed ? 'In Feed' : 'Not in Feed'}
          </Badge>
          {feedSettings?.feedPriority && (
            <div className="text-xs text-gray-500">
              Priority: {feedSettings.feedPriority}/10
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'createdAt', 
      title: 'Created', 
      sortable: true,
      render: (createdAt) => createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown'
    },
  ];

  useEffect(() => {
    fetchContentData();
  }, [sortBy]);

  const fetchContentData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch content, trending, and featured data
      const [contentResult, trendingResult, featuredResult] = await Promise.allSettled([
        adminAPI.getContent({ 
          limit: 100, 
          sortBy: sortBy,
          status: 'all'
        }),
        adminAPI.getTrendingContent({ limit: 10 }),
        adminAPI.getFeaturedContent({ limit: 5 })
      ]);

      // Process content
      if (contentResult.status === 'fulfilled') {
        const contentData = Array.isArray(contentResult.value) ? contentResult.value : [];
        // Add mock feed settings and upload status for demo
        const enhancedContent = contentData.map(item => ({
          ...item,
          feedSettings: item.feedSettings || {
            isInRandomFeed: Math.random() > 0.3,
            feedPriority: Math.floor(Math.random() * 10) + 1,
            feedWeight: Math.floor(Math.random() * 100) + 1
          },
          uploadedEpisodes: Math.floor(Math.random() * (item.totalEpisodes || 1)) + 1,
          views: Math.floor(Math.random() * 50000) + 1000,
          likes: Math.floor(Math.random() * 2000) + 100,
          rating: Math.floor(Math.random() * 50) + 50 / 10
        }));
        setContent(enhancedContent);
      } else {
        setContent(generateMockContent());
      }

      // Process trending
      if (trendingResult.status === 'fulfilled') {
        setTrending(Array.isArray(trendingResult.value) ? trendingResult.value : []);
      }

      // Process featured
      if (featuredResult.status === 'fulfilled') {
        setFeatured(Array.isArray(featuredResult.value) ? featuredResult.value : []);
      }

      // Calculate feed stats
      calculateFeedStats();

    } catch (err) {
      console.error('Content fetch error:', err);
      setError('Failed to load content data');
      setContent(generateMockContent());
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const generateMockContent = () => [
    {
      _id: '1',
      title: 'Avengers: Endgame Shorts',
      description: 'Short clips from the epic Marvel movie',
      type: 'movie',
      category: 'hollywood',
      status: 'published',
      genre: ['action', 'superhero'],
      language: ['english', 'hindi'],
      totalEpisodes: 10,
      uploadedEpisodes: 8,
      releaseYear: 2019,
      rating: 'U/A',
      ageRating: '13+',
      views: 45000,
      likes: 1800,
      rating: 4.5,
      feedSettings: { isInRandomFeed: true, feedPriority: 8, feedWeight: 75 },
      createdAt: new Date('2024-01-15')
    },
    {
      _id: '2',
      title: 'Comedy Central Specials',
      description: 'Best comedy clips and specials',
      type: 'series',
      category: 'regional',
      status: 'draft',
      genre: ['comedy'],
      language: ['hindi'],
      totalEpisodes: 15,
      uploadedEpisodes: 12,
      releaseYear: 2024,
      rating: 'U',
      ageRating: '13+',
      views: 32000,
      likes: 1200,
      rating: 4.2,
      feedSettings: { isInRandomFeed: false, feedPriority: 5, feedWeight: 50 },
      createdAt: new Date('2024-01-10')
    }
  ];

  const calculateFeedStats = () => {
    const stats = {
      totalContent: content.length,
      inFeed: content.filter(c => c.feedSettings?.isInRandomFeed).length,
      published: content.filter(c => c.status === 'published').length,
      avgPriority: content.reduce((acc, c) => acc + (c.feedSettings?.feedPriority || 0), 0) / content.length,
      totalViews: content.reduce((acc, c) => acc + (c.views || 0), 0),
      totalLikes: content.reduce((acc, c) => acc + (c.likes || 0), 0)
    };
    setFeedStats(stats);
  };

  const fetchContentEpisodes = async (contentId, seasonNumber = 1) => {
    try {
      setFormLoading(true);
      const episodes = await adminAPI.getContentEpisodes(contentId, {
        seasonNumber,
        userId: 'admin_user'
      });
      setContentEpisodes(episodes.episodes || []);
    } catch (err) {
      setError('Failed to fetch episodes');
      // Mock episodes for demo
      setContentEpisodes([
        { _id: '1', title: 'Episode 1: The Beginning', episodeNumber: 1, duration: 1800, views: 5000 },
        { _id: '2', title: 'Episode 2: Rising Action', episodeNumber: 2, duration: 1650, views: 4500 },
        { _id: '3', title: 'Episode 3: Plot Twist', episodeNumber: 3, duration: 1720, views: 4200 }
      ]);
    } finally {
      setFormLoading(false);
    }
  };

  const fetchContentAnalytics = async (contentId) => {
    try {
      setFormLoading(true);
      const analytics = await adminAPI.getContentAnalytics(contentId, { timeframe: 30 });
      setContentAnalytics(analytics);
    } catch (err) {
      setError('Failed to fetch analytics');
      // Mock analytics for demo
      setContentAnalytics({
        totalViews: Math.floor(Math.random() * 100000) + 10000,
        totalLikes: Math.floor(Math.random() * 5000) + 500,
        totalShares: Math.floor(Math.random() * 1000) + 100,
        avgWatchTime: Math.floor(Math.random() * 1800) + 900,
        completionRate: Math.floor(Math.random() * 40) + 60,
        retentionRate: Math.floor(Math.random() * 30) + 70,
        demographics: {
          '18-24': 25,
          '25-34': 35,
          '35-44': 25,
          '45+': 15
        },
        platforms: {
          android: 45,
          ios: 35,
          web: 20
        }
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      setFormLoading(true);
      const result = await adminAPI.createContent(formData);
      
      if (result.success) {
        setSuccess('Content created successfully');
        setShowCreateModal(false);
        fetchContentData();
      }
    } catch (err) {
      setError('Failed to create content: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (formData) => {
    try {
      setFormLoading(true);
      await adminAPI.updateContent(selectedContent._id, formData);
      
      // Update feed settings if provided
      if (formData.feedSettings) {
        await adminAPI.updateFeedSettings(selectedContent._id, formData.feedSettings);
      }
      
      setSuccess('Content updated successfully');
      setShowEditModal(false);
      setSelectedContent(null);
      fetchContentData();
    } catch (err) {
      setError('Failed to update content: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      setFormLoading(true);
      await adminAPI.deleteContent(item._id);
      setSuccess('Content deleted successfully');
      setShowDeleteModal(false);
      setSelectedContent(null);
      fetchContentData();
    } catch (err) {
      setError('Failed to delete content: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handlePublish = async (item) => {
    try {
      setFormLoading(true);
      await adminAPI.publishContent(item._id);
      setSuccess('Content published successfully');
      fetchContentData();
    } catch (err) {
      setError('Failed to publish content: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleBulkAction = async (ids, action) => {
    try {
      setFormLoading(true);
      
      switch (action) {
        case 'publish':
          for (const id of ids) {
            await adminAPI.publishContent(id);
          }
          setSuccess(`${ids.length} items published successfully`);
          break;
        case 'addToFeed':
          for (const id of ids) {
            await adminAPI.updateFeedSettings(id, { 
              isInRandomFeed: true, 
              feedPriority: 5, 
              feedWeight: 50 
            });
          }
          setSuccess(`${ids.length} items added to feed successfully`);
          break;
        case 'removeFromFeed':
          for (const id of ids) {
            await adminAPI.updateFeedSettings(id, { isInRandomFeed: false });
          }
          setSuccess(`${ids.length} items removed from feed successfully`);
          break;
        case 'archive':
          for (const id of ids) {
            await adminAPI.updateContent(id, { status: 'archived' });
          }
          setSuccess(`${ids.length} items archived successfully`);
          break;
        case 'delete':
          for (const id of ids) {
            await adminAPI.deleteContent(id);
          }
          setSuccess(`${ids.length} items deleted successfully`);
          break;
      }
      
      setShowBulkModal(false);
      setSelectedIds([]);
      fetchContentData();
    } catch (err) {
      setError(`Failed to ${action} selected items: ` + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewEpisodes = async (item) => {
    setSelectedContent(item);
    setShowEpisodesModal(true);
    await fetchContentEpisodes(item._id);
  };

  const handleViewAnalytics = async (item) => {
    setSelectedContent(item);
    setShowAnalyticsModal(true);
    await fetchContentAnalytics(item._id);
  };

  // Filter content
  const filteredContent = content.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(item.genre) ? item.genre.join(' ') : item.genre || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || (item.status || 'draft') === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesGenre = genreFilter === 'all' || 
      (Array.isArray(item.genre) ? item.genre.includes(genreFilter) : item.genre === genreFilter);
    
    return matchesSearch && matchesStatus && matchesType && matchesGenre;
  });

  const aggregateStats = {
    total: content.length,
    published: content.filter(c => c.status === 'published').length,
    draft: content.filter(c => c.status === 'draft').length,
    archived: content.filter(c => c.status === 'archived').length,
    processing: content.filter(c => c.status === 'processing').length,
    inFeed: content.filter(c => c.feedSettings?.isInRandomFeed).length,
    movies: content.filter(c => c.type === 'movie').length,
    series: content.filter(c => c.type === 'series').length,
    webSeries: content.filter(c => c.type === 'web-series').length
  };

  // Get unique genres for filter
  const availableGenres = [...new Set(
    content.flatMap(item => Array.isArray(item.genre) ? item.genre : [item.genre])
      .filter(Boolean)
  )];

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={fetchContentData} loading={loading}>
            Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Content
          </Button>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Total Content</div>
          <div className="text-2xl font-bold">{aggregateStats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Published</div>
          <div className="text-2xl font-bold text-green-600">{aggregateStats.published}</div>
          <div className="text-xs text-gray-500 mt-1">
            {aggregateStats.inFeed} in feed
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Draft</div>
          <div className="text-2xl font-bold text-yellow-600">{aggregateStats.draft}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Movies</div>
          <div className="text-2xl font-bold text-blue-600">{aggregateStats.movies}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Series</div>
          <div className="text-2xl font-bold text-purple-600">{aggregateStats.series}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Web Series</div>
          <div className="text-2xl font-bold text-indigo-600">{aggregateStats.webSeries}</div>
        </Card>
      </div>

      {/* Feed Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Feed Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((aggregateStats.inFeed / aggregateStats.total) * 100) || 0}%
            </div>
            <div className="text-sm text-gray-600">Content in Feed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {(feedStats.totalViews || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(feedStats.totalLikes || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(feedStats.avgPriority || 0)}/10
            </div>
            <div className="text-sm text-gray-600">Avg Priority</div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search content..."
            className="w-80"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
            <option value="processing">Processing</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
            <option value="web-series">Web Series</option>
          </select>

          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Genres</option>
            {availableGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="title">Title A-Z</option>
            <option value="-views">Most Viewed</option>
            <option value="-likes">Most Liked</option>
          </select>

          {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || genreFilter !== 'all') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
                setGenreFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Data Table */}
      <DataTable
        data={filteredContent}
        columns={columns}
        loading={loading}
        selectable={true}
        onView={(item) => {
          setSelectedContent(item);
          setShowViewModal(true);
        }}
        onEdit={(item) => {
          setSelectedContent(item);
          setShowEditModal(true);
        }}
        onDelete={(item) => {
          setSelectedContent(item);
          setShowDeleteModal(true);
        }}
        onBulkDelete={(ids) => {
          setSelectedIds(ids);
          setShowBulkModal(true);
        }}
        onBulkAction={(ids) => {
          setSelectedIds(ids);
          setShowBulkModal(true);
        }}
        actions={true}
        customActions={(item) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewEpisodes(item)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Episodes
            </button>
            <button
              onClick={() => handleViewAnalytics(item)}
              className="text-purple-600 hover:text-purple-800 text-sm"
            >
              Analytics
            </button>
            {item.status !== 'published' && (
              <button
                onClick={() => handlePublish(item)}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                Publish
              </button>
            )}
          </div>
        )}
      />

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Content"
        size="xl"
      >
        <ContentForm
          onSubmit={handleCreate}
          loading={formLoading}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Content"
        size="xl"
      >
        {selectedContent && (
          <ContentForm
            initialData={selectedContent}
            onSubmit={handleEdit}
            loading={formLoading}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Content Details"
        size="lg"
      >
        {selectedContent && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Title:</span>
                    <p className="font-medium">{selectedContent.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Type:</span>
                    <Badge variant="primary">{selectedContent.type}</Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <Badge variant={selectedContent.status === 'published' ? 'success' : 'warning'}>
                      {selectedContent.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Episodes:</span>
                    <p className="font-medium">
                      {selectedContent.uploadedEpisodes || 0} / {selectedContent.totalEpisodes || 1}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Views:</span>
                    <p className="font-medium">{(selectedContent.views || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Likes:</span>
                    <p className="font-medium">{(selectedContent.likes || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Rating:</span>
                    <p className="font-medium">{selectedContent.rating || 'N/A'}/5.0</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">In Feed:</span>
                    <Badge variant={selectedContent.feedSettings?.isInRandomFeed ? 'success' : 'default'}>
                      {selectedContent.feedSettings?.isInRandomFeed ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Description</h4>
              <p className="text-gray-700">{selectedContent.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Metadata</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Genres:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(Array.isArray(selectedContent.genre) ? selectedContent.genre : [selectedContent.genre])
                      .filter(Boolean).map((genre, index) => (
                        <Badge key={index} variant="info">{genre}</Badge>
                      ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Languages:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(Array.isArray(selectedContent.language) ? selectedContent.language : [selectedContent.language])
                      .filter(Boolean).map((lang, index) => (
                        <Badge key={index} variant="success">{lang}</Badge>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setShowEditModal(true);
                }}
              >
                Edit Content
              </Button>
              <Button
                variant="info"
                onClick={() => {
                  setShowViewModal(false);
                  handleViewEpisodes(selectedContent);
                }}
              >
                View Episodes
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowViewModal(false);
                  handleViewAnalytics(selectedContent);
                }}
              >
                View Analytics
              </Button>
              {selectedContent.status !== 'published' && (
                <Button
                  variant="success"
                  onClick={() => handlePublish(selectedContent)}
                >
                  Publish
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Episodes Modal */}
      <Modal
        isOpen={showEpisodesModal}
        onClose={() => setShowEpisodesModal(false)}
        title={`Episodes - ${selectedContent?.title}`}
        size="lg"
      >
        <div className="space-y-4">
          {formLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Season 1 Episodes</h4>
                <Button variant="primary" size="sm">
                  Upload Episode
                </Button>
              </div>
              
              <div className="space-y-2">
                {contentEpisodes.map((episode, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h5 className="font-medium">{episode.title}</h5>
                      <div className="text-sm text-gray-500">
                        Episode {episode.episodeNumber} • {Math.floor(episode.duration / 60)}m • {episode.views?.toLocaleString()} views
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="secondary" size="sm">Edit</Button>
                      <Button variant="primary" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {contentEpisodes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No episodes uploaded yet
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* Analytics Modal */}
      <Modal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
        title={`Analytics - ${selectedContent?.title}`}
        size="lg"
      >
        <div className="space-y-6">
          {formLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(contentAnalytics.totalViews || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(contentAnalytics.totalLikes || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Likes</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor((contentAnalytics.avgWatchTime || 0) / 60)}m
                  </div>
                  <div className="text-sm text-gray-600">Avg Watch Time</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {contentAnalytics.completionRate || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>

              {/* Demographics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Audience Demographics</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Age Groups</h5>
                    <div className="space-y-2">
                      {Object.entries(contentAnalytics.demographics || {}).map(([age, percentage]) => (
                        <div key={age} className="flex justify-between items-center">
                          <span className="text-sm">{age}</span>
                          <div className="flex items-center space-x-2">
                            <ProgressBar value={percentage} showLabel={false} className="w-20" />
                            <span className="text-sm font-medium w-8">{percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Platforms</h5>
                    <div className="space-y-2">
                      {Object.entries(contentAnalytics.platforms || {}).map(([platform, percentage]) => (
                        <div key={platform} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{platform}</span>
                          <div className="flex items-center space-x-2">
                            <ProgressBar value={percentage} showLabel={false} className="w-20" />
                            <span className="text-sm font-medium w-8">{percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete "{selectedContent?.title}"? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(selectedContent)}
              loading={formLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Action Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Bulk Actions"
      >
        <div className="space-y-4">
          <p>Select an action for {selectedIds.length} selected items:</p>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="success"
              onClick={() => handleBulkAction(selectedIds, 'publish')}
              loading={formLoading}
              className="w-full"
            >
              Publish Selected
            </Button>
            <Button
              variant="primary"
              onClick={() => handleBulkAction(selectedIds, 'addToFeed')}
              loading={formLoading}
              className="w-full"
            >
              Add to Feed
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleBulkAction(selectedIds, 'removeFromFeed')}
              loading={formLoading}
              className="w-full"
            >
              Remove from Feed
            </Button>
            <Button
              variant="warning"
              onClick={() => handleBulkAction(selectedIds, 'archive')}
              loading={formLoading}
              className="w-full"
            >
              Archive Selected
            </Button>
            <Button
              variant="danger"
              onClick={() => handleBulkAction(selectedIds, 'delete')}
              loading={formLoading}
              className="w-full"
            >
              Delete Selected
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContentPage;