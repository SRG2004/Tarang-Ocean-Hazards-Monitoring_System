import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const volunteerService = {
  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Register volunteer
  async registerVolunteer(volunteerData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/volunteers/register`, volunteerData, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        volunteerId: response.data.volunteer.id,
        data: response.data.volunteer
      };
    } catch (error) {
      console.error('Error registering volunteer:', error);
      throw new Error(error.response?.data?.error || 'Failed to register volunteer');
    }
  },

  // Get volunteers
  async getVolunteers(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`${API_BASE_URL}/volunteers?${params}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.volunteers || [];
    } catch (error) {
      console.error('Error getting volunteers:', error);
      throw new Error(error.response?.data?.error || 'Failed to get volunteers');
    }
  },

  // Get specific volunteer
  async getVolunteer(volunteerId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/volunteers/${volunteerId}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.volunteer;
    } catch (error) {
      console.error('Error getting volunteer:', error);
      throw new Error(error.response?.data?.error || 'Failed to get volunteer');
    }
  },

  // Create task
  async createTask(taskData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/volunteers/tasks`, taskData, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        taskId: response.data.task.id,
        data: response.data.task
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error(error.response?.data?.error || 'Failed to create task');
    }
  },

  // Get tasks
  async getTasks(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`${API_BASE_URL}/volunteers/tasks?${params}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.tasks || [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw new Error(error.response?.data?.error || 'Failed to get tasks');
    }
  },

  // Get specific task
  async getTask(taskId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/volunteers/tasks/${taskId}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.task;
    } catch (error) {
      console.error('Error getting task:', error);
      throw new Error(error.response?.data?.error || 'Failed to get task');
    }
  },

  // Assign task to volunteer
  async assignTask(taskId, volunteerId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/volunteers/tasks/${taskId}/assign`, {
        volunteerId
      }, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error assigning task:', error);
      throw new Error(error.response?.data?.error || 'Failed to assign task');
    }
  },

  // Complete task
  async completeTask(taskId, completionData = {}) {
    try {
      const response = await axios.post(`${API_BASE_URL}/volunteers/tasks/${taskId}/complete`, completionData, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error completing task:', error);
      throw new Error(error.response?.data?.error || 'Failed to complete task');
    }
  },

  // Update volunteer profile
  async updateVolunteer(volunteerId, updateData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/volunteers/${volunteerId}`, updateData, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        message: response.data.message,
        data: response.data.volunteer
      };
    } catch (error) {
      console.error('Error updating volunteer:', error);
      throw new Error(error.response?.data?.error || 'Failed to update volunteer');
    }
  },

  // Get volunteer statistics
  async getVolunteerStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/volunteers/stats`, {
        headers: this.getAuthHeaders()
      });

      return response.data.stats || {
        totalVolunteers: 0,
        activeVolunteers: 0,
        pendingVerification: 0,
        totalTasks: 0,
        openTasks: 0,
        assignedTasks: 0,
        completedTasks: 0,
        availabilityBreakdown: { weekends: 0, weekdays: 0, fullTime: 0, emergency: 0 }
      };
    } catch (error) {
      console.error('Error getting volunteer stats:', error);
      return {
        totalVolunteers: 0,
        activeVolunteers: 0,
        pendingVerification: 0,
        totalTasks: 0,
        openTasks: 0,
        assignedTasks: 0,
        completedTasks: 0,
        availabilityBreakdown: { weekends: 0, weekdays: 0, fullTime: 0, emergency: 0 }
      };
    }
  },

  // Find suitable volunteers for a task
  async findSuitableVolunteers(taskData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/volunteers/find-suitable`, taskData, {
        headers: this.getAuthHeaders()
      });

      return response.data.volunteers || [];
    } catch (error) {
      console.error('Error finding suitable volunteers:', error);
      throw new Error(error.response?.data?.error || 'Failed to find suitable volunteers');
    }
  },

  // Get volunteer availability options
  getAvailabilityOptions() {
    return [
      { value: 'weekends', label: 'Weekends Only' },
      { value: 'weekdays', label: 'Weekdays Only' },
      { value: 'fullTime', label: 'Full Time' },
      { value: 'emergency', label: 'Emergency Only' },
      { value: 'flexible', label: 'Flexible' }
    ];
  },

  // Get volunteer skills options
  getSkillsOptions() {
    return [
      'First Aid',
      'Search & Rescue',
      'Communication',
      'Logistics',
      'Medical Support',
      'Technical Support',
      'Translation',
      'Driving',
      'Boating',
      'Cooking',
      'Counseling',
      'Photography',
      'Writing',
      'Data Entry'
    ];
  },

  // Get task priority options
  getTaskPriorityOptions() {
    return [
      { value: 'low', label: 'Low Priority' },
      { value: 'medium', label: 'Medium Priority' },
      { value: 'high', label: 'High Priority' },
      { value: 'critical', label: 'Critical Priority' }
    ];
  },

  // Get task status options
  getTaskStatusOptions() {
    return [
      { value: 'open', label: 'Open' },
      { value: 'assigned', label: 'Assigned' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ];
  }
};