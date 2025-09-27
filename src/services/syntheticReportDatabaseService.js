/**
 * Synthetic Report Database Service
 * Handles database operations for synthetic social media reports
 * Integrates with existing Firebase/Firestore infrastructure
 */

import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  deleteDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

export class SyntheticReportDatabaseService {
  constructor() {
    this.collectionName = 'syntheticReports';
    this.socialMediaCollection = 'socialMediaPosts';
    this.listeners = new Map();
  }

  /**
   * Save synthetic report to database
   */
  async saveSyntheticReport(report) {
    try {
      const reportId = `synthetic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const dbReport = {
        id: reportId,
        ...report,
        savedAt: new Date().toISOString(),
        isSynthetic: true,
        source: 'synthetic_generator'
      };

      // Save to synthetic reports collection
      await setDoc(doc(db, this.collectionName, reportId), dbReport);

      // Also save to social media posts collection for integration
      const socialMediaReport = {
        ...dbReport,
        // Map synthetic report fields to social media post structure
        content: dbReport.content,
        platform: dbReport.platform,
        author: dbReport.author,
        timestamp: dbReport.timestamp,
        processedAt: new Date().toISOString(),
        sentiment: dbReport.sentiment,
        keywords: dbReport.keywords,
        relevanceScore: dbReport.relevanceScore,
        isHazardRelated: true,
        engagement: dbReport.engagement,
        location: dbReport.location,
        isSynthetic: true,
        syntheticMetadata: {
          hazardType: dbReport.hazardType,
          severity: dbReport.severity,
          generatedAt: dbReport.generatedAt
        }
      };

      await setDoc(doc(db, this.socialMediaCollection, reportId), socialMediaReport);

      console.log(`✅ Synthetic report saved to database: ${reportId}`);
      return { reportId, dbReport, socialMediaReport };

    } catch (error) {
      console.error('❌ Error saving synthetic report:', error);
      throw new Error(`Failed to save synthetic report: ${error.message}`);
    }
  }

  /**
   * Save multiple synthetic reports
   */
  async saveMultipleSyntheticReports(reports) {
    try {
      const results = [];
      console.log(`💾 Saving ${reports.length} synthetic reports to database...`);

      for (const report of reports) {
        const result = await this.saveSyntheticReport(report);
        results.push(result);
      }

      console.log(`✅ Successfully saved ${results.length} synthetic reports`);
      return results;

    } catch (error) {
      console.error('❌ Error saving multiple synthetic reports:', error);
      throw new Error(`Failed to save multiple synthetic reports: ${error.message}`);
    }
  }

  /**
   * Get synthetic reports from database
   */
  async getSyntheticReports(filters = {}) {
    try {
      let q = collection(db, this.collectionName);
      const constraints = [];

      // Apply filters
      if (filters.hazardType) {
        constraints.push(where('hazardType', '==', filters.hazardType));
      }

      if (filters.severity) {
        constraints.push(where('severity', '==', filters.severity));
      }

      if (filters.platform) {
        constraints.push(where('platform', '==', filters.platform));
      }

      if (filters.location) {
        constraints.push(where('location.name', '==', filters.location));
      }

      if (filters.startDate) {
        constraints.push(where('generatedAt', '>=', filters.startDate));
      }

      if (filters.endDate) {
        constraints.push(where('generatedAt', '<=', filters.endDate));
      }

      // Add ordering
      constraints.push(orderBy('generatedAt', 'desc'));
      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }

      q = query(q, ...constraints);
      const querySnapshot = await getDocs(q);
      const reports = [];

      querySnapshot.forEach((doc) => {
        reports.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return reports;

    } catch (error) {
      console.error('❌ Error fetching synthetic reports:', error);
      throw new Error(`Failed to fetch synthetic reports: ${error.message}`);
    }
  }

  /**
   * Get synthetic report statistics
   */
  async getSyntheticReportStats(timeRange = '24h') {
    try {
      const now = new Date();
      const startDate = new Date();

      switch (timeRange) {
        case '1h':
          startDate.setHours(now.getHours() - 1);
          break;
        case '24h':
          startDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        default:
          startDate.setDate(now.getDate() - 1);
      }

      const q = query(
        collection(db, this.collectionName),
        where('generatedAt', '>=', startDate.toISOString()),
        orderBy('generatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reports = [];
      querySnapshot.forEach(doc => reports.push(doc.data()));

      // Calculate statistics
      const stats = {
        total: reports.length,
        byHazardType: {},
        bySeverity: {},
        byPlatform: {},
        bySentiment: {},
        timeRange,
        generatedAt: new Date().toISOString()
      };

      reports.forEach(report => {
        // Count by hazard type
        const hazardType = report.hazardType || 'unknown';
        stats.byHazardType[hazardType] = (stats.byHazardType[hazardType] || 0) + 1;

        // Count by severity
        const severity = report.severity || 'unknown';
        stats.bySeverity[severity] = (stats.bySeverity[severity] || 0) + 1;

        // Count by platform
        const platform = report.platform || 'unknown';
        stats.byPlatform[platform] = (stats.byPlatform[platform] || 0) + 1;

        // Count by sentiment
        const sentiment = report.sentiment?.label || 'unknown';
        stats.bySentiment[sentiment] = (stats.bySentiment[sentiment] || 0) + 1;
      });

      return stats;

    } catch (error) {
      console.error('❌ Error fetching synthetic report stats:', error);
      throw new Error(`Failed to fetch synthetic report stats: ${error.message}`);
    }
  }

  /**
   * Delete synthetic report
   */
  async deleteSyntheticReport(reportId) {
    try {
      // Delete from both collections
      await deleteDoc(doc(db, this.collectionName, reportId));
      await deleteDoc(doc(db, this.socialMediaCollection, reportId));

      console.log(`✅ Synthetic report deleted: ${reportId}`);
      return true;

    } catch (error) {
      console.error('❌ Error deleting synthetic report:', error);
      throw new Error(`Failed to delete synthetic report: ${error.message}`);
    }
  }

  /**
   * Clean up old synthetic reports
   */
  async cleanupOldReports(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const q = query(
        collection(db, this.collectionName),
        where('generatedAt', '<', cutoffDate.toISOString())
      );

      const querySnapshot = await getDocs(q);
      const reportsToDelete = [];

      querySnapshot.forEach(doc => {
        reportsToDelete.push({
          id: doc.id,
          data: doc.data()
        });
      });

      console.log(`🧹 Found ${reportsToDelete.length} old synthetic reports to clean up`);

      for (const report of reportsToDelete) {
        await this.deleteSyntheticReport(report.id);
      }

      return {
        deleted: reportsToDelete.length,
        cutoffDate: cutoffDate.toISOString()
      };

    } catch (error) {
      console.error('❌ Error cleaning up old reports:', error);
      throw new Error(`Failed to cleanup old reports: ${error.message}`);
    }
  }

  /**
   * Subscribe to real-time synthetic report updates
   */
  subscribeToSyntheticReports(callback, filters = {}) {
    try {
      let q = collection(db, this.collectionName);
      const constraints = [];

      // Apply filters
      if (filters.hazardType) {
        constraints.push(where('hazardType', '==', filters.hazardType));
      }

      if (filters.severity) {
        constraints.push(where('severity', '==', filters.severity));
      }

      constraints.push(orderBy('generatedAt', 'desc'));
      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }

      q = query(q, ...constraints);

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const reports = [];
        querySnapshot.forEach((doc) => {
          reports.push({
            id: doc.id,
            ...doc.data()
          });
        });

        callback(reports);
      }, (error) => {
        console.error('❌ Error in synthetic reports subscription:', error);
      });

      // Store unsubscribe function
      const subscriptionId = `synthetic_reports_${Date.now()}`;
      this.listeners.set(subscriptionId, unsubscribe);

      return subscriptionId;

    } catch (error) {
      console.error('❌ Error subscribing to synthetic reports:', error);
      throw new Error(`Failed to subscribe to synthetic reports: ${error.message}`);
    }
  }

  /**
   * Unsubscribe from synthetic reports
   */
  unsubscribeFromSyntheticReports(subscriptionId) {
    try {
      const unsubscribe = this.listeners.get(subscriptionId);
      if (unsubscribe) {
        unsubscribe();
        this.listeners.delete(subscriptionId);
        console.log(`✅ Unsubscribed from synthetic reports: ${subscriptionId}`);
        return true;
      }
      return false;

    } catch (error) {
      console.error('❌ Error unsubscribing from synthetic reports:', error);
      throw new Error(`Failed to unsubscribe from synthetic reports: ${error.message}`);
    }
  }

  /**
   * Get database connection status
   */
  async getConnectionStatus() {
    try {
      // Try to access the collection
      const q = query(collection(db, this.collectionName), limit(1));
      await getDocs(q);

      return {
        connected: true,
        collection: this.collectionName,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create singleton instance
export const syntheticReportDbService = new SyntheticReportDatabaseService();
