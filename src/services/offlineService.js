/**
 * Offline Service
 * Handles offline data collection and synchronization for remote coastal areas
 */

class OfflineService {
  constructor() {
    this.dbName = 'TaragaOfflineDB';
    this.dbVersion = 1;
    this.storeName = 'offlineReports';
    this.syncStoreName = 'syncQueue';
    this.db = null;
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;

    // Initialize offline database
    this.initDB();
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Initialize IndexedDB for offline storage
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object store for offline reports
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('hazardType', 'hazardType', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
        }

        // Create object store for sync queue
        if (!db.objectStoreNames.contains(this.syncStoreName)) {
          const syncStore = db.createObjectStore(this.syncStoreName, {
            keyPath: 'id',
            autoIncrement: true
          });
          syncStore.createIndex('action', 'action', { unique: false });
          syncStore.createIndex('priority', 'priority', { unique: false });
        }
      };
    });
  }

  // Store hazard report offline
  async storeOfflineReport(reportData) {
    if (!this.db) await this.initDB();

    const report = {
      ...reportData,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      synced: false,
      offlineCreated: true,
      location: reportData.location || await this.getCurrentLocation()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(report);

      request.onsuccess = () => {
        console.log('Report stored offline:', request.result);
        this.addToSyncQueue('create_report', report, 'high');
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Get all offline reports
  async getOfflineReports(filters = {}) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        let reports = request.result || [];
        
        // Apply filters
        if (filters.hazardType) {
          reports = reports.filter(r => r.hazardType === filters.hazardType);
        }
        if (filters.synced !== undefined) {
          reports = reports.filter(r => r.synced === filters.synced);
        }
        if (filters.dateRange) {
          const { start, end } = filters.dateRange;
          reports = reports.filter(r => {
            const reportDate = new Date(r.timestamp);
            return reportDate >= start && reportDate <= end;
          });
        }

        resolve(reports);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Add item to sync queue
  async addToSyncQueue(action, data, priority = 'medium') {
    if (!this.db) await this.initDB();

    const queueItem = {
      action,
      data,
      priority,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 3
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.syncStoreName], 'readwrite');
      const store = transaction.objectStore(this.syncStoreName);
      const request = store.add(queueItem);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Sync offline data when online
  async syncOfflineData() {
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;
    console.log('Starting offline data synchronization...');

    try {
      // Get all unsynced reports
      const unsyncedReports = await this.getOfflineReports({ synced: false });
      
      // Get sync queue items
      const syncQueue = await this.getSyncQueue();

      // Sync reports first
      for (const report of unsyncedReports) {
        try {
          await this.syncReport(report);
        } catch (error) {
          console.error('Failed to sync report:', report.id, error);
        }
      }

      // Process sync queue
      for (const item of syncQueue) {
        try {
          await this.processSyncItem(item);
        } catch (error) {
          console.error('Failed to process sync item:', item.id, error);
          await this.updateSyncItemRetry(item);
        }
      }

      console.log('Offline data synchronization completed');
    } catch (error) {
      console.error('Sync process failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync individual report
  async syncReport(report) {
    // Import the hazard report service dynamically to avoid circular dependency
    const { hazardReportService } = await import('./hazardReportService.js');
    
    try {
      // Remove offline-specific fields before syncing
      const cleanReport = { ...report };
      delete cleanReport.id;
      delete cleanReport.synced;
      delete cleanReport.offlineCreated;

      // Submit to server
      const result = await hazardReportService.submitReport(cleanReport);
      
      // Mark as synced
      await this.markReportSynced(report.id, result.id);
      
      console.log('Report synced successfully:', report.id, '→', result.id);
      return result;
    } catch (error) {
      console.error('Failed to sync report:', error);
      throw error;
    }
  }

  // Mark report as synced
  async markReportSynced(offlineId, serverId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(offlineId);

      request.onsuccess = () => {
        const report = request.result;
        if (report) {
          report.synced = true;
          report.serverId = serverId;
          report.syncedAt = new Date().toISOString();
          
          const updateRequest = store.put(report);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Report not found'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Get sync queue items
  async getSyncQueue() {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.syncStoreName], 'readonly');
      const store = transaction.objectStore(this.syncStoreName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Process individual sync item
  async processSyncItem(item) {
    switch (item.action) {
      case 'create_report':
        await this.syncReport(item.data);
        break;
      case 'upload_media':
        await this.syncMedia(item.data);
        break;
      case 'update_profile':
        await this.syncProfile(item.data);
        break;
      default:
        console.warn('Unknown sync action:', item.action);
    }

    // Remove from sync queue after successful processing
    await this.removeSyncItem(item.id);
  }

  // Remove item from sync queue
  async removeSyncItem(itemId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.syncStoreName], 'readwrite');
      const store = transaction.objectStore(this.syncStoreName);
      const request = store.delete(itemId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Update retry count for sync item
  async updateSyncItemRetry(item) {
    item.retryCount++;
    item.lastRetry = new Date().toISOString();

    if (item.retryCount >= item.maxRetries) {
      console.error('Max retries reached for sync item:', item.id);
      // Could move to failed queue or notify user
      await this.removeSyncItem(item.id);
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.syncStoreName], 'readwrite');
      const store = transaction.objectStore(this.syncStoreName);
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get current location (with fallback for offline)
  async getCurrentLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: null, longitude: null, accuracy: null });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          resolve({ latitude: null, longitude: null, accuracy: null });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Cache essential data for offline use
  async cacheEssentialData() {
    const essentialData = {
      hazardTypes: [],
      severityLevels: [],
      coastalRegions: [],
      emergencyContacts: []
    };

    try {
      // Import services dynamically
      const { hazardReportService } = await import('./hazardReportService.js');
      const { incoisIntegrationService } = await import('./incoisIntegrationService.js');

      essentialData.hazardTypes = hazardReportService.getHazardTypes();
      essentialData.severityLevels = hazardReportService.getSeverityLevels();
      essentialData.alertLevels = incoisIntegrationService.getAlertLevels();

      // Store in localStorage for quick access
      localStorage.setItem('taragaEssentialData', JSON.stringify(essentialData));
      
      console.log('Essential data cached for offline use');
    } catch (error) {
      console.error('Failed to cache essential data:', error);
    }
  }

  // Get cached essential data
  getCachedEssentialData() {
    try {
      const cached = localStorage.getItem('taragaEssentialData');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Failed to retrieve cached data:', error);
      return null;
    }
  }

  // Check connectivity status
  isConnected() {
    return this.isOnline;
  }

  // Get offline statistics
  async getOfflineStats() {
    const reports = await this.getOfflineReports();
    const syncQueue = await this.getSyncQueue();

    return {
      totalOfflineReports: reports.length,
      unsyncedReports: reports.filter(r => !r.synced).length,
      syncedReports: reports.filter(r => r.synced).length,
      pendingSyncItems: syncQueue.length,
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress
    };
  }

  // Clear synced offline data (cleanup)
  async clearSyncedData(olderThanDays = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const syncedReports = await this.getOfflineReports({ synced: true });
    
    for (const report of syncedReports) {
      if (new Date(report.syncedAt) < cutoffDate) {
        await this.deleteOfflineReport(report.id);
      }
    }
  }

  // Delete offline report
  async deleteOfflineReport(reportId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(reportId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Create and export singleton instance
export const offlineService = new OfflineService();