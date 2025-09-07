import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  query,
  orderBy,
  where,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

export const notificationService = {
  // Send notification
  async sendNotification(notificationData) {
    try {
      const notification = {
        ...notificationData,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        read: false,
        delivered: false,
        type: notificationData.type || 'info',
        priority: notificationData.priority || 'medium'
      };

      const docRef = await addDoc(collection(db, 'notifications'), notification);
      
      // Send real-time notification if user is online
      if (notification.userId) {
        this.sendRealTimeNotification(notification);
      }

      return { success: true, notificationId: docRef.id, data: notification };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
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

  // Get notifications for user
  async getNotifications(userId, filters = {}) {
    try {
      let q = collection(db, 'notifications');
      
      if (userId) {
        q = query(q, where('userId', '==', userId));
      }
      
      if (filters.read !== undefined) {
        q = query(q, where('read', '==', filters.read));
      }
      
      if (filters.type) {
        q = query(q, where('type', '==', filters.type));
      }

      q = query(q, orderBy('timestamp', 'desc'));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const notifications = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });

      return notifications;
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Subscribe to real-time notifications
  subscribeToNotifications(userId, callback) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const notifications = [];
      querySnapshot.forEach((doc) => {
        const notification = { id: doc.id, ...doc.data() };
        notifications.push(notification);
        
        // Show toast for new notifications
        if (!notification.delivered) {
          this.sendRealTimeNotification(notification);
          // Mark as delivered
          updateDoc(doc.ref, { delivered: true });
        }
      });
      callback(notifications);
    });
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
      // In a real implementation, this would send to all users
      // For now, we'll create a general alert
      const alert = {
        ...alertData,
        userId: 'broadcast',
        timestamp: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'notifications'), alert);
      
      // Show immediate toast
      this.sendRealTimeNotification(alert);

      return { success: true, alertId: docRef.id };
    } catch (error) {
      console.error('Error broadcasting alert:', error);
      throw error;
    }
  },

  // Generate automated alerts based on reports
  async generateAutomatedAlerts() {
    try {
      // This would analyze recent reports and generate alerts
      const alerts = [
        {
          hazardType: 'cyclone',
          location: 'Bay of Bengal',
          severity: 'high',
          message: 'Cyclone warning issued for Bay of Bengal. Fishermen advised to return to shore immediately.',
          actionRequired: 'Avoid coastal areas and follow evacuation instructions'
        },
        {
          hazardType: 'high_waves',
          location: 'Chennai Coast',
          severity: 'medium',
          message: 'High waves reported at Chennai Marina Beach. Coast Guard advisory in effect.',
          actionRequired: 'Stay away from beaches and rocky shores'
        }
      ];

      const results = [];
      for (const alert of alerts) {
        const result = await this.sendHazardAlert(alert);
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('Error generating automated alerts:', error);
      throw error;
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