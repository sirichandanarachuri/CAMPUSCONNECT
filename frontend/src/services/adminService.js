import api from './api';

// Users
export const getAdminUsers = () => api.get('/api/admin/users/');
export const toggleUserActive = (id) => api.patch(`/api/admin/users/${id}/toggle-active/`);

// Students
export const getAdminStudents = () => api.get('/api/admin/students/');

// Companies
export const getAdminCompanies = () => api.get('/api/admin/companies/');

// Placement Officers
export const getAdminPlacementOfficers = () => api.get('/api/admin/placement-officers/');

// Jobs
export const getAdminJobs = () => api.get('/api/admin/jobs/');

// Applications
export const getAdminApplications = () => api.get('/api/admin/applications/');

// Interviews
export const getAdminInterviews = () => api.get('/api/admin/interviews/');

// Dashboard Stats
export const getAdminStats = () => api.get('/api/admin/dashboard/stats/');

