/**
 * Automated Alert Service
 * Handles automated alerts and notifications based on hazard data
 */

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
    // This would typically query the database for recent hazard reports
    // and analyze patterns to generate automated alerts

    console.log('Checking for automated alerts...');

    // Simulate automated alert generation
    const simulatedAlerts = generateSimulatedAlerts();

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
    // Check for critical hazard reports that need immediate response
    console.log('Checking for critical alerts...');

    // Simulate critical alert detection
    const criticalAlerts = generateCriticalAlerts();

    criticalAlerts.forEach(alert => {
      broadcastCriticalAlert(io, alert);
    });

  } catch (error) {
    console.error('Error checking for critical alerts:', error);
  }
};

/**
 * Generate simulated automated alerts
 */
const generateSimulatedAlerts = () => {
  const alerts = [];

  // Simulate pattern-based alerts
  if (Math.random() > 0.8) { // 20% chance
    alerts.push({
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'pattern_alert',
      title: 'Increased Storm Activity Detected',
      message: 'Multiple storm reports detected in coastal regions. Increased monitoring recommended.',
      severity: 'medium',
      location: { lat: 13.0827, lng: 80.2707 }, // Chennai coordinates
      timestamp: new Date().toISOString(),
      automated: true
    });
  }

  if (Math.random() > 0.9) { // 10% chance
    alerts.push({
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'trend_alert',
      title: 'Rising Sea Levels Trend',
      message: 'Sea level measurements show upward trend in monitored areas.',
      severity: 'low',
      location: null,
      timestamp: new Date().toISOString(),
      automated: true
    });
  }

  return alerts;
};

/**
 * Generate simulated critical alerts
 */
const generateCriticalAlerts = () => {
  const alerts = [];

  // Simulate critical alerts (rare)
  if (Math.random() > 0.95) { // 5% chance
    alerts.push({
      id: `critical_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'critical_alert',
      title: 'CRITICAL: Tsunami Warning Issued',
      message: 'Tsunami warning issued for coastal regions. Immediate evacuation procedures activated.',
      severity: 'critical',
      location: { lat: 13.0827, lng: 80.2707 },
      timestamp: new Date().toISOString(),
      automated: true,
      requiresImmediateAction: true
    });
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

  // Also send to location-specific rooms if location is specified
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

  // Send to all clients with high priority
  io.emit('critical-alert', {
    ...alert,
    broadcastTime: new Date().toISOString(),
    priority: 'urgent'
  });

  // Send push notifications to officials
  // This would integrate with notification service
  io.emit('official-notification', {
    type: 'critical_alert',
    title: alert.title,
    message: alert.message,
    requiresAction: true
  });
};

/**
 * Create alert based on hazard report analysis
 */
export const createAlertFromHazardReport = (hazardReport, io) => {
  const alert = {
    id: `hazard_alert_${Date.now()}`,
    type: 'hazard_report_alert',
    title: `New ${hazardReport.type} Report`,
    message: `${hazardReport.type} reported at ${hazardReport.location?.city || 'Unknown Location'}`,
    severity: hazardReport.severity,
    location: hazardReport.coordinates,
    timestamp: new Date().toISOString(),
    hazardReportId: hazardReport.id,
    automated: false
  };

  broadcastAlert(io, alert);
};

/**
 * Get alert statistics
 */
export const getAlertStats = () => {
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
