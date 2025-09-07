import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveMap from '../components/InteractiveMap';
import { useApp } from '../contexts/AppContext';
import './MapViewPage.css';

const MapViewPage = () => {
  const navigate = useNavigate();
  const { reports, loadReports, reportsLoading } = useApp();
  const [mapFilters, setMapFilters] = useState({
    severity: 'all',
    type: 'all',
    timeRange: '24h'
  });

  useEffect(() => {
    if (reports.length === 0) {
      loadReports();
    }
  }, []);

  const handleReportClick = (report) => {
    console.log('Report clicked:', report);
    // You could open a detailed view modal here
  };

  const handleMapClick = (event) => {
    console.log('Map clicked at:', event.latlng);
    // You could open a new report form here
  };

  const filteredReports = reports.filter(report => {
    if (mapFilters.severity !== 'all' && report.severity !== mapFilters.severity) {
      return false;
    }
    if (mapFilters.type !== 'all' && report.type !== mapFilters.type) {
      return false;
    }
    
    // Time range filter
    const now = new Date();
    const reportTime = new Date(report.timestamp);
    const timeDiff = now - reportTime;
    
    switch (mapFilters.timeRange) {
      case '1h':
        return timeDiff <= 3600000; // 1 hour
      case '24h':
        return timeDiff <= 86400000; // 24 hours
      case '7d':
        return timeDiff <= 604800000; // 7 days
      default:
        return true;
    }
  });

  return (
    <div className="map-view-page">
      {/* Header */}
      <header className="map-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="page-title">🗺️ Interactive Hazard Map</h1>
            <p className="page-subtitle">Real-time ocean hazard visualization and monitoring</p>
          </div>
          <div className="header-actions">
            <button 
              className="header-button"
              onClick={() => navigate('/')}
            >
              🏠 Home
            </button>
            <button 
              className="header-button"
              onClick={() => loadReports()}
              disabled={reportsLoading}
            >
              🔄 {reportsLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      {/* Map Filters */}
      <section className="map-filters">
        <div className="filters-container">
          <div className="filter-group">
            <label>Severity Level</label>
            <select 
              value={mapFilters.severity}
              onChange={(e) => setMapFilters({...mapFilters, severity: e.target.value})}
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Hazard Type</label>
            <select 
              value={mapFilters.type}
              onChange={(e) => setMapFilters({...mapFilters, type: e.target.value})}
            >
              <option value="all">All Types</option>
              <option value="tsunami">Tsunami</option>
              <option value="cyclone">Cyclone</option>
              <option value="high_waves">High Waves</option>
              <option value="storm">Storm</option>
              <option value="flood">Flood</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Time Range</label>
            <select 
              value={mapFilters.timeRange}
              onChange={(e) => setMapFilters({...mapFilters, timeRange: e.target.value})}
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div className="filter-stats">
            <span className="stats-label">Showing:</span>
            <span className="stats-value">{filteredReports.length} reports</span>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="map-section">
        <InteractiveMap
          reports={filteredReports}
          onReportClick={handleReportClick}
          onMapClick={handleMapClick}
          height="600px"
          showHeatmap={true}
        />
      </section>

      {/* Quick Stats */}
      <section className="quick-stats">
        <div className="stats-grid">
          <div className="stat-card critical">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <div className="stat-value">
                {filteredReports.filter(r => r.severity === 'critical').length}
              </div>
              <div className="stat-label">Critical Alerts</div>
            </div>
          </div>
          
          <div className="stat-card active">
            <div className="stat-icon">📍</div>
            <div className="stat-content">
              <div className="stat-value">{filteredReports.length}</div>
              <div className="stat-label">Active Reports</div>
            </div>
          </div>
          
          <div className="stat-card verified">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">
                {filteredReports.filter(r => r.status === 'verified').length}
              </div>
              <div className="stat-label">Verified Reports</div>
            </div>
          </div>
          
          <div className="stat-card coverage">
            <div className="stat-icon">🌊</div>
            <div className="stat-content">
              <div className="stat-value">
                {new Set(filteredReports.map(r => r.type)).size}
              </div>
              <div className="stat-label">Hazard Types</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MapViewPage;