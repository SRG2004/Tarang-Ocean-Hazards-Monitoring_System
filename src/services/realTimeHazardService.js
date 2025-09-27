// Real-time hazard report service with WebSocket and polling fallback
import { sampleHazardReports, generateHotspots } from '../data/sampleHazardReports.js';

class RealTimeHazardService {
  reports = [...sampleHazardReports];
  hotspots = [];
  listeners = new Set();
  updateInterval = null;
  lastUpdateTime = new Date();

  constructor() {
    this.hotspots = generateHotspots(this.reports);
    // Lazy-start updates only when first subscriber joins
  }

  // Subscribe to real-time updates
  subscribe(listener) {
    this.listeners.add(listener);
    
    // Start updates if this is the first subscriber
    if (this.listeners.size === 1) {
      this.startRealTimeUpdates();
    }
    
    // Immediately send current data
    listener(this.reports, this.hotspots);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
      
      // Stop updates if no subscribers remain
      if (this.listeners.size === 0) {
        this.stopRealTimeUpdates();
      }
    };
  }

  // Get current reports and hotspots
  getCurrentData() {
    return {
      reports: [...this.reports],
      hotspots: [...this.hotspots]
    };
  }

  // Start real-time updates (simulated with periodic updates)
  startRealTimeUpdates() {
    if (this.updateInterval) return; // Already running
    
    // Update every 30 seconds to simulate real-time data
    this.updateInterval = setInterval(() => {
      this.simulateDataUpdate();
    }, 30000);
  }

  // Stop real-time updates
  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Simulate real-time data updates
  simulateDataUpdate() {
    const now = new Date();
    
    // Randomly update existing reports (simulate status changes, new verifications, etc.)
    const updatedReports = this.reports.map(report => {
      if (Math.random() < 0.1) { // 10% chance of update per cycle
        const updates = { lastUpdated: now.toISOString() };
        
        // Simulate status changes
        if (report.status === 'active' && Math.random() < 0.3) {
          updates.status = 'investigating';
        } else if (report.status === 'investigating' && Math.random() < 0.2) {
          updates.status = 'resolved';
        }
        
        // Simulate verification of unverified reports
        if (!report.verifiedAt && Math.random() < 0.4) {
          updates.verifiedAt = now.toISOString();
          updates.verifiedBy = 'system@oceanhazard.com';
        }
        
        return { ...report, ...updates };
      }
      return report;
    });

    // Occasionally add new reports (simulate incoming reports)
    if (Math.random() < 0.2) { // 20% chance of new report
      const newReport = this.generateNewReport();
      updatedReports.push(newReport);
    }

    // Update internal state
    this.reports = updatedReports;
    this.hotspots = generateHotspots(this.reports);
    this.lastUpdateTime = now;

    // Notify all listeners
    this.notifyListeners();
  }

  // Generate a new simulated report
  generateNewReport() {
    const locations = [
      { lat: 19.0760, lng: 72.8777, state: 'Maharashtra', district: 'Mumbai' },
      { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', district: 'Chennai' },
      { lat: 9.9312, lng: 76.2673, state: 'Kerala', district: 'Ernakulam' },
      { lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh', district: 'Visakhapatnam' },
      { lat: 15.2993, lng: 74.1240, state: 'Goa', district: 'North Goa' }
    ];

    const types = ['flood', 'cyclone', 'tidal_surge', 'rough_sea', 'pollution', 'erosion'];
    const severities = ['low', 'medium', 'high', 'critical'];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];

    return {
      id: `hr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${severity.charAt(0).toUpperCase() + severity.slice(1)} ${type} Alert - ${location.district}`,
      type,
      severity,
      status: 'active',
      location: {
        latitude: location.lat + (Math.random() - 0.5) * 0.1, // Add some randomness
        longitude: location.lng + (Math.random() - 0.5) * 0.1,
        address: `Near ${location.district}, ${location.state}`,
        district: location.district,
        state: location.state
      },
      description: `Newly reported ${type} incident requiring immediate attention.`,
      reportedBy: {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Citizen Reporter',
        type: 'citizen'
      },
      reportedAt: new Date().toISOString(),
      tags: [severity, type, 'real_time']
    };
  }

  // Notify all listeners of updates
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.reports, this.hotspots);
      } catch (error) {
        console.error('Error notifying hazard report listener:', error);
      }
    });
  }

  // Get statistics for dashboard
  getStatistics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: this.reports.length,
      active: this.reports.filter(r => r.status === 'active').length,
      critical: this.reports.filter(r => r.severity === 'critical').length,
      today: this.reports.filter(r => new Date(r.reportedAt) >= today).length,
      thisWeek: this.reports.filter(r => new Date(r.reportedAt) >= thisWeek).length,
      lastUpdate: this.lastUpdateTime.toISOString(),
      byType: this.reports.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
      }, {}),
      bySeverity: this.reports.reduce((acc, r) => {
        acc[r.severity] = (acc[r.severity] || 0) + 1;
        return acc;
      }, {}),
      byState: this.reports.reduce((acc, r) => {
        acc[r.location.state] = (acc[r.location.state] || 0) + 1;
        return acc;
      }, {})
    };
  }

  // Cleanup
  destroy() {
    this.stopRealTimeUpdates();
    this.listeners.clear();
  }
}

// Export singleton instance
export const realTimeHazardService = new RealTimeHazardService();


// Geocoding service for location search
export class LocationSearchService {
  static NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

  static async searchLocation(query) {
    if (!query.trim()) return [];

    try {
      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(query)}&format=json&countrycodes=in&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Taranga Ocean Monitor (oceanmonitor@example.com)'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const results = await response.json();
      return results.map((result) => ({
        display_name: result.display_name,
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        boundingbox: result.boundingbox
      }));
    } catch (error) {
      console.error('Location search failed:', error);
      return [];
    }
  }
}
