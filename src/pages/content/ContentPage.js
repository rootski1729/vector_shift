import React, { useEffect, useState } from 'react';
import adminAPI from '../../services/api';
import Modal from '../../components/ui/Modal';
import { useForm } from 'react-hook-form';

const ContentPage = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteContentId, setDeleteContentId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        const data = await adminAPI.getContent();
        setContentList(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch content');
      }
      setLoading(false);
    }
    fetchContent();
  }, []);

  // View content details
  const handleViewContent = async (contentId) => {
    setDetailsLoading(true);
    try {
      let content;
      if (adminAPI.getContentById) {
        content = await adminAPI.getContentById(contentId);
      } else {
        // fallback: filter from loaded list
        content = contentList.find(c => c._id === contentId);
      }
      setSelectedContent(content);
    } catch (err) {
      setError('Failed to fetch content details');
    }
    setDetailsLoading(false);
  };

  const handleCloseModal = () => setSelectedContent(null);

  // Create content
  const handleCreateContent = async (data) => {
    setActionLoading(true);
    try {
      await adminAPI.createContent(data);
      setShowCreateModal(false);
      // Refresh content list
      const updated = await adminAPI.getContent();
      setContentList(updated);
    } catch (err) {
      setError('Failed to create content');
    }
    setActionLoading(false);
  };

  // Edit content
  const handleEditContent = async (data) => {
    setActionLoading(true);
    try {
      await adminAPI.updateContent(editContent._id, data);
      setShowEditModal(false);
      setEditContent(null);
      // Refresh content list
      const updated = await adminAPI.getContent();
      setContentList(updated);
    } catch (err) {
      setError('Failed to update content');
    }
    setActionLoading(false);
  };

  // Delete content
  const handleDeleteContent = async () => {
    setActionLoading(true);
    try {
      await adminAPI.deleteContent(deleteContentId);
      setShowDeleteModal(false);
      setDeleteContentId(null);
      // Refresh content list
      const updated = await adminAPI.getContent();
      setContentList(updated);
    } catch (err) {
      setError('Failed to delete content');
    }
    setActionLoading(false);
  };

  // Open edit modal
  const openEditModal = (content) => {
    setEditContent(content);
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (contentId) => {
    setDeleteContentId(contentId);
    setShowDeleteModal(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Content Management</h2>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setShowCreateModal(true)}>Create Content</button>
      {loading ? (
        <div>Loading content...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contentList.map(content => (
              <tr key={content._id}>
                <td className="py-2 px-4 border-b">{content._id}</td>
                <td className="py-2 px-4 border-b">{content.title}</td>
                <td className="py-2 px-4 border-b">{content.type}</td>
                <td className="py-2 px-4 border-b">{content.status}</td>
                <td className="py-2 px-4 border-b">
                  <button className="text-blue-600 hover:underline mr-2" onClick={() => handleViewContent(content._id)}>View</button>
                  <button className="text-green-600 hover:underline mr-2" onClick={() => openEditModal(content)}>Edit</button>
                  <button className="text-red-600 hover:underline" onClick={() => openDeleteModal(content._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Content Details Modal */}
      {selectedContent && (
        <Modal open={!!selectedContent} onClose={handleCloseModal} title="Content Details">
          <div className="p-4">
            {detailsLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                <p><strong>ID:</strong> {selectedContent._id}</p>
                <p><strong>Title:</strong> {selectedContent.title}</p>
                <p><strong>Type:</strong> {selectedContent.type}</p>
                <p><strong>Status:</strong> {selectedContent.status}</p>
                {/* Add more fields as needed from backend */}
              </div>
            )}
            <button className="mt-4 px-4 py-2 bg-gray-300 rounded" onClick={handleCloseModal}>Close</button>
          </div>
        </Modal>
      )}

      {/* Create Content Modal */}
      {showCreateModal && (
        <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Content">
          <ContentForm onSubmit={handleCreateContent} loading={actionLoading} />
        </Modal>
      )}

      {/* Edit Content Modal */}
      {showEditModal && editContent && (
        <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Content">
          <ContentForm content={editContent} onSubmit={handleEditContent} loading={actionLoading} />
        </Modal>
      )}

      {/* Delete Content Modal */}
      {showDeleteModal && (
        <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Content">
          <div className="p-4">
            <p>Are you sure you want to delete this content?</p>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleDeleteContent} disabled={actionLoading}>Delete</button>
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ContentForm component
function ContentForm({ content, onSubmit, loading }) {
  const { register, handleSubmit } = useForm({
    defaultValues: content || { title: '', type: '', status: '' },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1">Title</label>
        <input className="w-full border px-2 py-1" {...register('title', { required: true })} />
      </div>
      <div>
        <label className="block mb-1">Type</label>
        <input className="w-full border px-2 py-1" {...register('type', { required: true })} />
      </div>
      <div>
        <label className="block mb-1">Status</label>
        <input className="w-full border px-2 py-1" {...register('status', { required: true })} />
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
    </form>
  );
}

export default ContentPage;
