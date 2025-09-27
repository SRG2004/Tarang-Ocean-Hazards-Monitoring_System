import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { realTimeHazardService, LocationSearchService } from '../services/realTimeHazardService';
import { MapErrorBoundary } from './MapErrorBoundary';
import { MapPin, Search, Filter, AlertTriangle, Activity } from 'lucide-react';

// Fix for default markers in react-leaflet
try {
  // @ts-ignore - Known fix for leaflet default markers  
  delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
  });
} catch (error) {
  console.warn('Leaflet icon fix failed:', error);
}

// Simple custom icons
const createSimpleIcon = (severity) => {
  const colors = {
    critical: '#dc2626',
    high: '#ea580c', 
    medium: '#d97706',
    low: '#16a34a',
    default: '#6b7280'
  };
  
  const color = colors[severity] || colors.default;
  
  const svgContent = `
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-size="12" fill="white">!</text>
    </svg>
  `.trim();
  
  const encodedSvg = window.btoa(unescape(encodeURIComponent(svgContent)));
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

// Component to update map view
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

const MinimalHazardMap = ({ 
  onReportClick, 
  height = '500px',
  showControls = true 
}) => {
  const [reports, setReports] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    status: 'all',
    showHotspots: true,
    showReports: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = realTimeHazardService.subscribe((newReports, newHotspots) => {
      setReports(newReports);
      setHotspots(newHotspots);
      setStatistics(realTimeHazardService.getStatistics());
      setLastUpdate(new Date().toLocaleTimeString());
    });

    return unsubscribe;
  }, []);

  // Handle location search
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await LocationSearchService.searchLocation(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  // Filter reports based on current filters
  const filteredReports = reports.filter(report => {
    if (filters.severity !== 'all' && report.severity !== filters.severity) return false;
    if (filters.type !== 'all' && report.type !== filters.type) return false;
    if (filters.status !== 'all' && report.status !== filters.status) return false;
    return true;
  });

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setMapCenter([report.location.latitude, report.location.longitude]);
    setMapZoom(12);
    if (onReportClick) onReportClick(report);
  };

  const handleSearchResultClick = (result) => {
    setMapCenter([result.lat, result.lon]);
    setMapZoom(12);
    setSearchQuery('');
    setSearchResults([]);
  };

  const quickLocations = [
    { name: 'All India', coords: [20.5937, 78.9629], zoom: 5 },
    { name: 'Mumbai', coords: [19.0760, 72.8777], zoom: 10 },
    { name: 'Chennai', coords: [13.0827, 80.2707], zoom: 10 },
    { name: 'Kochi', coords: [9.9312, 76.2673], zoom: 10 },
    { name: 'Visakhapatnam', coords: [17.6868, 83.2185], zoom: 10 },
    { name: 'Goa', coords: [15.2993, 74.1240], zoom: 10 }
  ];

  return (
    <div className="relative">
      {/* Header */}
      <div className="map-header-gradient map-fade-in flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">Hazard Map</span>
          {/* Live indicator */}
          <span className="map-pulse-animation ml-2 w-3 h-3 rounded-full bg-blue-400" aria-label="Live hazard updates" />
        </div>
        <span className="text-xs text-white/80" aria-live="polite">Last update: {lastUpdate}</span>
      </div>
      {/* Controls */}
      <div className="map-control-panel map-fade-in flex flex-col md:flex-row gap-2 mb-4">
        <input
          className="map-search-enhanced pl-10"
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search locations in India"
          aria-label="Search locations in India"
        />
        <div className="flex gap-2 map-mobile-controls" role="group" aria-label="Quick Locations">
          {quickLocations.map(loc => (
            <button
              key={loc.name}
              className="map-filter-button map-zoom-hover"
              aria-label={`Zoom to ${loc.name}`}
              onClick={() => setMapCenter(loc.coords)}
            >
              {loc.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2 map-mobile-controls" role="group" aria-label="Hazard Type Filters">
          {['cyclone','flood','tidal_surge','rough_sea','pollution','erosion'].map(type => (
            <button
              key={type}
              className={`map-filter-button ${filters.type === type ? "bg-blue-600 text-white" : ""}`}
              aria-pressed={filters.type === type}
              aria-label={type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              onClick={() => setFilters(prev => ({ ...prev, type }))}
            >
              {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="map-stats-card card-hover-lift smooth-hover" style={{ background: 'var(--gradient-map-stats-red)' }}>
          <div className="stat-number">{statistics.critical}</div>
          <div className="stat-label">Critical Alerts</div>
        </div>
        <div className="map-stats-card card-hover-lift smooth-hover" style={{ background: 'var(--gradient-map-stats-blue)' }}>
          <div className="stat-number">{statistics.active}</div>
          <div className="stat-label">Active Reports</div>
        </div>
        <div className="map-stats-card card-hover-lift smooth-hover" style={{ background: 'var(--gradient-map-stats-teal)' }}>
          <div className="stat-number">{statistics.total}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="map-stats-card card-hover-lift smooth-hover" style={{ background: 'var(--gradient-map-stats-purple)' }}>
          <div className="stat-number">{hotspots.length}</div>
          <div className="stat-label">Hotspots</div>
        </div>
      </div>
      {/* Map */}
      <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ border: "4px solid var(--gradient-map-header)" }}>
        <MapErrorBoundary>
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ width: '100%', height: '100%' }}
          >
          <MapUpdater center={mapCenter} zoom={mapZoom} />
          
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Hazard Reports */}
          {filters.showReports && filteredReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.location.latitude, report.location.longitude]}
              icon={createSimpleIcon(report.severity)}
              eventHandlers={{
                click: () => handleReportClick(report)
              }}
            >
              <Popup>
                <div className="min-w-[280px]">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-base font-semibold text-gray-900">{report.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="text-gray-900">{report.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="text-gray-900">{report.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="text-gray-900">{report.location.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reported:</span>
                      <span className="text-gray-900">{new Date(report.reportedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {report.description && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-gray-700 text-sm">{report.description}</p>
                    </div>
                  )}
                  
                  {report.affectedArea && (
                    <div className="mt-2 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700">Affected Area: {report.affectedArea}</span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Hotspots */}
          {filters.showHotspots && hotspots.map((hotspot) => (
            <Circle
              key={hotspot.id}
              center={hotspot.center}
              radius={hotspot.radius}
              fillColor={
                hotspot.intensity === 'high' ? '#dc2626' :
                hotspot.intensity === 'medium' ? '#ea580c' : '#16a34a'
              }
              fillOpacity={0.2}
              color={
                hotspot.intensity === 'high' ? '#dc2626' :
                hotspot.intensity === 'medium' ? '#ea580c' : '#16a34a'
              }
              weight={2}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h4 className="text-base font-semibold text-gray-900 mb-2">Hazard Hotspot</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Intensity:</span>
                      <span className={`font-medium ${
                        hotspot.intensity === 'high' ? 'text-red-600' :
                        hotspot.intensity === 'medium' ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {hotspot.intensity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reports:</span>
                      <span className="text-gray-900">{hotspot.reportCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Types:</span>
                      <span className="text-blue-600">{hotspot.dominantTypes.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}
          </MapContainer>
        </MapErrorBoundary>
      </div>

      {/* Selected Report Details Panel */}
      {selectedReport && (
        <div className="map-control-panel map-slide-in fixed right-0 top-0 w-full max-w-md z-20">
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedReport.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Severity: </span>
                    <span className={`font-medium ${
                      selectedReport.severity === 'critical' ? 'text-red-600' :
                      selectedReport.severity === 'high' ? 'text-orange-600' :
                      selectedReport.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {selectedReport.severity}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type: </span>
                    <span className="text-gray-900">{selectedReport.type.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status: </span>
                    <span className="text-gray-900">{selectedReport.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Population: </span>
                    <span className="text-gray-900">{selectedReport.estimatedAffectedPopulation?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="btn-secondary px-3 py-1 ml-4"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { MinimalHazardMap };
export default MinimalHazardMap;