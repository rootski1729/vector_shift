import React, { useEffect, useState } from 'react';
import adminAPI from '../../services/api';
import Modal from '../../components/ui/Modal';
import { useForm } from 'react-hook-form';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
  const data = await adminAPI.getUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users');
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  // View user details
  const handleViewUser = async (userId) => {
    setDetailsLoading(true);
    try {
      const user = await adminAPI.getUserById(userId);
      setSelectedUser(user);
    } catch (err) {
      setError('Failed to fetch user details');
    }
    setDetailsLoading(false);
  };

  const handleCloseModal = () => setSelectedUser(null);

  // Create user
  const handleCreateUser = async (data) => {
    setActionLoading(true);
    try {
      await adminAPI.post('/admin/users', data);
      setShowCreateModal(false);
      // Refresh user list
      const updated = await adminAPI.getUsers();
      setUsers(updated);
    } catch (err) {
      setError('Failed to create user');
    }
    setActionLoading(false);
  };

  // Edit user
  const handleEditUser = async (data) => {
    setActionLoading(true);
    try {
      await adminAPI.put(`/admin/users/${editUser._id}`, data);
      setShowEditModal(false);
      setEditUser(null);
      // Refresh user list
      const updated = await adminAPI.getUsers();
      setUsers(updated);
    } catch (err) {
      setError('Failed to update user');
    }
    setActionLoading(false);
  };

  // Delete user
  const handleDeleteUser = async () => {
    setActionLoading(true);
    try {
      await adminAPI.delete(`/admin/users/${deleteUserId}`);
      setShowDeleteModal(false);
      setDeleteUserId(null);
      // Refresh user list
      const updated = await adminAPI.getUsers();
      setUsers(updated);
    } catch (err) {
      setError('Failed to delete user');
    }
    setActionLoading(false);
  };

  // Open edit modal
  const openEditModal = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setShowCreateModal(true)}>Create User</button>
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">{user._id}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  <button className="text-blue-600 hover:underline mr-2" onClick={() => handleViewUser(user._id)}>View</button>
                  <button className="text-green-600 hover:underline mr-2" onClick={() => openEditModal(user)}>Edit</button>
                  <button className="text-red-600 hover:underline" onClick={() => openDeleteModal(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <Modal open={!!selectedUser} onClose={handleCloseModal} title="User Details">
          <div className="p-4">
            {detailsLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                <p><strong>ID:</strong> {selectedUser._id}</p>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                {/* Add more fields as needed from backend */}
              </div>
            )}
            <button className="mt-4 px-4 py-2 bg-gray-300 rounded" onClick={handleCloseModal}>Close</button>
          </div>
        </Modal>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create User">
          <UserForm onSubmit={handleCreateUser} loading={actionLoading} />
        </Modal>
      )}

      {/* Edit User Modal */}
      {showEditModal && editUser && (
        <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit User">
          <UserForm user={editUser} onSubmit={handleEditUser} loading={actionLoading} />
        </Modal>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete User">
          <div className="p-4">
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleDeleteUser} disabled={actionLoading}>Delete</button>
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );

// UserForm component
function UserForm({ user, onSubmit, loading }) {
  const { register, handleSubmit } = useForm({
    defaultValues: user || { name: '', email: '', role: '' },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1">Name</label>
        <input className="w-full border px-2 py-1" {...register('name', { required: true })} />
      </div>
      <div>
        <label className="block mb-1">Email</label>
        <input className="w-full border px-2 py-1" type="email" {...register('email', { required: true })} />
      </div>
      <div>
        <label className="block mb-1">Role</label>
        <input className="w-full border px-2 py-1" {...register('role', { required: true })} />
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
    </form>
  );
}
};

export default UsersPage;
