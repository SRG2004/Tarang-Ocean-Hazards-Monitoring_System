/**
 * Hazard Management Routes
 * Handles hazard reporting, verification, and real-time monitoring
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
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
import { calculateDistance, isWithinRadius } from '../utils/geoUtils.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/hazards/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `hazard-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

/**
 * POST /api/hazards/report
 * Submit a new hazard report with media files
 */
router.post('/report', 
  authenticateToken,
  upload.array('media', 5),
  async (req, res) => {
    try {
      const userId = req.user.userId || req.user.id;
      const {
        type,
        severity,
        title,
        description,
        coordinates,
        location,
        affectedAreas,
        estimatedImpact,
        witnessCount,
        isEmergency
      } = req.body;
      
      // Validate required fields
      if (!type || !severity || !title || !coordinates) {
        return res.status(400).json({
          error: 'Missing required fields: type, severity, title, coordinates'
        });
      }
      
      // Parse coordinates if string
      const coords = typeof coordinates === 'string' 
        ? JSON.parse(coordinates) 
        : coordinates;
      
      if (!coords.lat || !coords.lng) {
        return res.status(400).json({
          error: 'Invalid coordinates format'
        });
      }
      
      // Generate unique report ID
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Process uploaded files
      const mediaFiles = req.files ? req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        url: `/uploads/hazards/${file.filename}`
      })) : [];
      
      // Create hazard report
      const reportData = {
        id: reportId,
        userId,
        userInfo: {
          name: req.user.fullName,
          role: req.user.role,
          email: req.user.email
        },
        type: type.toLowerCase(),
        severity: severity.toLowerCase(),
        title,
        description: description || '',
        coordinates: coords,
        location: location || {},
        affectedAreas: affectedAreas || [],
        estimatedImpact: estimatedImpact || 'unknown',
        witnessCount: parseInt(witnessCount) || 1,
        isEmergency: Boolean(isEmergency),
        status: 'pending',
        verified: false,
        verifiedBy: null,
        verifiedAt: null,
        mediaFiles,
        metadata: {
          source: 'citizen_report',
          reportMethod: 'web_app',
          deviceInfo: req.headers['user-agent'],
          ipAddress: req.ip
        },
        engagement: {
          views: 0,
          likes: 0,
          shares: 0,
          comments: []
        },
        timeline: [{
          action: 'reported',
          timestamp: new Date().toISOString(),
          userId,
          details: 'Initial hazard report submitted'
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Auto-escalate if emergency or critical severity
      if (isEmergency || severity === 'critical') {
        reportData.status = 'urgent';
        reportData.escalated = true;
        reportData.escalatedAt = new Date().toISOString();
        reportData.timeline.push({
          action: 'escalated',
          timestamp: new Date().toISOString(),
          details: 'Auto-escalated due to emergency/critical status'
        });
      }
      
      // Save to database
      await setDoc(doc(firestore, 'hazardReports', reportId), reportData);
      
      // Update user statistics
      const userRef = doc(firestore, 'users', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      
      await updateDoc(userRef, {
        'stats.reportsSubmitted': (userData.stats?.reportsSubmitted || 0) + 1,
        updatedAt: new Date().toISOString()
      });
      
      // Emit real-time event (will be handled by Socket.IO)
      req.io?.emit('new-hazard-report', {
        report: reportData,
        location: coords
      });
      
      res.status(201).json({
        message: 'Hazard report submitted successfully',
        report: reportData
      });
      
    } catch (error) {
      console.error('Submit hazard report error:', error);
      res.status(500).json({
        error: 'Failed to submit hazard report',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * GET /api/hazards
 * Get hazard reports with filtering and pagination
 */
router.get('/', async (req, res) => {
  try {
    const {
      status,
      severity,
      type,
      verified,
      lat,
      lng,
      radius = 50, // Default 50km radius
      limit: queryLimit = 100,
      startAfter,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let q = collection(firestore, 'hazardReports');
    const constraints = [];
    
    // Apply filters
    if (status) {
      constraints.push(where('status', '==', status));
    }
    
    if (severity) {
      constraints.push(where('severity', '==', severity));
    }
    
    if (type) {
      constraints.push(where('type', '==', type));
    }
    
    if (verified !== undefined) {
      constraints.push(where('verified', '==', verified === 'true'));
    }
    
    // Add ordering
    constraints.push(orderBy(sortBy, sortOrder));
    
    // Add limit
    constraints.push(limit(parseInt(queryLimit)));
    
    // Build query
    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    let reports = [];
    
    querySnapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() });
    });
    
    // Apply location-based filtering if coordinates provided
    if (lat && lng) {
      const centerLat = parseFloat(lat);
      const centerLng = parseFloat(lng);
      const radiusKm = parseFloat(radius);
      
      reports = reports.filter(report => {
        if (!report.coordinates) return false;
        
        const distance = calculateDistance(
          centerLat, centerLng,
          report.coordinates.lat, report.coordinates.lng
        );
        
        return distance <= radiusKm;
      });
    }
    
    // Add additional computed fields
    reports = reports.map(report => ({
      ...report,
      timeAgo: getTimeAgo(report.createdAt),
      urgencyScore: calculateUrgencyScore(report),
      distanceFromUser: lat && lng && report.coordinates 
        ? calculateDistance(parseFloat(lat), parseFloat(lng), report.coordinates.lat, report.coordinates.lng)
        : null
    }));
    
    res.json({
      reports,
      total: reports.length,
      filters: { status, severity, type, verified, lat, lng, radius },
      pagination: {
        limit: parseInt(queryLimit),
        hasMore: reports.length === parseInt(queryLimit)
      }
    });
    
  } catch (error) {
    console.error('Get hazard reports error:', error);
    res.status(500).json({
      error: 'Failed to retrieve hazard reports',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/hazards/:id
 * Get specific hazard report by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    
    const reportDoc = await getDoc(doc(firestore, 'hazardReports', reportId));
    
    if (!reportDoc.exists()) {
      return res.status(404).json({
        error: 'Hazard report not found'
      });
    }
    
    const reportData = reportDoc.data();
    
    // Increment view count
    await updateDoc(doc(firestore, 'hazardReports', reportId), {
      'engagement.views': (reportData.engagement?.views || 0) + 1,
      updatedAt: new Date().toISOString()
    });
    
    // Add computed fields
    const enhancedReport = {
      ...reportData,
      timeAgo: getTimeAgo(reportData.createdAt),
      urgencyScore: calculateUrgencyScore(reportData)
    };
    
    res.json({
      report: enhancedReport
    });
    
  } catch (error) {
    console.error('Get hazard report error:', error);
    res.status(500).json({
      error: 'Failed to retrieve hazard report',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/hazards/:id/verify
 * Verify hazard report (officials only)
 */
router.put('/:id/verify',
  authenticateToken,
  authorizeRoles('official', 'analyst', 'admin'),
  async (req, res) => {
    try {
      const reportId = req.params.id;
      const { verified, verificationNotes, newStatus } = req.body;
      
      const reportDoc = await getDoc(doc(firestore, 'hazardReports', reportId));
      
      if (!reportDoc.exists()) {
        return res.status(404).json({
          error: 'Hazard report not found'
        });
      }
      
      const updateData = {
        verified: Boolean(verified),
        verifiedBy: req.user.userId || req.user.id,
        verifiedAt: new Date().toISOString(),
        verificationNotes: verificationNotes || '',
        updatedAt: new Date().toISOString()
      };
      
      if (newStatus) {
        updateData.status = newStatus;
      }
      
      // Add to timeline
      const reportData = reportDoc.data();
      const newTimelineEntry = {
        action: verified ? 'verified' : 'rejected',
        timestamp: new Date().toISOString(),
        userId: req.user.userId || req.user.id,
        details: `Report ${verified ? 'verified' : 'rejected'} by ${req.user.fullName}${verificationNotes ? ': ' + verificationNotes : ''}`
      };
      
      updateData.timeline = [...(reportData.timeline || []), newTimelineEntry];
      
      await updateDoc(doc(firestore, 'hazardReports', reportId), updateData);
      
      // Emit real-time event
      req.io?.emit('hazard-verification-update', {
        reportId,
        verified,
        verifiedBy: req.user.fullName,
        status: newStatus || reportData.status
      });
      
      res.json({
        message: `Hazard report ${verified ? 'verified' : 'rejected'} successfully`,
        reportId,
        verified,
        verifiedBy: req.user.fullName
      });
      
    } catch (error) {
      console.error('Verify hazard report error:', error);
      res.status(500).json({
        error: 'Failed to verify hazard report',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * GET /api/hazards/nearby/:lat/:lng
 * Get hazards near specific coordinates
 */
router.get('/nearby/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const { radius = 25, limit: queryLimit = 50 } = req.query;
    
    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const radiusKm = parseFloat(radius);
    
    if (isNaN(centerLat) || isNaN(centerLng)) {
      return res.status(400).json({
        error: 'Invalid coordinates'
      });
    }
    
    // Get all active reports (we'll filter by distance)
    const q = query(
      collection(firestore, 'hazardReports'),
      where('status', '!=', 'resolved'),
      orderBy('status'),
      orderBy('createdAt', 'desc'),
      limit(parseInt(queryLimit) * 2) // Get more to account for distance filtering
    );
    
    const querySnapshot = await getDocs(q);
    const nearbyReports = [];
    
    querySnapshot.forEach((doc) => {
      const report = doc.data();
      
      if (report.coordinates) {
        const distance = calculateDistance(
          centerLat, centerLng,
          report.coordinates.lat, report.coordinates.lng
        );
        
        if (distance <= radiusKm) {
          nearbyReports.push({
            ...report,
            distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
            bearing: calculateBearing(centerLat, centerLng, report.coordinates.lat, report.coordinates.lng)
          });
        }
      }
    });
    
    // Sort by distance and limit results
    nearbyReports.sort((a, b) => a.distance - b.distance);
    const limitedReports = nearbyReports.slice(0, parseInt(queryLimit));
    
    res.json({
      reports: limitedReports,
      total: limitedReports.length,
      searchArea: {
        center: { lat: centerLat, lng: centerLng },
        radius: radiusKm
      }
    });
    
  } catch (error) {
    console.error('Get nearby hazards error:', error);
    res.status(500).json({
      error: 'Failed to retrieve nearby hazards',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Utility functions
function getTimeAgo(timestamp) {
  const now = new Date();
  const reportTime = new Date(timestamp);
  const diffMs = now - reportTime;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return 'Less than 1 hour ago';
}

function calculateUrgencyScore(report) {
  let score = 0;
  
  // Severity scoring
  const severityScores = { critical: 100, high: 75, medium: 50, low: 25 };
  score += severityScores[report.severity] || 0;
  
  // Emergency flag
  if (report.isEmergency) score += 50;
  
  // Verification status
  if (report.verified) score += 25;
  
  // Time factor (more recent = higher score)
  const hoursAgo = (new Date() - new Date(report.createdAt)) / (1000 * 60 * 60);
  const timeFactor = Math.max(0, 25 - (hoursAgo / 2));
  score += timeFactor;
  
  // Witness count
  score += Math.min(25, (report.witnessCount || 1) * 5);
  
  return Math.round(score);
}

function calculateBearing(lat1, lng1, lat2, lng2) {
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  bearing = (bearing + 360) % 360;
  
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

export default router;