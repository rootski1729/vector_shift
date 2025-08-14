// src/pages/content/ContentPage.js
import React, { useState, useEffect } from 'react';
import { Button, Modal, Alert, Card } from '../../components/ui';
import DataTable from '../../components/common/DataTable';
import ContentForm from '../../components/forms/ContentForm';
import adminAPI from '../../services/api';

const ContentPage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Selected data
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Form loading
  const [formLoading, setFormLoading] = useState(false);

  const columns = [
    { key: 'title', title: 'Title', sortable: true },
    { key: 'type', title: 'Type', sortable: true },
    { key: 'status', title: 'Status', sortable: true },
    { key: 'genre', title: 'Genre', render: (value) => Array.isArray(value) ? value.join(', ') : value },
    { key: 'language', title: 'Language', render: (value) => Array.isArray(value) ? value.join(', ') : value },
    { key: 'totalEpisodes', title: 'Episodes', sortable: true },
    { key: 'createdAt', title: 'Created', sortable: true },
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getContent();
      setContent(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      setFormLoading(true);
      await adminAPI.createContent(formData);
      setSuccess('Content created successfully');
      setShowCreateModal(false);
      fetchContent();
    } catch (err) {
      setError('Failed to create content');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (formData) => {
    try {
      setFormLoading(true);
      await adminAPI.updateContent(selectedContent._id, formData);
      setSuccess('Content updated successfully');
      setShowEditModal(false);
      setSelectedContent(null);
      fetchContent();
    } catch (err) {
      setError('Failed to update content');
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
      fetchContent();
    } catch (err) {
      setError('Failed to delete content');
    } finally {
      setFormLoading(false);
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      setFormLoading(true);
      await Promise.all(ids.map(id => adminAPI.deleteContent(id)));
      setSuccess(`${ids.length} items deleted successfully`);
      setShowBulkModal(false);
      setSelectedIds([]);
      fetchContent();
    } catch (err) {
      setError('Failed to delete selected items');
    } finally {
      setFormLoading(false);
    }
  };

  const handleBulkAction = async (ids, action = 'publish') => {
    try {
      setFormLoading(true);
      const updates = { status: action === 'publish' ? 'published' : 'archived' };
      await adminAPI.bulkUpdateContent({ contentIds: ids, updates });
      setSuccess(`${ids.length} items ${action}ed successfully`);
      setShowBulkModal(false);
      setSelectedIds([]);
      fetchContent();
    } catch (err) {
      setError(`Failed to ${action} selected items`);
    } finally {
      setFormLoading(false);
    }
  };

  const handlePublish = async (item) => {
    try {
      await adminAPI.publishContent(item._id);
      setSuccess('Content published successfully');
      fetchContent();
    } catch (err) {
      setError('Failed to publish content');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          Create Content
        </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Total Content</div>
          <div className="text-2xl font-bold">{content.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {content.filter(c => c.status === 'published').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Draft</div>
          <div className="text-2xl font-bold text-yellow-600">
            {content.filter(c => c.status === 'draft').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-gray-500">Archived</div>
          <div className="text-2xl font-bold text-gray-600">
            {content.filter(c => c.status === 'archived').length}
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        data={content}
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
      />

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Content"
        size="lg"
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
        size="lg"
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Title</label>
                <p className="mt-1">{selectedContent.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Type</label>
                <p className="mt-1">{selectedContent.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <p className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedContent.status === 'published' ? 'bg-green-100 text-green-800' :
                    selectedContent.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedContent.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Episodes</label>
                <p className="mt-1">{selectedContent.totalEpisodes}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1">{selectedContent.description}</p>
            </div>
            <div className="flex space-x-2">
              {selectedContent.status !== 'published' && (
                <Button
                  variant="success"
                  onClick={() => handlePublish(selectedContent)}
                >
                  Publish
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setShowEditModal(true);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        )}
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
          <div className="flex flex-col space-y-2">
            <Button
              variant="success"
              onClick={() => handleBulkAction(selectedIds, 'publish')}
              loading={formLoading}
            >
              Publish Selected
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleBulkAction(selectedIds, 'archive')}
              loading={formLoading}
            >
              Archive Selected
            </Button>
            <Button
              variant="danger"
              onClick={() => handleBulkDelete(selectedIds)}
              loading={formLoading}
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