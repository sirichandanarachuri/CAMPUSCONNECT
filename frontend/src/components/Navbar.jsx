import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // determine role-aware home path
  const homePath = user
    ? user.role === 'STUDENT'
      ? '/student/dashboard'
      : user.role === 'COMPANY'
      ? '/company/dashboard'
      : user.role === 'PLACEMENT_OFFICER'
      ? '/placement-officer/dashboard'
      : user.role === 'ADMIN'
      ? '/admin/dashboard'
      : '/'
    : '/';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to={homePath}>
          CAMPUSCONNECT
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            {!user ? (
              <>
                <li className="nav-item"><NavLink className="nav-link" to={homePath}>Home</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/register">Register</NavLink></li>
              </>
            ) : (
              <>
                {/* Role-specific navigation items */}
                {user.role === 'STUDENT' && (
                  <>
                    <li className="nav-item"><NavLink className="nav-link" to="/student/dashboard">Home</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/student/jobs">Jobs</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/student/applications">Applications</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/student/interviews">Interviews</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/student/notifications">Notifications</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/student/profile">Profile</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/student/education">Education</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/student/skills">Skills</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/student/resume">Resume</NavLink></li>
                  </>
                )}

                {user.role === 'COMPANY' && (
                  <>
                    <li className="nav-item"><NavLink className="nav-link" to="/company/dashboard">Home</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/company/jobs">Jobs</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/company/applicants">Applicants</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/company/interviews">Interviews</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/company/profile">Profile</NavLink></li>
                  </>
                )}

                {user.role === 'PLACEMENT_OFFICER' && (
                  <>
                    <li className="nav-item"><NavLink className="nav-link" to="/placement-officer/dashboard">Home</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/placement-officer/students">Students</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/placement-officer/companies">Companies</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/placement-officer/management">Management</NavLink></li>
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <>
                    <li className="nav-item"><NavLink className="nav-link" to="/admin/dashboard">Home</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/admin/users">Users</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/admin/students">Students</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/admin/companies">Companies</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/admin/jobs">Jobs</NavLink></li>
                  </>
                )}

                <li className="nav-item"><button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

