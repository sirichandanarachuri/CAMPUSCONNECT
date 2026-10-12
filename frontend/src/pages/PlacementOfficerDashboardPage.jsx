import { useAuth } from '../context/AuthContext';

const PlacementOfficerDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container py-5">
      <div className="card dashboard-card p-4">
        <h2>Placement Officer Dashboard</h2>
        <p className="text-muted mb-0">Welcome, {user?.username || 'Placement Officer'}.</p>
      </div>
      <div className="row g-4 mt-1">
        <div className="col-md-4">
          <div className="card dashboard-card p-4 h-100">
            <h4>Students</h4>
            <p>Track all students and their placement preparedness.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4 h-100">
            <h4>Companies</h4>
            <p>Review participating companies and recruitment activity.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4 h-100">
            <h4>Placement Summary</h4>
            <p>Monitor applications, interviews, and hiring metrics.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementOfficerDashboardPage;

