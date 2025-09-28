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

export const hazardService = {
  createReport: async (reportData) => {
    const formData = new FormData();
    formData.append('hazardType', reportData.hazardType);
    formData.append('latitude', reportData.latitude);
    formData.append('longitude', reportData.longitude);
    formData.append('description', reportData.description);
    formData.append('timeObserved', reportData.timeObserved);
    formData.append('status', reportData.status || 'pending');

    if (reportData.images && reportData.images.length > 0) {
      reportData.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await api.post('/hazards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  getReports: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/hazards?${params}`);
    return response.data;
  },

  getUserReports: async (userId, limit = 20) => {
    const response = await api.get(`/hazards/user/${userId}?limit=${limit}`);
    return response.data;
  },

  updateReport: async (reportId, updates) => {
    const response = await api.patch(`/hazards/${reportId}`, updates);
    return response.data;
  },

  deleteReport: async (reportId) => {
    const response = await api.delete(`/hazards/${reportId}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/hazards/stats');
    return response.data;
  },

  getAlerts: async () => {
    const response = await api.get('/hazards/alerts');
    return response.data;
  },
};

export default hazardService;
