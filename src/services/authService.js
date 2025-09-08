import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Demo accounts for testing
const DEMO_ACCOUNTS = {
  'admin@oceanhazard.com': {
    id: 'demo_admin',
    email: 'admin@oceanhazard.com',
    fullName: 'Admin User',
    role: 'admin',
    phone: '+91 9876543210',
    location: { state: 'Tamil Nadu', district: 'Chennai', coastalArea: 'Marina Beach' },
    permissions: ['all']
  },
  'analyst@oceanhazard.com': {
    id: 'demo_analyst', 
    email: 'analyst@oceanhazard.com',
    fullName: 'Data Analyst',
    role: 'analyst',
    phone: '+91 9876543211',
    location: { state: 'Kerala', district: 'Kochi', coastalArea: 'Fort Kochi' },
    permissions: ['analytics', 'reports', 'social_media']
  },
  'official@oceanhazard.com': {
    id: 'demo_official',
    email: 'official@oceanhazard.com', 
    fullName: 'Emergency Official',
    role: 'official',
    phone: '+91 9876543212',
    location: { state: 'Gujarat', district: 'Surat', coastalArea: 'Dumas Beach' },
    permissions: ['official', 'donations', 'reports', 'alerts']
  },
  'citizen@oceanhazard.com': {
    id: 'demo_citizen',
    email: 'citizen@oceanhazard.com',
    fullName: 'Citizen User',
    role: 'citizen', 
    phone: '+91 9876543214',
    location: { state: 'Maharashtra', district: 'Mumbai', coastalArea: 'Juhu Beach' },
    permissions: ['reports', 'alerts']
  }
};

const DEMO_PASSWORD = 'demo123';

export const authService = {
  // Register a new user
  async register(userData) {
    try {
      // For demo purposes, create a local user account
      const user = {
        id: userData.userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        phone: userData.phone,
        location: userData.location,
        preferences: userData.preferences,
        registrationDate: userData.registrationDate,
        status: userData.status || 'active',
        permissions: this.getRolePermissions(userData.role)
      };

      const token = `user_token_${user.id}_${Date.now()}`;
      
      // Store user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        user,
        token,
        success: true
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  // Get role permissions
  getRolePermissions(role) {
    const permissions = {
      admin: ['all', 'analytics', 'official', 'social_media', 'donations', 'reports', 'alerts'],
      analyst: ['analytics', 'social_media', 'reports', 'alerts'],
      official: ['official', 'donations', 'reports', 'alerts'],
      citizen: ['reports', 'alerts']
    };
    return permissions[role] || ['reports', 'alerts'];
  },

  // Login user
  async login(email, password) {
    try {
      // Check for demo accounts first
      if (DEMO_ACCOUNTS[email] && password === DEMO_PASSWORD) {
        const user = DEMO_ACCOUNTS[email];
        const token = `demo_token_${user.id}_${Date.now()}`;
        
        // Store demo user data
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          user,
          token,
          success: true
        };
      }

      // For non-demo accounts, use API
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
      throw new Error(error.response?.data?.error || 'Invalid email or password');
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

  // Get user data by ID (alias for getUserProfile for compatibility)
  async getUserData(userId) {
    try {
      // For compatibility with AppContext, return current user data
      return this.getCurrentUser() || await this.getUserProfile();
    } catch (error) {
      console.error('Error getting user data:', error);
      return this.getCurrentUser(); // Fallback to cached data
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
