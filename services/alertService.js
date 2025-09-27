/**
 * Automated Alert Service
 * Handles automated alerts and notifications based on hazard data
 */
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const alertsCollection = collection(db, 'alerts');

export const startAutomatedAlerts = (io) => {
  console.log('Starting automated alert service...');

  // Check for alerts every 5 minutes
  setInterval(() => {
    checkForAutomatedAlerts(io);
  }, 5 * 60 * 1000); // 5 minutes

  // Check for critical alerts every minute
  setInterval(() => {
    checkForCriticalAlerts(io);
  }, 60 * 1000); // 1 minute

  console.log('Automated alert service started successfully');
};

/**
 * Check for automated alerts based on hazard patterns
 */
const checkForAutomatedAlerts = async (io) => {
  try {
    console.log('Checking for automated alerts...');
    const simulatedAlerts = await generateSimulatedAlerts();
    simulatedAlerts.forEach(alert => {
      broadcastAlert(io, alert);
    });
  } catch (error) {
    console.error('Error checking for automated alerts:', error);
  }
};

/**
 * Check for critical alerts that need immediate attention
 */
const checkForCriticalAlerts = async (io) => {
  try {
    console.log('Checking for critical alerts...');
    const criticalAlerts = await generateCriticalAlerts();
    criticalAlerts.forEach(alert => {
      broadcastCriticalAlert(io, alert);
    });
  } catch (error) {
    console.error('Error checking for critical alerts:', error);
  }
};

/**
 * Generate simulated automated alerts and add them to Firestore
 */
const generateSimulatedAlerts = async () => {
  const alerts = [];

  if (Math.random() > 0.8) { // 20% chance
    const alertData = {
      type: 'pattern_alert',
      title: 'Increased Storm Activity Detected',
      message: 'Multiple storm reports detected in coastal regions. Increased monitoring recommended.',
      severity: 'medium',
      location: { lat: 13.0827, lng: 80.2707 }, // Chennai coordinates
      timestamp: serverTimestamp(),
      automated: true
    };
    const docRef = await addDoc(alertsCollection, alertData);
    alerts.push({ id: docRef.id, ...alertData });
  }

  if (Math.random() > 0.9) { // 10% chance
    const alertData = {
      type: 'trend_alert',
      title: 'Rising Sea Levels Trend',
      message: 'Sea level measurements show upward trend in monitored areas.',
      severity: 'low',
      location: null,
      timestamp: serverTimestamp(),
      automated: true
    };
    const docRef = await addDoc(alertsCollection, alertData);
    alerts.push({ id: docRef.id, ...alertData });
  }

  return alerts;
};

/**
 * Generate simulated critical alerts and add them to Firestore
 */
const generateCriticalAlerts = async () => {
  const alerts = [];

  if (Math.random() > 0.95) { // 5% chance
    const alertData = {
      type: 'critical_alert',
      title: 'CRITICAL: Tsunami Warning Issued',
      message: 'Tsunami warning issued for coastal regions. Immediate evacuation procedures activated.',
      severity: 'critical',
      location: { lat: 13.0827, lng: 80.2707 },
      timestamp: serverTimestamp(),
      automated: true,
      requiresImmediateAction: true
    };
    const docRef = await addDoc(alertsCollection, alertData);
    alerts.push({ id: docRef.id, ...alertData });
  }

  return alerts;
};

/**
 * Broadcast automated alert to all connected clients
 */
const broadcastAlert = (io, alert) => {
  console.log('Broadcasting automated alert:', alert.title);
  io.emit('automated-alert', {
    ...alert,
    broadcastTime: new Date().toISOString()
  });
  if (alert.location) {
    const locationRoom = `location-${Math.floor(alert.location.lat)}-${Math.floor(alert.location.lng)}`;
    io.to(locationRoom).emit('location-alert', alert);
  }
};

/**
 * Broadcast critical alert with priority
 */
const broadcastCriticalAlert = (io, alert) => {
  console.log('Broadcasting CRITICAL alert:', alert.title);
  io.emit('critical-alert', {
    ...alert,
    broadcastTime: new Date().toISOString(),
    priority: 'urgent'
  });
  io.emit('official-notification', {
    type: 'critical_alert',
    title: alert.title,
    message: alert.message,
    requiresAction: true
  });
};

/**
 * Create alert based on hazard report analysis and add to Firestore
 */
export const createAlertFromHazardReport = async (hazardReport, io) => {
  const alertData = {
    type: 'hazard_report_alert',
    title: `New ${hazardReport.type} Report`,
    message: `${hazardReport.type} reported at ${hazardReport.location?.city || 'Unknown Location'}`,
    severity: hazardReport.severity,
    location: hazardReport.coordinates,
    timestamp: serverTimestamp(),
    hazardReportId: hazardReport.id,
    automated: false
  };
  const docRef = await addDoc(alertsCollection, alertData);
  const newAlert = { id: docRef.id, ...alertData };
  broadcastAlert(io, newAlert);
};

/**
 * Get alert statistics
 */
export const getAlertStats = () => {
  // This can be expanded to fetch real stats from Firestore
  return {
    totalAlerts: 150,
    criticalAlerts: 12,
    automatedAlerts: 89,
    manualAlerts: 61,
    responseRate: 94.2,
    averageResponseTime: '4h 32m',
    lastUpdated: new Date().toISOString()
  };
};
