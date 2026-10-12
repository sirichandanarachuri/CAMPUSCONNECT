import { useAuth } from '../context/AuthContext';

const CompanyDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container py-5">
      <div className="card dashboard-card p-4">
        <h2>Company Dashboard</h2>
        <p className="text-muted mb-0">Welcome, {user?.username || 'Company'}.</p>
      </div>
      <div className="row g-4 mt-1">
        <div className="col-md-4">
          <div className="card dashboard-card p-4 h-100">
            <h4>Company Profile</h4>
            <p>Manage company profile and description.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4 h-100">
            <h4>Jobs</h4>
            <p>Post, edit, and monitor active opportunities.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4 h-100">
            <h4>Applicants</h4>
            <p>Review applications and schedule interviews.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardPage;

