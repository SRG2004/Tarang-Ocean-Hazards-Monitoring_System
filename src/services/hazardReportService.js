import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export const hazardReportService = {
  // Submit a new hazard report
  async submitReport(reportData) {
    try {
      const report = {
        ...reportData,
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        status: 'pending',
        verified: false,
        severity: reportData.severity || 'medium',
        location: reportData.location || {},
        coordinates: reportData.coordinates || null,
        mediaUrls: []
      };

      // Upload media files if present
      if (reportData.mediaFiles && reportData.mediaFiles.length > 0) {
        const mediaUrls = await this.uploadMedia(reportData.mediaFiles, report.id);
        report.mediaUrls = mediaUrls;
      }

      const docRef = await addDoc(collection(db, 'hazardReports'), report);
      return { success: true, reportId: docRef.id, data: report };
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  },

  // Upload media files
  async uploadMedia(files, reportId) {
    const uploadPromises = files.map(async (file, index) => {
      const storageRef = ref(storage, `reports/${reportId}/media_${index}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    });

    return await Promise.all(uploadPromises);
  },

  // Get all reports
  async getReports(filters = {}) {
    try {
      let q = collection(db, 'hazardReports');

      // Apply filters
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.severity) {
        q = query(q, where('severity', '==', filters.severity));
      }
      if (filters.userId) {
        q = query(q, where('userId', '==', filters.userId));
      }

      // Order by timestamp
      q = query(q, orderBy('timestamp', 'desc'));

      // Limit results
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const reports = [];
      querySnapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() });
      });

      return reports;
    } catch (error) {
      console.error('Error getting reports:', error);
      throw error;
    }
  },

  // Update report status
  async updateReportStatus(reportId, status, verificationData = {}) {
    try {
      const reportRef = doc(db, 'hazardReports', reportId);
      const updateData = {
        status,
        verified: status === 'verified',
        lastUpdated: new Date().toISOString(),
        ...verificationData
      };

      await updateDoc(reportRef, updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  },

  // Real-time reports listener
  subscribeToReports(callback, filters = {}) {
    let q = collection(db, 'hazardReports');

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    q = query(q, orderBy('timestamp', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
      const reports = [];
      querySnapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() });
      });
      callback(reports);
    });
  },

  // Get reports by location radius
  async getReportsByLocation(centerLat, centerLng, radiusKm = 50) {
    try {
      const reports = await this.getReports();
      
      // Filter by distance (simplified calculation)
      const filteredReports = reports.filter(report => {
        if (!report.coordinates) return false;
        
        const distance = this.calculateDistance(
          centerLat, centerLng,
          report.coordinates.lat, report.coordinates.lng
        );
        
        return distance <= radiusKm;
      });

      return filteredReports;
    } catch (error) {
      console.error('Error getting reports by location:', error);
      throw error;
    }
  },

  // Calculate distance between two points
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

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }
};