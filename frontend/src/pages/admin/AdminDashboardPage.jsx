import { useEffect, useState } from 'react';
import { getAdminStats } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, students: 0, companies: 0, jobs: 0, applications: 0, interviews: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getAdminStats();
        setStats(response.data || {});
      } catch (err) {
        setError('Unable to load statistics.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading dashboard...</div></div>;
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2>Admin Dashboard</h2>
        <p className="text-muted mb-0">Welcome, {user?.username || 'Admin'}</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card dashboard-card p-4 h-100">
            <h5>Total Users</h5>
            <h2>{stats.total_users || 0}</h2>
            <p className="small text-muted">All registered users</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card p-4 h-100">
            <h5>Students</h5>
            <h2>{stats.total_students || 0}</h2>
            <p className="small text-muted">Student accounts</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card p-4 h-100">
            <h5>Companies</h5>
            <h2>{stats.total_companies || 0}</h2>
            <p className="small text-muted">Company accounts</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card p-4 h-100">
            <h5>Jobs</h5>
            <h2>{stats.total_jobs || 0}</h2>
            <p className="small text-muted">Active jobs</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card dashboard-card p-4">
            <h5>Users</h5>
            <p className="text-muted">Manage all users and permissions.</p>
            <a href="/admin/users" className="btn btn-outline-primary btn-sm">Manage Users</a>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card p-4">
            <h5>Students</h5>
            <p className="text-muted">View and manage student accounts.</p>
            <a href="/admin/students" className="btn btn-outline-primary btn-sm">View Students</a>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card p-4">
            <h5>Companies</h5>
            <p className="text-muted">Review companies and their activity.</p>
            <a href="/admin/companies" className="btn btn-outline-primary btn-sm">View Companies</a>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card p-4">
            <h5>Jobs</h5>
            <p className="text-muted">Monitor all job postings.</p>
            <a href="/admin/jobs" className="btn btn-outline-primary btn-sm">View Jobs</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

