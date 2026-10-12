import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentEducationPage from './pages/student/StudentEducationPage';
import StudentSkillsPage from './pages/student/StudentSkillsPage';
import StudentResumePage from './pages/student/StudentResumePage';
import StudentJobsPage from './pages/student/StudentJobsPage';
import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
import StudentInterviewsPage from './pages/student/StudentInterviewsPage';
import StudentNotificationsPage from './pages/student/StudentNotificationsPage';
import CompanyDashboardPage from './pages/company/CompanyDashboardPage';
import CompanyJobsPage from './pages/company/CompanyJobsPage';
import CompanyApplicantsPage from './pages/company/CompanyApplicantsPage';
import CompanyInterviewsPage from './pages/company/CompanyInterviewsPage';
import CompanyProfilePage from './pages/company/CompanyProfilePage';
import PlacementOfficerDashboardPage from './pages/placement/PlacementOfficerDashboardPage';
import PlacementStudentsPage from './pages/placement/PlacementStudentsPage';
import PlacementCompaniesPage from './pages/placement/PlacementCompaniesPage';
import PlacementManagementPage from './pages/placement/PlacementManagementPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const App = () => {
  return (
    <MainLayout>
      <Routes>
        <Route
          path="/"
          element={<RoleAwareHome />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/education"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentEducationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/skills"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentSkillsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/resume"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentResumePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/jobs"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/interviews"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentInterviewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentNotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute allowedRoles={['COMPANY']}>
              <CompanyDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/profile"
          element={<ProtectedRoute allowedRoles={['COMPANY']}><CompanyProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/company/jobs"
          element={
            <ProtectedRoute allowedRoles={['COMPANY']}>
              <CompanyJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/applicants"
          element={
            <ProtectedRoute allowedRoles={['COMPANY']}>
              <CompanyApplicantsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/interviews"
          element={
            <ProtectedRoute allowedRoles={['COMPANY']}>
              <CompanyInterviewsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/placement-officer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
              <PlacementOfficerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement-officer/students"
          element={
            <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
              <PlacementStudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement-officer/management"
          element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}><PlacementManagementPage /></ProtectedRoute>}
        />
        <Route
          path="/placement-officer/companies"
          element={
            <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
              <PlacementCompaniesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminStudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminCompaniesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminJobsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
};

export default App;

function RoleAwareHome() {
  const { user } = useAuth();
  // If logged in, redirect to role-specific dashboard
  if (user) {
    if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (user.role === 'COMPANY') return <Navigate to="/company/dashboard" replace />;
    if (user.role === 'PLACEMENT_OFFICER') return <Navigate to="/placement-officer/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  // Public landing for unauthenticated users
  return <HomePage />;
}

