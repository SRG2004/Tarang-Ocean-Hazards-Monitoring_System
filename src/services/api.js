
import axios from 'axios';
import toast from 'react-hot-toast';

// Determine the base URL for the API.
// In a Vercel environment, VITE_API_URL will be set.
// For local development, we'll use the local server proxy.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred.';
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data.message || error.response.data.error || 'Server error.';
      if (error.response.status === 401) {
        // Handle unauthorized errors, e.g., by logging out the user
        toast.error('Session expired. Please log in again.');
        // Optionally redirect to login page
        // window.location.href = '/login';
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'Network error. Could not connect to the server.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }

    // Show a toast notification with the error
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default api;
