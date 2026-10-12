import { useEffect, useState } from 'react';
import { getAdminUsers, toggleUserActive } from '../../services/adminService';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    try {
      const response = await getAdminUsers();
      setUsers(response.data || []);
    } catch (err) {
      setError('Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleActive = async (id) => {
    try {
      await toggleUserActive(id);
      setMessage('User status updated.');
      await loadUsers();
    } catch (err) {
      setError('Unable to update user status.');
    }
  };

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading users...</div></div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Manage Users</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {users.length === 0 ? (
        <div className="alert alert-info">No users found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.username}</strong></td>
                  <td><small>{user.email}</small></td>
                  <td>
                    <span className="badge bg-info">{user.profile?.role || 'N/A'}</span>
                  </td>
                  <td>
                    <span className={`badge bg-${user.is_active ? 'success' : 'danger'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm btn-${user.is_active ? 'danger' : 'success'}`}
                      onClick={() => handleToggleActive(user.id)}
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;

