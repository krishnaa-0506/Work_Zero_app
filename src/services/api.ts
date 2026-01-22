import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const verifyAadhaar = (aadhaarNumber: string) =>
  api.post('/users/verify-aadhaar', { aadhaarNumber });

export const verifyFace = (selfieImage: string, aadhaarPhoto: string) =>
  api.post('/users/verify-face', { selfieImage, aadhaarPhoto });

export const signup = (userData: any) =>
  api.post('/users/signup', userData);

export const login = (aadhaarNumber: string) =>
  api.post('/users/login', { aadhaarNumber });

// User APIs
export const getProfile = () =>
  api.get('/users/profile');

export const updateProfile = (data: any) =>
  api.patch('/users/profile', data);

export const addSkills = (skills: string[]) =>
  api.post('/users/skills', { skills });

export const removeSkills = (skills: string[]) =>
  api.delete('/users/skills', { data: { skills } });

export const addExperience = (experience: any) =>
  api.post('/users/experience', experience);

export const updateExperience = (id: string, experience: any) =>
  api.patch(`/users/experience/${id}`, experience);

export const deleteExperience = (id: string) =>
  api.delete(`/users/experience/${id}`);

// Job APIs
export const searchJobs = (params: any) =>
  api.get('/jobs', { params });

export const getJobDetails = (id: string) =>
  api.get(`/jobs/${id}`);

export const getNearbyJobs = (params: any) =>
  api.get('/jobs/nearby', { params });

export const getRecommendedJobs = () =>
  api.get('/jobs/recommended');

export const applyForJob = (jobId: string) =>
  api.post(`/jobs/${jobId}/apply`);

// Application APIs
export const getMyApplications = () =>
  api.get('/applications');

export const getApplicationDetails = (id: string) =>
  api.get(`/applications/${id}`);

export const withdrawApplication = (id: string) =>
  api.post(`/applications/${id}/withdraw`);

export const submitFeedback = (id: string, feedback: any) =>
  api.post(`/applications/${id}/feedback`, feedback);

// Message APIs
export const getConversations = () =>
  api.get('/messages/conversations');

export const getConversationMessages = (conversationId: string) =>
  api.get(`/messages/conversations/${conversationId}`);

export const sendMessage = (conversationId: string, content: string) =>
  api.post(`/messages/conversations/${conversationId}/messages`, { content });

export const markMessageAsRead = (messageId: string) =>
  api.patch(`/messages/${messageId}/read`);
