import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const hazardReportService = {
  // Get auth token
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Submit a new hazard report
  async submitReport(reportData) {
    try {
      const formData = new FormData();

      // Add basic report data
      Object.keys(reportData).forEach(key => {
        if (key !== 'mediaFiles') {
          if (typeof reportData[key] === 'object') {
            formData.append(key, JSON.stringify(reportData[key]));
          } else {
            formData.append(key, reportData[key]);
          }
        }
      });

      // Add media files if present
      if (reportData.mediaFiles && reportData.mediaFiles.length > 0) {
        reportData.mediaFiles.forEach((file, index) => {
          formData.append('media', file);
        });
      }

      const response = await axios.post(`${API_BASE_URL}/hazards/report`, formData, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        reportId: response.data.report.id,
        data: response.data.report
      };
    } catch (error) {
      console.error('Error submitting report:', error);
      throw new Error(error.response?.data?.error || 'Failed to submit report');
    }
  },

  // Get all reports with filters
  async getReports(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`${API_BASE_URL}/hazards?${params}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.reports || [];
    } catch (error) {
      console.error('Error getting reports:', error);
      throw new Error(error.response?.data?.error || 'Failed to get reports');
    }
  },

  // Get specific report by ID
  async getReportById(reportId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/hazards/${reportId}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.report;
    } catch (error) {
      console.error('Error getting report:', error);
      throw new Error(error.response?.data?.error || 'Failed to get report');
    }
  },

  // Update report status (for officials/analysts)
  async updateReportStatus(reportId, status, verificationData = {}) {
    try {
      const response = await axios.put(`${API_BASE_URL}/hazards/${reportId}/verify`, {
        verified: status === 'verified',
        newStatus: status,
        verificationNotes: verificationData.notes || '',
        ...verificationData
      }, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating report status:', error);
      throw new Error(error.response?.data?.error || 'Failed to update report status');
    }
  },

  // Get reports by location radius
  async getReportsByLocation(lat, lng, radius = 25, limit = 50) {
    try {
      const response = await axios.get(`${API_BASE_URL}/hazards/nearby/${lat}/${lng}`, {
        params: { radius, limit },
        headers: this.getAuthHeaders()
      });

      return response.data.reports || [];
    } catch (error) {
      console.error('Error getting reports by location:', error);
      throw new Error(error.response?.data?.error || 'Failed to get nearby reports');
    }
  },

  // Real-time reports listener (simplified for API)
  subscribeToReports(callback, filters = {}) {
    // For API-based approach, we'll use polling
    const pollReports = async () => {
      try {
        const reports = await this.getReports(filters);
        callback(reports);
      } catch (error) {
        console.error('Error polling reports:', error);
      }
    };

    // Initial call
    pollReports();

    // Set up polling interval (every 30 seconds)
    const interval = setInterval(pollReports, 30000);

    // Return unsubscribe function
    return () => clearInterval(interval);
  },

  // Get hazard statistics
  async getHazardStats() {
    try {
      const reports = await this.getReports();
      const stats = {
        total: reports.length,
        byStatus: {},
        bySeverity: {},
        byType: {},
        recent: reports.filter(r => {
          const reportDate = new Date(r.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return reportDate > weekAgo;
        }).length
      };

      reports.forEach(report => {
        stats.byStatus[report.status] = (stats.byStatus[report.status] || 0) + 1;
        stats.bySeverity[report.severity] = (stats.bySeverity[report.severity] || 0) + 1;
        stats.byType[report.type] = (stats.byType[report.type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting hazard stats:', error);
      throw error;
    }
  },

  // Calculate distance between two points (utility function)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // Convert degrees to radians (utility function)
  deg2rad(deg) {
    return deg * (Math.PI/180);
  },

  // Get hazard types
  getHazardTypes() {
    return [
      'tsunami',
      'earthquake',
      'flood',
      'storm',
      'oil_spill',
      'fire',
      'landslide',
      'drought',
      'other'
    ];
  },

  // Get severity levels
  getSeverityLevels() {
    return [
      { value: 'low', label: 'Low', color: '#10b981' },
      { value: 'medium', label: 'Medium', color: '#f59e0b' },
      { value: 'high', label: 'High', color: '#ef4444' },
      { value: 'critical', label: 'Critical', color: '#7c2d12' }
    ];
  }
};
