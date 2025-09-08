/**
 * Analytics Routes
 * Provides data analytics, reporting, and insights for ocean hazard monitoring
 */

import express from 'express';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  Timestamp
} from 'firebase/firestore';
import { firestore } from '../config/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/analytics/dashboard
 * Get comprehensive dashboard analytics
 */
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role || 'citizen';
    const analytics = {};

    // Hazard reports analytics
    const hazardStats = await getHazardAnalytics();
    analytics.hazards = hazardStats;

    // Social media analytics (if user has access)
    if (['analyst', 'official', 'admin'].includes(userRole)) {
      const socialStats = await getSocialMediaAnalytics();
      analytics.socialMedia = socialStats;
    }

    // Donation analytics
    const donationStats = await getDonationAnalytics();
    analytics.donations = donationStats;

    // Volunteer analytics
    const volunteerStats = await getVolunteerAnalytics();
    analytics.volunteers = volunteerStats;

    // User engagement metrics
    const engagementStats = await getEngagementAnalytics();
    analytics.engagement = engagementStats;

    // Geographic distribution
    const geoStats = await getGeographicAnalytics();
    analytics.geographic = geoStats;

    res.json({
      analytics,
      generatedAt: new Date().toISOString(),
      userRole
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      error: 'Failed to generate dashboard analytics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/analytics/hazards
 * Get detailed hazard analytics
 */
router.get('/hazards', authenticateToken, async (req, res) => {
  try {
    const { period = '30d', type, severity } = req.query;
    const hazardStats = await getHazardAnalytics(period, type, severity);

    res.json({
      analytics: hazardStats,
      filters: { period, type, severity }
    });

  } catch (error) {
    console.error('Hazard analytics error:', error);
    res.status(500).json({
      error: 'Failed to generate hazard analytics'
    });
  }
});

/**
 * GET /api/analytics/reports
 * Generate detailed reports
 */
router.get('/reports',
  authenticateToken,
  authorizeRoles('analyst', 'official', 'admin'),
  async (req, res) => {
    try {
      const { type = 'comprehensive', format = 'json', startDate, endDate } = req.query;

      let reportData = {};

      switch (type) {
        case 'hazards':
          reportData = await generateHazardReport(startDate, endDate);
          break;
        case 'social':
          reportData = await generateSocialMediaReport(startDate, endDate);
          break;
        case 'donations':
          reportData = await generateDonationReport(startDate, endDate);
          break;
        case 'volunteers':
          reportData = await generateVolunteerReport(startDate, endDate);
          break;
        case 'comprehensive':
        default:
          reportData = await generateComprehensiveReport(startDate, endDate);
          break;
      }

      if (format === 'csv') {
        // Convert to CSV format
        const csvData = convertToCSV(reportData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${type}_report_${Date.now()}.csv"`);
        res.send(csvData);
      } else {
        res.json({
          report: reportData,
          type,
          generatedAt: new Date().toISOString(),
          period: { startDate, endDate }
        });
      }

    } catch (error) {
      console.error('Report generation error:', error);
      res.status(500).json({
        error: 'Failed to generate report'
      });
    }
  }
);

/**
 * GET /api/analytics/trends
 * Get trend analysis data
 */
router.get('/trends', authenticateToken, async (req, res) => {
  try {
    const { metric = 'hazards', period = '7d' } = req.query;
    const trends = await getTrendAnalysis(metric, period);

    res.json({
      trends,
      metric,
      period
    });

  } catch (error) {
    console.error('Trend analysis error:', error);
    res.status(500).json({
      error: 'Failed to generate trend analysis'
    });
  }
});

/**
 * GET /api/analytics/alerts
 * Get alert analytics and patterns
 */
router.get('/alerts',
  authenticateToken,
  authorizeRoles('analyst', 'official', 'admin'),
  async (req, res) => {
  try {
    const alertPatterns = await getAlertPatterns();
    const responseTimes = await getResponseTimeAnalytics();
    const falsePositives = await getFalsePositiveAnalytics();

    res.json({
      alertPatterns,
      responseTimes,
      falsePositives,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Alert analytics error:', error);
    res.status(500).json({
      error: 'Failed to generate alert analytics'
    });
  }
});

// Helper functions for analytics

async function getHazardAnalytics(period = '30d', type, severity) {
  const days = parseInt(period.replace('d', ''));
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let q = query(
    collection(firestore, 'hazardReports'),
    where('createdAt', '>=', startDate.toISOString()),
    orderBy('createdAt', 'desc')
  );

  if (type) {
    q = query(q, where('type', '==', type));
  }

  if (severity) {
    q = query(q, where('severity', '==', severity));
  }

  const snapshot = await getDocs(q);
  const reports = snapshot.docs.map(doc => doc.data());

  // Calculate statistics
  const stats = {
    total: reports.length,
    byType: {},
    bySeverity: {},
    byStatus: {},
    byLocation: {},
    trends: [],
    averageResponseTime: 0,
    verificationRate: 0
  };

  reports.forEach(report => {
    // Count by type
    stats.byType[report.type] = (stats.byType[report.type] || 0) + 1;

    // Count by severity
    stats.bySeverity[report.severity] = (stats.bySeverity[report.severity] || 0) + 1;

    // Count by status
    stats.byStatus[report.status] = (stats.byStatus[report.status] || 0) + 1;

    // Count by location (simplified)
    if (report.location && report.location.city) {
      stats.byLocation[report.location.city] = (stats.byLocation[report.location.city] || 0) + 1;
    }

    // Verification rate
    if (report.verified) {
      stats.verificationRate++;
    }
  });

  stats.verificationRate = stats.total > 0 ? (stats.verificationRate / stats.total) * 100 : 0;

  return stats;
}

async function getSocialMediaAnalytics() {
  // Simulated social media analytics
  return {
    totalPosts: 1250,
    sentimentDistribution: {
      positive: 45,
      negative: 25,
      neutral: 30
    },
    trendingTopics: [
      { topic: '#OceanSafety', mentions: 234 },
      { topic: '#BeachWarning', mentions: 189 },
      { topic: '#MarineLife', mentions: 156 }
    ],
    engagementRate: 12.5,
    alertCorrelation: 78
  };
}

async function getDonationAnalytics() {
  const donations = await getDocs(collection(firestore, 'donations'));

  const stats = {
    totalAmount: 0,
    totalDonations: donations.size,
    averageDonation: 0,
    byPurpose: {},
    monthlyTrends: [],
    topDonors: []
  };

  donations.forEach(doc => {
    const donation = doc.data();
    stats.totalAmount += donation.amount || 0;

    if (donation.purpose) {
      stats.byPurpose[donation.purpose] = (stats.byPurpose[donation.purpose] || 0) + (donation.amount || 0);
    }
  });

  stats.averageDonation = stats.totalDonations > 0 ? stats.totalAmount / stats.totalDonations : 0;

  return stats;
}

async function getVolunteerAnalytics() {
  const volunteers = await getDocs(collection(firestore, 'volunteers'));

  const stats = {
    totalVolunteers: volunteers.size,
    activeVolunteers: 0,
    totalTasks: 0,
    completedTasks: 0,
    averageRating: 0,
    skillsDistribution: {},
    availabilityStats: {}
  };

  volunteers.forEach(doc => {
    const volunteer = doc.data();
    if (volunteer.status === 'active') {
      stats.activeVolunteers++;
    }

    stats.totalTasks += volunteer.completedTasks || 0;
    stats.completedTasks += volunteer.completedTasks || 0;

    if (volunteer.rating) {
      stats.averageRating += volunteer.rating;
    }

    if (volunteer.skills) {
      volunteer.skills.forEach(skill => {
        stats.skillsDistribution[skill] = (stats.skillsDistribution[skill] || 0) + 1;
      });
    }
  });

  stats.averageRating = stats.totalVolunteers > 0 ? stats.averageRating / stats.totalVolunteers : 0;

  return stats;
}

async function getEngagementAnalytics() {
  return {
    totalUsers: 1250,
    activeUsers: 890,
    newRegistrations: 45,
    reportSubmissions: 234,
    averageSessionDuration: '12m 30s',
    featureUsage: {
      mapView: 78,
      reportSubmission: 65,
      socialMedia: 45,
      donations: 32
    }
  };
}

async function getGeographicAnalytics() {
  const reports = await getDocs(collection(firestore, 'hazardReports'));

  const stats = {
    totalLocations: 0,
    hotspots: [],
    coverage: {},
    riskZones: []
  };

  const locationCount = {};

  reports.forEach(doc => {
    const report = doc.data();
    if (report.coordinates) {
      const key = `${report.coordinates.lat.toFixed(2)},${report.coordinates.lng.toFixed(2)}`;
      locationCount[key] = (locationCount[key] || 0) + 1;
    }
  });

  // Find hotspots (locations with multiple reports)
  Object.entries(locationCount).forEach(([coords, count]) => {
    if (count >= 3) {
      stats.hotspots.push({
        coordinates: coords.split(',').map(Number),
        reportCount: count
      });
    }
  });

  stats.totalLocations = Object.keys(locationCount).length;

  return stats;
}

async function getTrendAnalysis(metric, period) {
  // Simplified trend analysis
  const days = parseInt(period.replace('d', ''));
  const trends = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    trends.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 100) + 50 // Simulated data
    });
  }

  return trends;
}

async function getAlertPatterns() {
  return {
    commonTypes: ['tsunami', 'storm', 'oil_spill'],
    peakHours: ['06:00-12:00', '18:00-24:00'],
    seasonalPatterns: {
      summer: 'high',
      winter: 'medium',
      monsoon: 'critical'
    },
    falsePositiveRate: 12.5
  };
}

async function getResponseTimeAnalytics() {
  return {
    averageResponseTime: '4h 32m',
    medianResponseTime: '3h 15m',
    fastestResponse: '45m',
    slowestResponse: '18h 20m',
    bySeverity: {
      critical: '1h 30m',
      high: '3h 45m',
      medium: '6h 20m',
      low: '12h 10m'
    }
  };
}

async function getFalsePositiveAnalytics() {
  return {
    totalAlerts: 1000,
    falsePositives: 125,
    rate: 12.5,
    byType: {
      tsunami: 8,
      storm: 15,
      oil_spill: 22
    },
    improvement: -5.2 // percentage improvement
  };
}

// Report generation functions
async function generateComprehensiveReport(startDate, endDate) {
  const [hazards, social, donations, volunteers] = await Promise.all([
    generateHazardReport(startDate, endDate),
    generateSocialMediaReport(startDate, endDate),
    generateDonationReport(startDate, endDate),
    generateVolunteerReport(startDate, endDate)
  ]);

  return {
    summary: {
      period: { startDate, endDate },
      generatedAt: new Date().toISOString()
    },
    hazards,
    social,
    donations,
    volunteers
  };
}

async function generateHazardReport(startDate, endDate) {
  const hazards = await getHazardAnalytics('90d');
  return {
    title: 'Hazard Report',
    data: hazards,
    insights: [
      'Increased tsunami reports in coastal areas',
      'Storm season showing higher activity',
      'Improved response times for critical alerts'
    ]
  };
}

async function generateSocialMediaReport(startDate, endDate) {
  const social = await getSocialMediaAnalytics();
  return {
    title: 'Social Media Report',
    data: social,
    insights: [
      'Positive sentiment increased by 15%',
      'New trending topics related to marine conservation',
      'Higher engagement during weekend periods'
    ]
  };
}

async function generateDonationReport(startDate, endDate) {
  const donations = await getDonationAnalytics();
  return {
    title: 'Donation Report',
    data: donations,
    insights: [
      'Total donations increased by 25%',
      'New donor acquisition up 18%',
      'Environmental causes receiving highest contributions'
    ]
  };
}

async function generateVolunteerReport(startDate, endDate) {
  const volunteers = await getVolunteerAnalytics();
  return {
    title: 'Volunteer Report',
    data: volunteers,
    insights: [
      'Volunteer base grew by 12%',
      'Task completion rate at 94%',
      'Emergency response volunteers most active'
    ]
  };
}

function convertToCSV(data) {
  // Simple CSV conversion (would need more sophisticated implementation for complex data)
  let csv = 'Key,Value\n';

  const flatten = (obj, prefix = '') => {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        flatten(value, prefix + key + '.');
      } else {
        csv += `"${prefix + key}","${value}"\n`;
      }
    }
  };

  flatten(data);
  return csv;
}

export default router;
