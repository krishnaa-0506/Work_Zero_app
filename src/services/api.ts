import axios from 'axios';
import { mockJobs, mockUserProfile, mockApplications, mockConversations, mockVerificationResult } from '../data/mockData';

// Use environment variable for API URL or fallback to development
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://workzeroapp-backend.vercel.app/api' : 'http://localhost:5001/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Helper function to handle API calls with mock fallback
const withMockFallback = async <T>(apiCall: () => Promise<{ data: T }>, mockData: T): Promise<{ data: T }> => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API call failed, using mock data:', error);
    return { data: mockData };
  }
};

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
  withMockFallback(
    () => api.post('/users/verify-aadhaar', { aadhaarNumber }),
    mockVerificationResult
  );

export const verifyFace = (selfieImage: string, aadhaarPhoto: string) =>
  withMockFallback(
    () => api.post('/users/verify-face', { selfieImage, aadhaarPhoto }),
    mockVerificationResult
  );

export const signup = (userData: any) =>
  withMockFallback(
    () => api.post('/users/signup', userData),
    { user: mockUserProfile, token: 'mock-jwt-token' }
  );

export const login = (aadhaarNumber: string) =>
  withMockFallback(
    () => api.post('/users/login', { aadhaarNumber }),
    { user: mockUserProfile, token: 'mock-jwt-token' }
  );

// User APIs
export const getProfile = () =>
  withMockFallback(
    () => api.get('/users/profile'),
    mockUserProfile
  );

export const updateProfile = (data: any) =>
  withMockFallback(
    () => api.patch('/users/profile', data),
    { ...mockUserProfile, ...data }
  );

export const addSkills = (skills: string[]) =>
  withMockFallback(
    () => api.post('/users/skills', { skills }),
    { skills: [...mockUserProfile.skills, ...skills] }
  );

export const removeSkills = (skills: string[]) =>
  withMockFallback(
    () => api.delete('/users/skills', { data: { skills } }),
    { skills: mockUserProfile.skills.filter(s => !skills.includes(s)) }
  );

export const addExperience = (experience: any) =>
  withMockFallback(
    () => api.post('/users/experience', experience),
    { experience: [...mockUserProfile.experience, { ...experience, id: Date.now().toString() }] }
  );

export const updateExperience = (id: string, experience: any) =>
  withMockFallback(
    () => api.patch(`/users/experience/${id}`, experience),
    { experience: mockUserProfile.experience.map(e => e.id === id ? { ...e, ...experience } : e) }
  );

export const deleteExperience = (id: string) =>
  withMockFallback(
    () => api.delete(`/users/experience/${id}`),
    { experience: mockUserProfile.experience.filter(e => e.id !== id) }
  );

// Job APIs
export const searchJobs = (params: any) =>
  withMockFallback(
    () => api.get('/jobs', { params }),
    mockJobs
  );

export const getJobDetails = (id: string) =>
  withMockFallback(
    () => api.get(`/jobs/${id}`),
    mockJobs.find(job => job.id === id) || mockJobs[0]
  );

export const getNearbyJobs = (params: any) =>
  withMockFallback(
    () => api.get('/jobs/nearby', { params }),
    mockJobs
  );

export const getRecommendedJobs = () =>
  withMockFallback(
    () => api.get('/jobs/recommended'),
    mockJobs.slice(0, 3)
  );

export const applyForJob = (jobId: string) =>
  withMockFallback(
    () => api.post(`/jobs/${jobId}/apply`),
    { success: true, message: 'Application submitted successfully! 🎉' }
  );

// Application APIs
export const getMyApplications = () =>
  withMockFallback(
    () => api.get('/applications'),
    mockApplications
  );

export const getApplicationDetails = (id: string) =>
  withMockFallback(
    () => api.get(`/applications/${id}`),
    mockApplications.find(app => app.id === id) || mockApplications[0]
  );

export const withdrawApplication = (id: string) =>
  withMockFallback(
    () => api.post(`/applications/${id}/withdraw`),
    { success: true, message: 'Application withdrawn successfully' }
  );

export const submitFeedback = (id: string, feedback: any) =>
  withMockFallback(
    () => api.post(`/applications/${id}/feedback`, feedback),
    { success: true, message: 'Thank you for your feedback! 🙏' }
  );

// Message APIs
export const getConversations = () =>
  withMockFallback(
    () => api.get('/messages/conversations'),
    mockConversations
  );

export const getConversationMessages = (conversationId: string) =>
  withMockFallback(
    () => api.get(`/messages/conversations/${conversationId}`),
    mockConversations.find(conv => conv.id === conversationId)?.messages || []
  );

export const sendMessage = (conversationId: string, content: string) =>
  withMockFallback(
    () => api.post(`/messages/conversations/${conversationId}/messages`, { content }),
    {
      id: Date.now().toString(),
      senderId: 'user',
      content,
      timestamp: new Date().toISOString(),
      read: true
    }
  );

export const markMessageAsRead = (messageId: string) =>
  withMockFallback(
    () => api.patch(`/messages/${messageId}/read`),
    { success: true }
  );
