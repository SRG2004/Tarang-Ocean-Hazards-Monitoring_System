import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { hazardReportService } from '../services/hazardReportService';
import { 
  MapPin,
  Filter,
  RefreshCw,
  AlertTriangle,
  Navigation,
  Layers 
} from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 19.0760, // Mumbai coordinates for Indian Ocean region
  lng: 72.8777
};

const HazardMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  })

  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    critical: 0
  });

  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    try {
      const fetchedReports = await hazardReportService.getReports({});
      setReports(fetchedReports);

      // Update stats
      setStats({
        total: fetchedReports.length,
        active: fetchedReports.filter(r => r.status === 'active').length,
        resolved: fetchedReports.filter(r => r.status === 'resolved').length,
        critical: fetchedReports.filter(r => r.severity === 'critical').length
      });

      // Set last update time
      const now = new Date();
      setLastUpdate(`${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };
  
  const filteredReports = reports.filter(report => {
    if (filterType === 'all') return true;
    return report.type === filterType;
  });

  const getMarkerIcon = (report) => {
    const severityColors = {
      low: '#22c55e',     // green
      medium: '#f59e0b',  // amber 
      high: '#ef4444',    // red
      critical: '#dc2626' // dark red
    };
    
    const color = severityColors[report.severity] || severityColors.medium;
    
    return {
      path: 'M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,7A2,2 0 0,1 14,9A2,2 0 0,1 12,11A2,2 0 0,1 10,9A2,2 0 0,1 12,7Z',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 1.5,
    };
  };

  if (!isLoaded) {
    return (
      <div className="card-feature animate-fade-in">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="loading mb-4" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative md:h-[600px] h-[420px] rounded-xl overflow-hidden shadow-lg">
      {/* Loading overlay */}
      {isLoading && (
        <div className="map-loading-overlay">
          <span className="loading-form mr-3" /> Loading Map...
        </div>
      )}
      {/* Header */}
      <div className="map-header-gradient map-fade-in flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-7 h-7 text-white" aria-label="Map" />
          <span className="font-bold text-lg">Hazard Map</span>
        </div>
        <span className="text-xs text-white/80" aria-live="polite">Last update: {lastUpdate}</span>
      </div>
      {/* Controls */}
      <div className="map-control-panel map-fade-in flex flex-col md:flex-row gap-2 mb-4">
        <button
          className="map-filter-button"
          aria-label="Refresh map"
          onClick={fetchReports}
        >
          {isRefreshing ? <span className="loading-form" /> : "Refresh"}
        </button>
        {/* ...other controls... */}
      </div>
      {/* Filters */}
      <div className="map-control-panel map-slide-in flex gap-2 mb-4" role="group" aria-label="Hazard Filters">
        {['all', 'tsunami', 'storm', 'high_tide', 'rip_current'].map(type => (
          <button
            key={type}
            className={`map-filter-button ${filterType === type ? "bg-blue-600 text-white" : ""}`}
            aria-pressed={filterType === type}
            aria-label={type}
            onClick={() => setFilterType(type)}
          >
            {type}
          </button>
        ))}
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="map-stats-card card-hover-lift smooth-hover" style={{ background: 'var(--gradient-map-stats-blue)' }}>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="map-stats-card card-hover-lift smooth-hover" style={{ background: 'var(--gradient-map-stats-red)' }}>
          <div className="stat-number">{stats.active}</div>
          <div className="stat-label">Active Hazards</div>
        </div>
        <div className="map-stats-card card-hover-lift smooth-hover" style={{ background: 'var(--gradient-map-stats-green)' }}>
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Resolved Cases</div>
        </div>
        <div className="map-stats-card card-hover-lift smooth-hover" style={{ background: 'var(--gradient-map-stats-orange)' }}>
          <div className="stat-number">{stats.critical}</div>
          <div className="stat-label">Critical Cases</div>
        </div>
      </div>
      {/* Google Map */}
      <div className="relative w-full h-full" style={{ minHeight: "320px" }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={8}
        >
          {filteredReports.map(report => (
            <Marker 
              key={report.id}
              position={{ lat: report.location.latitude, lng: report.location.longitude }}
              onClick={() => setSelectedReport(report)}
              icon={getMarkerIcon(report)}
            />
          ))}

          {selectedReport && (
            <InfoWindow
              position={{ lat: selectedReport.location.latitude, lng: selectedReport.location.longitude }}
              onCloseClick={() => setSelectedReport(null)}
            >
              <div className="p-3 max-w-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-bold text-gray-900 capitalize">
                    {selectedReport.type.replace('_', ' ')}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">Severity:</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium capitalize bg-red-100 text-red-800">
                      {selectedReport.severity}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      selectedReport.status === 'active' ? 'bg-red-100 text-red-800' :
                      selectedReport.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedReport.status}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-700">{selectedReport.description}</p>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  )
}

export default HazardMap;
