import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const API_BASE = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const { token } = useContext(AuthContext);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const volunteerService = {
  registerVolunteer: async (volunteerData) => {
    const response = await api.post('/volunteers/register', volunteerData);
    return response.data;
  },

  getVolunteers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/volunteers?${params}`);
    return response.data;
  },

  getUserProfile: async (userId) => {
    const response = await api.get(`/volunteers/user/${userId}`);
    return response.data;
  },

  updateProfile: async (userId, updates) => {
    const response = await api.patch(`/volunteers/${userId}`, updates);
    return response.data;
  },

  getTasks: async () => {
    const response = await api.get('/volunteers/tasks');
    return response.data;
  },

  assignTask: async (taskId, volunteerId) => {
    const response = await api.post(`/volunteers/tasks/${taskId}/assign`, { volunteerId });
    return response.data;
  },

  completeTask: async (taskId) => {
    const response = await api.patch(`/volunteers/tasks/${taskId}/complete`);
    return response.data;
  },
};

export default volunteerService;
