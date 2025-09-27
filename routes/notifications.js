/**
 * Notifications Routes
 * Handles user notifications, alerts, and real-time messaging
 */

import express from 'express';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { firestore } from '../config/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { getActiveBulletins } from '../services/flashBulletinService.js';

const router = express.Router();

/**
 * GET /api/notifications
 * Get user's notifications with pagination
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { page = 1, limit: limitParam = 20, unreadOnly = false, type } = req.query;
    const pageSize = parseInt(limitParam);
    const offset = (parseInt(page) - 1) * pageSize;

    let q = query(
      collection(firestore, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (unreadOnly === 'true') {
      q = query(q, where('read', '==', false));
    }

    if (type) {
      q = query(q, where('type', '==', type));
    }

    // Apply pagination
    q = query(q, limit(pageSize));

    const snapshot = await getDocs(q);
    const notifications = [];

    snapshot.forEach((doc) => {
      const notification = { id: doc.id, ...doc.data() };
      notifications.push(notification);
    });

    // Get total count for pagination
    const totalQuery = query(
      collection(firestore, 'notifications'),
      where('userId', '==', userId)
    );
    const totalSnapshot = await getDocs(totalQuery);
    const total = totalSnapshot.size;

    // Get unread count
    const unreadQuery = query(
      collection(firestore, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const unreadSnapshot = await getDocs(unreadQuery);
    const unreadCount = unreadSnapshot.size;

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: offset + pageSize < total,
        hasPrev: parseInt(page) > 1
      },
      unreadCount
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      error: 'Failed to retrieve notifications',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/notifications/:id
 * Get specific notification by ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const notificationId = req.params.id;

    const notificationDoc = await getDoc(doc(firestore, 'notifications', notificationId));

    if (!notificationDoc.exists()) {
      return res.status(404).json({
        error: 'Notification not found'
      });
    }

    const notification = notificationDoc.data();

    // Check if notification belongs to user
    if (notification.userId !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Mark as read if not already
    if (!notification.read) {
      await updateDoc(doc(firestore, 'notifications', notificationId), {
        read: true,
        readAt: new Date().toISOString()
      });
      notification.read = true;
      notification.readAt = new Date().toISOString();
    }

    res.json({
      notification: { id: notificationId, ...notification }
    });

  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({
      error: 'Failed to retrieve notification'
    });
  }
});

/**
 * POST /api/notifications
 * Create a new notification (admin/official only)
 */
router.post('/',
  authenticateToken,
  authorizeRoles('official', 'analyst', 'admin'),
  async (req, res) => {
    try {
      const { title, message, type, priority = 'normal', targetUsers, targetRoles, data } = req.body;

      if (!title || !message || !type) {
        return res.status(400).json({
          error: 'Title, message, and type are required'
        });
      }

      const notificationId = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Determine target users
      let targetUserIds = [];

      if (targetUsers && targetUsers.length > 0) {
        // Specific users
        targetUserIds = targetUsers;
      } else if (targetRoles && targetRoles.length > 0) {
        // Users with specific roles
        const usersQuery = query(collection(firestore, 'users'));
        const usersSnapshot = await getDocs(usersQuery);

        usersSnapshot.forEach((doc) => {
          const user = doc.data();
          if (targetRoles.includes(user.role)) {
            targetUserIds.push(user.id);
          }
        });
      } else {
        // All users
        const usersQuery = query(collection(firestore, 'users'));
        const usersSnapshot = await getDocs(usersQuery);

        usersSnapshot.forEach((doc) => {
          targetUserIds.push(doc.data().id);
        });
      }

      // Create notification for each target user
      const createdNotifications = [];

      for (const userId of targetUserIds) {
        const userNotificationId = `${notificationId}_${userId}`;

        const notificationData = {
          id: userNotificationId,
          userId,
          title,
          message,
          type,
          priority,
          data: data || {},
          read: false,
          createdAt: new Date().toISOString(),
          createdBy: req.user.userId || req.user.id,
          expiresAt: null // Can be set for time-sensitive notifications
        };

        await setDoc(doc(firestore, 'notifications', userNotificationId), notificationData);
        createdNotifications.push(notificationData);

        // Emit real-time notification
        if (req.io) {
          req.io.to(`user-${userId}`).emit('new-notification', notificationData);
        }
      }

      res.status(201).json({
        message: `Notification sent to ${targetUserIds.length} users`,
        notificationId,
        recipients: targetUserIds.length,
        notifications: createdNotifications.slice(0, 5) // Return first 5 for preview
      });

    } catch (error) {
      console.error('Create notification error:', error);
      res.status(500).json({
        error: 'Failed to create notification'
      });
    }
  }
);

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const notificationId = req.params.id;

    const notificationDoc = await getDoc(doc(firestore, 'notifications', notificationId));

    if (!notificationDoc.exists()) {
      return res.status(404).json({
        error: 'Notification not found'
      });
    }

    const notification = notificationDoc.data();

    // Check if notification belongs to user
    if (notification.userId !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    await updateDoc(doc(firestore, 'notifications', notificationId), {
      read: true,
      readAt: new Date().toISOString()
    });

    res.json({
      message: 'Notification marked as read',
      notificationId
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      error: 'Failed to mark notification as read'
    });
  }
});

/**
 * PUT /api/notifications/read-all
 * Mark all user's notifications as read
 */
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    // Get all unread notifications for user
    const q = query(
      collection(firestore, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(q);
    const batch = [];

    snapshot.forEach((doc) => {
      batch.push(updateDoc(doc.ref, {
        read: true,
        readAt: new Date().toISOString()
      }));
    });

    await Promise.all(batch);

    res.json({
      message: `${batch.length} notifications marked as read`
    });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      error: 'Failed to mark notifications as read'
    });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const notificationId = req.params.id;

    const notificationDoc = await getDoc(doc(firestore, 'notifications', notificationId));

    if (!notificationDoc.exists()) {
      return res.status(404).json({
        error: 'Notification not found'
      });
    }

    const notification = notificationDoc.data();

    // Check if notification belongs to user or user is admin
    const userRole = req.user.role || 'citizen';
    const isOwner = notification.userId === userId;
    const isAdmin = ['admin', 'official'].includes(userRole);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    await deleteDoc(doc(firestore, 'notifications', notificationId));

    res.json({
      message: 'Notification deleted successfully',
      notificationId
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      error: 'Failed to delete notification'
    });
  }
});

/**
 * GET /api/notifications/types
 * Get available notification types
 */
router.get('/types', authenticateToken, async (req, res) => {
  const notificationTypes = {
    alert: {
      name: 'Hazard Alert',
      description: 'Emergency hazard notifications',
      priority: 'high'
    },
    update: {
      name: 'Status Update',
      description: 'Updates on reported hazards',
      priority: 'normal'
    },
    info: {
      name: 'Information',
      description: 'General information and announcements',
      priority: 'low'
    },
    volunteer: {
      name: 'Volunteer Opportunity',
      description: 'New volunteer tasks and opportunities',
      priority: 'normal'
    },
    donation: {
      name: 'Donation Update',
      description: 'Updates on donation campaigns',
      priority: 'normal'
    },
    system: {
      name: 'System Notification',
      description: 'System maintenance and updates',
      priority: 'low'
    }
  };

  res.json({
    types: notificationTypes
  });
});

/**
 * GET /api/notifications/stats
 * Get notification statistics for user
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    // Get total notifications
    const totalQuery = query(
      collection(firestore, 'notifications'),
      where('userId', '==', userId)
    );
    const totalSnapshot = await getDocs(totalQuery);
    const total = totalSnapshot.size;

    // Get unread notifications
    const unreadQuery = query(
      collection(firestore, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const unreadSnapshot = await getDocs(unreadQuery);
    const unread = unreadSnapshot.size;

    // Get notifications by type
    const typeStats = {};
    totalSnapshot.forEach((doc) => {
      const notification = doc.data();
      typeStats[notification.type] = (typeStats[notification.type] || 0) + 1;
    });

    // Get notifications by priority
    const priorityStats = {};
    totalSnapshot.forEach((doc) => {
      const notification = doc.data();
      priorityStats[notification.priority || 'normal'] = (priorityStats[notification.priority || 'normal'] || 0) + 1;
    });

    res.json({
      stats: {
        total,
        unread,
        read: total - unread,
        byType: typeStats,
        byPriority: priorityStats
      }
    });

  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      error: 'Failed to get notification statistics'
    });
  }
});

/**
 * POST /api/notifications/test
 * Send test notification to current user (for testing purposes)
 */
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { title = 'Test Notification', message = 'This is a test notification', type = 'info' } = req.body;

    const notificationId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const notificationData = {
      id: notificationId,
      userId,
      title,
      message,
      type,
      priority: 'low',
      data: { test: true },
      read: false,
      createdAt: new Date().toISOString(),
      createdBy: 'system'
    };

    await setDoc(doc(firestore, 'notifications', notificationId), notificationData);

    // Emit real-time notification
    if (req.io) {
      req.io.to(`user-${userId}`).emit('new-notification', notificationData);
    }

    res.status(201).json({
      message: 'Test notification sent',
      notification: notificationData
    });

  } catch (error) {
    console.error('Send test notification error:', error);
    res.status(500).json({
      error: 'Failed to send test notification'
    });
  }
});

/**
 * GET /api/notifications/flash-bulletins
 * Get active flash bulletins for homepage display
 */
router.get('/flash-bulletins', async (req, res) => {
  try {
    const bulletins = await getActiveBulletins();
    
    res.json({
      bulletins,
      count: bulletins.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get flash bulletins error:', error);
    res.status(500).json({
      error: 'Failed to get flash bulletins',
      bulletins: [], // Return empty array as fallback
      count: 0
    });
  }
});

export default router;
