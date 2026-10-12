import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container py-5">
      <div className="card dashboard-card p-4">
        <h2>Admin Dashboard</h2>
        <p className="text-muted mb-0">Welcome, {user?.username || 'Admin'}.</p>
      </div>
      <div className="row g-4 mt-1">
        <div className="col-md-3">
          <div className="card dashboard-card p-4 h-100">
            <h4>Users</h4>
            <p>Review all registered users.</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card p-4 h-100">
            <h4>Students</h4>
            <p>Monitor student accounts and profiles.</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card p-4 h-100">
            <h4>Companies</h4>
            <p>Manage company listings and activity.</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card p-4 h-100">
            <h4>Platform Stats</h4>
            <p>Review platform-wide summaries.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

