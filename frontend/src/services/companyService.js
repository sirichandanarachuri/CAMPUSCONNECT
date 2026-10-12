import api from './api';

// Company Profile
export const getCompanyProfile = () => api.get('/api/companies/profile/');
export const createCompanyProfile = (payload) => api.post('/api/companies/profile/', payload);
export const updateCompanyProfile = (id, payload) => api.put(`/api/companies/profile/${id}/`, payload);

// Company Jobs
export const getCompanyJobs = () => api.get('/api/companies/jobs/');
export const createCompanyJob = (payload) => api.post('/api/companies/jobs/', payload);
export const updateCompanyJob = (id, payload) => api.put(`/api/companies/jobs/${id}/`, payload);
export const deleteCompanyJob = (id) => api.delete(`/api/companies/jobs/${id}/`);
export const getCompanyJobDetail = (id) => api.get(`/api/companies/jobs/${id}/`);

// Company Applications
export const getCompanyApplications = () => api.get('/api/companies/applications/');
export const shortlistApplication = (id) => api.patch(`/api/companies/applications/${id}/shortlist/`);
export const rejectApplication = (id) => api.patch(`/api/companies/applications/${id}/reject/`);
export const selectApplication = (id) => api.patch(`/api/companies/applications/${id}/select/`);

// Company Interviews
export const getCompanyInterviews = () => api.get('/api/companies/interviews/');
export const createCompanyInterview = (payload) => api.post('/api/companies/interviews/', payload);
export const updateCompanyInterview = (id, payload) => api.put(`/api/companies/interviews/${id}/`, payload);
export const deleteCompanyInterview = (id) => api.delete(`/api/companies/interviews/${id}/`);

// Company Notifications
export const getCompanyNotifications = () => api.get('/api/companies/notifications/');
export const markCompanyNotificationRead = (id) => api.patch(`/api/companies/notifications/${id}/mark-read/`);

