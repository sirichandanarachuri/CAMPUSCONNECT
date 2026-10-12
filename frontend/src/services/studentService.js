import api from './api';

export const getStudentProfile = () => api.get('/api/students/profile/');
export const createStudentProfile = (payload) => api.post('/api/students/profile/', payload);
export const updateStudentProfile = (id, payload) => api.put(`/api/students/profile/${id}/`, payload);

export const getStudentEducation = () => api.get('/api/students/education/');
export const createStudentEducation = (payload) => api.post('/api/students/education/', payload);
export const updateStudentEducation = (id, payload) => api.put(`/api/students/education/${id}/`, payload);
export const deleteStudentEducation = (id) => api.delete(`/api/students/education/${id}/`);

export const getStudentSkills = () => api.get('/api/students/skills/');
export const createStudentSkill = (payload) => api.post('/api/students/skills/', payload);
export const updateStudentSkill = (id, payload) => api.put(`/api/students/skills/${id}/`, payload);
export const deleteStudentSkill = (id) => api.delete(`/api/students/skills/${id}/`);

export const getStudentResume = () => api.get('/api/students/resume/');
export const uploadStudentResume = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/students/resume/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const updateStudentResume = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.put(`/api/students/resume/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getEligibleJobs = () => api.get('/api/students/dashboard/eligible-jobs/');
export const getStudentApplications = () => api.get('/api/students/dashboard/applications/');
export const createStudentApplication = (payload) => api.post('/api/students/applications/', payload);

export const getStudentInterviews = () => api.get('/api/students/dashboard/interviews/');
export const getStudentNotifications = () => api.get('/api/students/dashboard/notifications/');
export const markNotificationRead = (id) => api.patch(`/api/students/notifications/${id}/mark-read/`);
export const markAllNotificationsRead = () => api.patch('/api/students/notifications/mark-all-read/');
export const getUnreadNotificationCount = () => api.get('/api/students/notifications/unread-count/');

