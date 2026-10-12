import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudentProfile, getStudentApplications, getStudentInterviews, getStudentNotifications } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        const [profileResponse, applicationsResponse, interviewsResponse, notificationsResponse] = await Promise.all([
          getStudentProfile(),
          getStudentApplications(),
          getStudentInterviews(),
          getStudentNotifications(),
        ]);

        setProfile(profileResponse.data[0] || null);
        setApplications(applicationsResponse.data || []);
        setInterviews(interviewsResponse.data || []);
        setNotifications(notificationsResponse.data || []);
      } catch (err) {
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const profileCompletion = profile
    ? Math.min(100, Math.round((Object.values(profile).filter(Boolean).length / 12) * 100))
    : 0;

  const shortlistedCount = applications.filter((item) => item.status === 'SHORTLISTED').length;
  const scheduledInterviews = interviews.filter((item) => item.status === 'SCHEDULED').length;

  if (loading) {
    return <div className="container py-5"><div className="alert alert-info">Loading dashboard...</div></div>;
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Student Dashboard</h2>
          <p className="text-muted mb-0">Welcome, {user?.username || 'Student'}</p>
        </div>
        <Link to="/student/profile" className="btn btn-primary">Manage Profile</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card dashboard-card h-100 p-4">
            <h5>Profile Completion</h5>
            <h2>{profileCompletion}%</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card h-100 p-4">
            <h5>Applications</h5>
            <h2>{applications.length}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card h-100 p-4">
            <h5>Shortlisted</h5>
            <h2>{shortlistedCount}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card h-100 p-4">
            <h5>Scheduled Interviews</h5>
            <h2>{scheduledInterviews}</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card dashboard-card p-4 h-100">
            <h4>Recent Notifications</h4>
            {notifications.length === 0 ? (
              <p className="text-muted mb-0">No notifications yet.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {notifications.slice(0, 5).map((item) => (
                  <li key={item.id} className="list-group-item px-0">
                    <strong>{item.title}</strong>
                    <div className="small text-muted">{item.message}</div>
                    <span className={`badge ${item.is_read ? 'bg-secondary' : 'bg-primary'}`}>
                      {item.is_read ? 'Read' : 'Unread'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card dashboard-card p-4 h-100">
            <h4>Quick Actions</h4>
            <div className="d-grid gap-2">
              <Link to="/student/profile" className="btn btn-outline-primary">Profile</Link>
              <Link to="/student/jobs" className="btn btn-outline-primary">Jobs</Link>
              <Link to="/student/applications" className="btn btn-outline-primary">Applications</Link>
              <Link to="/student/interviews" className="btn btn-outline-primary">Interviews</Link>
              <Link to="/student/notifications" className="btn btn-outline-primary">Notifications</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;

