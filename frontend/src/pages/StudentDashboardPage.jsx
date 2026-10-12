import { useAuth } from '../context/AuthContext';

const StudentDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-md-12">
          <div className="card dashboard-card p-4">
            <h2>Student Dashboard</h2>
            <p className="text-muted mb-0">Welcome, {user?.username || 'Student'}.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4 h-100">
            <h4>Profile</h4>
            <p>Manage your personal information and academic details.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4 h-100">
            <h4>Applications</h4>
            <p>Track job applications and interview status.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4 h-100">
            <h4>Jobs</h4>
            <p>Browse eligible jobs and apply with your profile.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;

