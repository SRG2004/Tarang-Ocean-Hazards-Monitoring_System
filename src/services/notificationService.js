import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const notificationService = {
  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Get notifications for user
  async getNotifications(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`${API_BASE_URL}/notifications?${params}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.notifications || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw new Error(error.response?.data?.error || 'Failed to get notifications');
    }
  },

  // Get specific notification
  async getNotification(notificationId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/${notificationId}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.notification;
    } catch (error) {
      console.error('Error getting notification:', error);
      throw new Error(error.response?.data?.error || 'Failed to get notification');
    }
  },

  // Send notification (admin/official only)
  async sendNotification(notificationData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/notifications`, notificationData, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        message: response.data.message,
        recipients: response.data.recipients
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error(error.response?.data?.error || 'Failed to send notification');
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, {
        headers: this.getAuthHeaders()
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error(error.response?.data?.error || 'Failed to mark notification as read');
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, {
        headers: this.getAuthHeaders()
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error(error.response?.data?.error || 'Failed to mark notifications as read');
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, {
        headers: this.getAuthHeaders()
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete notification');
    }
  },

  // Get notification statistics
  async getNotificationStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/stats`, {
        headers: this.getAuthHeaders()
      });

      return response.data.stats || {};
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return {};
    }
  },

  // Send real-time notification using toast
  sendRealTimeNotification(notification) {
    const toastConfig = {
      duration: notification.priority === 'critical' ? 10000 : 4000,
      position: 'top-right'
    };

    switch (notification.type) {
      case 'alert':
      case 'critical':
        toast.error(notification.message, toastConfig);
        break;
      case 'warning':
        toast('⚠️ ' + notification.message, toastConfig);
        break;
      case 'success':
        toast.success(notification.message, toastConfig);
        break;
      default:
        toast(notification.message, toastConfig);
    }
  },

  // Subscribe to real-time notifications (simplified for API)
  subscribeToNotifications(callback) {
    // For API-based approach, we'll use polling
    const pollNotifications = async () => {
      try {
        const notifications = await this.getNotifications({ unreadOnly: true });
        callback(notifications);

        // Show toast for new notifications
        notifications.forEach(notification => {
          if (!notification.delivered) {
            this.sendRealTimeNotification(notification);
          }
        });
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    };

    // Initial call
    pollNotifications();

    // Set up polling interval (every 30 seconds)
    const interval = setInterval(pollNotifications, 30000);

    // Return unsubscribe function
    return () => clearInterval(interval);
  },

  // Send hazard alert
  async sendHazardAlert(alertData) {
    try {
      const alert = {
        type: 'alert',
        priority: 'critical',
        title: 'Ocean Hazard Alert',
        message: alertData.message,
        hazardType: alertData.hazardType,
        location: alertData.location,
        severity: alertData.severity,
        actionRequired: alertData.actionRequired || 'Stay alert and follow safety guidelines',
        expiresAt: alertData.expiresAt,
        broadcastToAll: true
      };

      // Send to all active users if it's a broadcast
      if (alert.broadcastToAll) {
        return await this.broadcastAlert(alert);
      } else {
        return await this.sendNotification({
          ...alert,
          userId: alertData.userId
        });
      }
    } catch (error) {
      console.error('Error sending hazard alert:', error);
      throw error;
    }
  },

  // Broadcast alert to all users
  async broadcastAlert(alertData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/notifications/broadcast`, alertData, {
        headers: this.getAuthHeaders(),
      });

      // Show immediate toast
      this.sendRealTimeNotification(alertData);

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error broadcasting alert:', error);
      throw new Error(error.response?.data?.error || 'Failed to broadcast alert');
    }
  },

  async generateAutomatedAlerts() {
    try {
      const response = await axios.post(`${API_BASE_URL}/alerts/generate`, {}, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error generating automated alerts:', error);
      throw new Error(error.response?.data?.error || 'Failed to generate automated alerts');
    }
  },

  // Get alert statistics
  async getAlertStats() {
    try {
      const alerts = await this.getNotifications(null, { type: 'alert', limit: 100 });
      
      const stats = {
        total: alerts.length,
        critical: 0,
        warning: 0,
        info: 0,
        recent: 0
      };

      const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);

      alerts.forEach(alert => {
        // Count by priority
        stats[alert.priority] = (stats[alert.priority] || 0) + 1;
        
        // Count recent alerts
        if (new Date(alert.timestamp).getTime() > twentyFourHoursAgo) {
          stats.recent++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting alert stats:', error);
      return { total: 0, critical: 0, warning: 0, info: 0, recent: 0 };
    }
  }
};