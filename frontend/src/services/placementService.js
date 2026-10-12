import api from './api';

// Placement Officer Profile
export const getPlacementOfficerProfile = () => api.get('/api/placements/profile/');
export const updatePlacementOfficerProfile = (id, payload) => api.put(`/api/placements/profile/${id}/`, payload);

// Students
export const getPlacementStudents = () => api.get('/api/placements/students/');
export const getPlacementStudentDetail = (id) => api.get(`/api/placements/students/${id}/`);
export const getStudentEducation = (id) => api.get(`/api/placements/students/${id}/education/`);
export const getStudentSkills = (id) => api.get(`/api/placements/students/${id}/skills/`);
export const getStudentResume = (id) => api.get(`/api/placements/students/${id}/resume/`);

// Companies
export const getPlacementCompanies = () => api.get('/api/placements/companies/');
export const getPlacementCompanyDetail = (id) => api.get(`/api/placements/companies/${id}/`);

// Jobs
export const getPlacementJobs = () => api.get('/api/placements/jobs/');
export const getPlacementJobDetail = (id) => api.get(`/api/placements/jobs/${id}/`);

// Applications
export const getPlacementApplications = () => api.get('/api/placements/applications/');

// Interviews
export const getPlacementInterviews = () => api.get('/api/placements/interviews/');

// Stats
export const getPlacementStats = () => api.get('/api/placements/stats/summary/');

// Notifications
export const getPlacementNotifications = () => api.get('/api/placements/notifications/');
export const markPlacementNotificationRead = (id) => api.patch(`/api/placements/notifications/${id}/mark-read/`);
export const sendPlacementAnnouncement = (payload) => api.post('/api/placements/notifications/announce/', payload);

