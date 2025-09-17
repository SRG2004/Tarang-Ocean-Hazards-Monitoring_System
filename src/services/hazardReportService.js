import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  GeoPoint
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { sampleHazardReports, generateHotspots, getReportStatistics } from '../data/sampleHazardReports';

export const hazardReportService = {
  // Get auth token
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Submit a new hazard report to Firebase
  async submitReport(reportData) {
    try {
      console.log('Submitting report:', reportData);
      
      // Upload images to Firebase Storage first
      const imageUrls = [];
      if (reportData.mediaFiles && reportData.mediaFiles.length > 0) {
        for (const file of reportData.mediaFiles) {
          const imageRef = ref(storage, `hazard-reports/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(imageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          imageUrls.push(url);
        }
      }

      // Prepare report data for Firestore
      const firestoreReport = {
        title: reportData.title || 'Ocean Hazard Report',
        description: reportData.description || '',
        type: reportData.type || 'other',
        severity: reportData.severity || 'medium',
        location: {
          latitude: reportData.coordinates?.lat || reportData.location?.latitude || 0,
          longitude: reportData.coordinates?.lng || reportData.location?.longitude || 0,
          address: reportData.location?.address || 'Unknown location',
          state: reportData.location?.state || '',
          district: reportData.location?.district || '',
          geopoint: new GeoPoint(
            reportData.coordinates?.lat || reportData.location?.latitude || 0,
            reportData.coordinates?.lng || reportData.location?.longitude || 0
          )
        },
        reportedBy: {
          userId: reportData.userId,
          name: reportData.reporterName || 'Anonymous',
          phone: reportData.reporterPhone || '',
          email: reportData.reporterEmail || ''
        },
        images: imageUrls,
        status: 'unverified',
        verified: false,
        timestamp: serverTimestamp(),
        reportedAt: new Date().toISOString(),
        metadata: {
          source: 'citizen_report',
          deviceType: 'web',
          userAgent: navigator.userAgent
        }
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'hazardReports'), firestoreReport);
      
      console.log('Report submitted successfully:', docRef.id);
      return {
        success: true,
        reportId: docRef.id,
        data: { id: docRef.id, ...firestoreReport }
      };
    } catch (error) {
      console.error('Error submitting report to Firebase:', error);
      throw new Error('Failed to submit report: ' + error.message);
    }
  },

  // Get all reports from Firebase with filters
  async getReports(filters = {}) {
    try {
      console.log('Getting reports with filters:', filters);
      
      // Create base query
      let q = collection(db, 'hazardReports');
      
      // Apply filters
      const queryConstraints = [];
      
      if (filters.status) {
        queryConstraints.push(where('status', '==', filters.status));
      }
      if (filters.severity) {
        queryConstraints.push(where('severity', '==', filters.severity));
      }
      if (filters.type) {
        queryConstraints.push(where('type', '==', filters.type));
      }
      if (filters.userId) {
        queryConstraints.push(where('reportedBy.userId', '==', filters.userId));
      }
      
      // Add ordering and limit
      queryConstraints.push(orderBy('timestamp', 'desc'));
      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }
      
      // Execute query
      if (queryConstraints.length > 0) {
        q = query(q, ...queryConstraints);
      }
      
      const querySnapshot = await getDocs(q);
      const reports = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reports.push({
          id: doc.id,
          ...data,
          // Transform for compatibility with existing components
          coordinates: {
            lat: data.location.latitude,
            lng: data.location.longitude
          },
          createdAt: data.reportedAt,
          userInfo: data.reportedBy
        });
      });
      
      console.log(`Found ${reports.length} reports`);
      return reports;
      
    } catch (error) {
      console.error('Error getting reports from Firebase:', error);
      // Fallback to sample data if Firebase fails
      console.log('Falling back to sample data');
      let reports = [...sampleHazardReports];
      
      // Transform data structure to match map component expectations
      reports = reports.map(report => ({
        ...report,
        coordinates: {
          lat: report.location.latitude,
          lng: report.location.longitude
        },
        createdAt: report.reportedAt,
        userInfo: report.reportedBy
      }));
      
      return reports.slice(0, filters.limit || 50);
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
      // Return sample data statistics
      const stats = getReportStatistics(sampleHazardReports);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return stats;
    } catch (error) {
      console.error('Error getting hazard stats:', error);
      throw error;
    }
  },

  // Get hotspots for map visualization
  async getHotspots() {
    try {
      const hotspots = generateHotspots(sampleHazardReports);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return hotspots;
    } catch (error) {
      console.error('Error getting hotspots:', error);
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
      'storm_surge',
      'high_waves',
      'swell_surge',
      'coastal_current',
      'abnormal_sea_behavior',
      'cyclone',
      'coastal_erosion',
      'unusual_tide',
      'marine_flooding',
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
  },

  // Get INCOIS-specific ocean hazard types with descriptions
  getOceanHazardTypes() {
    return [
      { 
        value: 'tsunami', 
        label: 'Tsunami', 
        description: 'Seismic sea waves causing coastal inundation',
        icon: '🌊',
        priority: 'critical'
      },
      { 
        value: 'storm_surge', 
        label: 'Storm Surge', 
        description: 'Abnormal rise in sea level during storms',
        icon: '🌊',
        priority: 'high'
      },
      { 
        value: 'high_waves', 
        label: 'High Waves', 
        description: 'Dangerous wave heights affecting coastal areas',
        icon: '🌊',
        priority: 'high'
      },
      { 
        value: 'swell_surge', 
        label: 'Swell Surge', 
        description: 'Long-period ocean swells causing coastal flooding',
        icon: '🌊',
        priority: 'medium'
      },
      { 
        value: 'coastal_current', 
        label: 'Coastal Current', 
        description: 'Strong currents affecting navigation and safety',
        icon: '🌊',
        priority: 'medium'
      },
      { 
        value: 'abnormal_sea_behavior', 
        label: 'Abnormal Sea Behavior', 
        description: 'Unusual ocean patterns or phenomena',
        icon: '🌊',
        priority: 'medium'
      },
      { 
        value: 'unusual_tide', 
        label: 'Unusual Tide', 
        description: 'Abnormal tidal patterns or extreme tides',
        icon: '🌊',
        priority: 'medium'
      },
      { 
        value: 'marine_flooding', 
        label: 'Marine Flooding', 
        description: 'Coastal flooding due to marine conditions',
        icon: '🌊',
        priority: 'high'
      },
      { 
        value: 'coastal_erosion', 
        label: 'Coastal Erosion', 
        description: 'Accelerated coastal land loss',
        icon: '🏖️',
        priority: 'medium'
      },
      { 
        value: 'cyclone', 
        label: 'Cyclone', 
        description: 'Tropical cyclone affecting coastal regions',
        icon: '🌀',
        priority: 'critical'
      }
    ];
  }
};
