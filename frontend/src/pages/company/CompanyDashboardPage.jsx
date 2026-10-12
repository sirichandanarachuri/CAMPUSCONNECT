import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCompanyJobs, getCompanyApplications, getCompanyInterviews } from '../../services/companyService';
import { useAuth } from '../../context/AuthContext';

const CompanyDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, applications: 0, interviews: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [jobsRes, applicationsRes, interviewsRes] = await Promise.all([
          getCompanyJobs(),
          getCompanyApplications(),
          getCompanyInterviews(),
        ]);

        setStats({
          jobs: jobsRes.data?.filter((job) => job.is_active).length || 0,
          applications: applicationsRes.data?.length || 0,
          interviews: interviewsRes.data?.length || 0,
        });
      } catch (err) {
        setError('Unable to load dashboard statistics.');
        console.error(err);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Company Dashboard</h2>
          <p className="text-muted mb-0">Welcome, {user?.username || 'Company'}</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card dashboard-card p-4 h-100">
            <h5>Active Jobs</h5>
            <h2>{stats.jobs}</h2>
            <Link to="/company/jobs" className="btn btn-sm btn-primary mt-3">Manage Jobs</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4 h-100">
            <h5>Applications Received</h5>
            <h2>{stats.applications}</h2>
            <Link to="/company/applicants" className="btn btn-sm btn-primary mt-3">View Applicants</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4 h-100">
            <h5>Scheduled Interviews</h5>
            <h2>{stats.interviews}</h2>
            <Link to="/company/interviews" className="btn btn-sm btn-primary mt-3">Manage Interviews</Link>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card dashboard-card p-4">
            <h5>Company Profile</h5>
            <p className="text-muted">Update company information and contact details.</p>
            <Link to="/company/profile" className="btn btn-outline-primary btn-sm">Edit Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardPage;

