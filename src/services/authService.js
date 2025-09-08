import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authService = {
  // Register a new user
  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);

      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return {
        user: response.data.user,
        token: response.data.token,
        success: true
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
        rememberMe: true
      });

      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return {
        user: response.data.user,
        token: response.data.token,
        success: true
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem('authToken');

      if (token) {
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Auth state listener (simplified for API-based auth)
  onAuthStateChange(callback) {
    // For API-based auth, we can check localStorage changes
    // This is a simplified implementation
    const checkAuth = () => {
      const isAuth = this.isAuthenticated();
      callback(isAuth ? this.getCurrentUser() : null);
    };

    // Check immediately
    checkAuth();

    // Set up interval to check periodically
    const interval = setInterval(checkAuth, 1000);

    // Return unsubscribe function
    return () => clearInterval(interval);
  },

  // Get user profile
  async getUserProfile() {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No authentication token');

      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data.user;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error(error.response?.data?.error || 'Failed to get profile');
    }
  },

  // Update user profile
  async updateProfile(userData) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No authentication token');

      const response = await axios.put(`${API_BASE_URL}/auth/profile`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No authentication token');

      const response = await axios.post(`${API_BASE_URL}/auth/change-password`, {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  },

  // Verify token
  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) return { valid: false };

      const response = await axios.get(`${API_BASE_URL}/auth/verify-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data;
    } catch (error) {
      console.error('Error verifying token:', error);
      return { valid: false };
    }
  },

  // Refresh token (if needed)
  async refreshToken() {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No authentication token');

      // This would typically call a refresh endpoint
      // For now, we'll verify the current token
      const result = await this.verifyToken();

      if (!result.valid) {
        // Token is invalid, clear storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        throw new Error('Token expired');
      }

      return result;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
};
