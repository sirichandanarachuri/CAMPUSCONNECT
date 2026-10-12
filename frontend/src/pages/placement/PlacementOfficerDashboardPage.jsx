import { useEffect, useState } from 'react';
import { getPlacementStats, getPlacementStudents, getPlacementCompanies, getPlacementApplications } from '../../services/placementService';
import { useAuth } from '../../context/AuthContext';

const PlacementOfficerDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, companies: 0, applications: 0, interviews: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [statsRes, studentsRes, companiesRes, applicationsRes] = await Promise.all([
          getPlacementStats().catch(() => ({ data: {} })),
          getPlacementStudents(),
          getPlacementCompanies(),
          getPlacementApplications(),
        ]);

        setStats({
          students: studentsRes.data?.length || 0,
          companies: companiesRes.data?.length || 0,
          applications: applicationsRes.data?.length || 0,
          interviews: statsRes.data?.total_interviews || 0,
        });
      } catch (err) {
        setError('Unable to load dashboard statistics.');
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
        <h2>Placement Officer Dashboard</h2>
        <p className="text-muted mb-0">Welcome, {user?.username || 'Placement Officer'}</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card dashboard-card p-4 h-100">
            <h5>Students</h5>
            <h2>{stats.students}</h2>
            <p className="small text-muted">Registered students</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card p-4 h-100">
            <h5>Companies</h5>
            <h2>{stats.companies}</h2>
            <p className="small text-muted">Participating companies</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card p-4 h-100">
            <h5>Applications</h5>
            <h2>{stats.applications}</h2>
            <p className="small text-muted">Total applications</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card p-4 h-100">
            <h5>Interviews</h5>
            <h2>{stats.interviews}</h2>
            <p className="small text-muted">Scheduled interviews</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card dashboard-card p-4">
            <h5>Students</h5>
            <p className="text-muted">View and manage student records and progress.</p>
            <a href="/placement-officer/students" className="btn btn-outline-primary btn-sm">View Students</a>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4">
            <h5>Companies</h5>
            <p className="text-muted">Monitor company registrations and hiring activity.</p>
            <a href="/placement-officer/companies" className="btn btn-outline-primary btn-sm">View Companies</a>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4">
            <h5>Placement Stats</h5>
            <p className="text-muted">View placement statistics and reports.</p>
            <a href="/placement-officer/management" className="btn btn-outline-primary btn-sm">Open Management</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementOfficerDashboardPage;

