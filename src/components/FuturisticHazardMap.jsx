import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { sampleHazardReports, generateHotspots, getReportStatistics } from '../data/sampleHazardReports';
import { Activity, Layers, MapPin, Search, Filter, AlertTriangle, TrendingUp } from 'lucide-react';

// Fix for default markers in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
});

// Enhanced custom icons with futuristic design
const createFuturisticIcon = (severity, type) => {
  const colors = {
    critical: '#ef4444',
    high: '#f97316', 
    medium: '#eab308',
    low: '#22c55e',
    default: '#64748b'
  };
  
  const typeIcons = {
    cyclone: '🌀',
    flood: '🌊',
    tsunami: '🌊',
    tidal_surge: '🌊',
    rough_sea: '〰️',
    pollution: '🛢️',
    erosion: '🏔️',
    landslide: '⛰️',
    default: '⚠️'
  };

  const color = colors[severity] || colors.default;
  const icon = typeIcons[type] || typeIcons.default;
  
  const svgContent = `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.7" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#grad)" filter="url(#glow)" stroke="white" stroke-width="2"/>
      <circle cx="24" cy="24" r="14" fill="rgba(255,255,255,0.2)" stroke="${color}" stroke-width="1"/>
      <text x="24" y="30" text-anchor="middle" font-size="16" fill="white">${icon}</text>
    </svg>
  `.trim();
  
  const encodedSvg = window.btoa(unescape(encodeURIComponent(svgContent)));
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48]
  });
};

// Component to update map view with smooth animations
const AnimatedMapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map]);
  
  return null;
};

const FuturisticHazardMap = ({ 
  onReportClick, 
  height = '600px',
  showControls = true 
}) => {
  const [reports, setReports] = useState(sampleHazardReports);
  const [hotspots, setHotspots] = useState(generateHotspots(sampleHazardReports));
  const [statistics, setStatistics] = useState(getReportStatistics(sampleHazardReports));
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
  const [isRealTimeMode, setIsRealTimeMode] = useState(true);
  const updateIntervalRef = useRef();

  // Real-time updates simulation
  useEffect(() => {
    if (isRealTimeMode) {
      updateIntervalRef.current = setInterval(() => {
        // Simulate real-time updates by slightly modifying existing data
        setReports(prev => {
          const updated = [...prev];
          // Add small variations to simulate real-time changes
          const randomIndex = Math.floor(Math.random() * updated.length);
          if (updated[randomIndex]) {
            updated[randomIndex] = {
              ...updated[randomIndex],
              lastUpdated: new Date().toISOString()
            };
          }
          return updated;
        });
        setStatistics(getReportStatistics(reports));
      }, 30000); // Update every 30 seconds
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isRealTimeMode, reports]);

  // Filter reports based on current filters
  const filteredReports = reports.filter(report => {
    if (filters.severity !== 'all' && report.severity !== filters.severity) return false;
    if (filters.type !== 'all' && report.type !== filters.type) return false;
    if (filters.status !== 'all' && report.status !== filters.status) return false;
    if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !report.location.state.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setMapCenter([report.location.latitude, report.location.longitude]);
    setMapZoom(12);
    if (onReportClick) onReportClick(report);
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
    <div className="relative w-full h-full">
      {/* Futuristic Header */}
      {showControls && (
        <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none">
          <div className="glass-card p-4 pointer-events-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Live Hazard Monitor</h3>
                  <p className="text-sm text-slate-400">Real-time ocean hazard tracking</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsRealTimeMode(!isRealTimeMode)}
                  className={`btn-glass px-3 py-2 flex items-center space-x-2 ${
                    isRealTimeMode ? 'border-green-500 bg-green-500/10' : 'border-gray-500'
                  }`}
                >
                  <Activity className={`w-4 h-4 ${isRealTimeMode ? 'text-green-400' : 'text-gray-400'}`} />
                  <span className="text-sm">{isRealTimeMode ? 'Live' : 'Static'}</span>
                </button>
              </div>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{statistics.critical}</div>
                <div className="text-xs text-slate-400">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{statistics.active}</div>
                <div className="text-xs text-slate-400">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{statistics.total}</div>
                <div className="text-xs text-slate-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{hotspots.length}</div>
                <div className="text-xs text-slate-400">Hotspots</div>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 pr-4 py-2 text-sm"
                />
              </div>

              {/* Quick Location Buttons */}
              <div className="flex flex-wrap gap-1">
                {quickLocations.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setMapCenter(location.coords);
                      setMapZoom(location.zoom);
                    }}
                    className="btn-glass px-3 py-1 text-xs hover:border-cyan-500"
                  >
                    {location.name}
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                  className="input text-xs px-2 py-1"
                >
                  <option value="all">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="input text-xs px-2 py-1"
                >
                  <option value="all">All Types</option>
                  <option value="cyclone">Cyclone</option>
                  <option value="flood">Flood</option>
                  <option value="tsunami">Tsunami</option>
                  <option value="pollution">Pollution</option>
                  <option value="erosion">Erosion</option>
                </select>
              </div>

              {/* Layer Toggles */}
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={filters.showReports}
                    onChange={(e) => setFilters(prev => ({ ...prev, showReports: e.target.checked }))}
                    className="w-3 h-3"
                  />
                  <span className="text-xs text-slate-300">Reports</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={filters.showHotspots}
                    onChange={(e) => setFilters(prev => ({ ...prev, showHotspots: e.target.checked }))}
                    className="w-3 h-3"
                  />
                  <span className="text-xs text-slate-300">Hotspots</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="w-full" style={{ height }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ width: '100%', height: '100%' }}
          className="rounded-lg border border-white/10"
        >
          <AnimatedMapUpdater center={mapCenter} zoom={mapZoom} />
          
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Hazard Reports */}
          {filters.showReports && filteredReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.location.latitude, report.location.longitude]}
              icon={createFuturisticIcon(report.severity, report.type)}
              eventHandlers={{
                click: () => handleReportClick(report)
              }}
            >
              <Popup className="futuristic-popup">
                <div className="bg-slate-900 p-4 rounded-lg border border-cyan-500/30 min-w-[280px]">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">{report.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      report.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      report.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      report.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {report.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="text-cyan-400">{report.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-white">{report.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="text-white">{report.location.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reported:</span>
                      <span className="text-white">{new Date(report.reportedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {report.description && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-slate-300 text-sm">{report.description}</p>
                    </div>
                  )}
                  
                  {report.affectedArea && (
                    <div className="mt-2 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">Affected Area: {report.affectedArea}</span>
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
                hotspot.intensity === 'high' ? '#ef4444' :
                hotspot.intensity === 'medium' ? '#f97316' : '#22c55e'
              }
              fillOpacity={0.2}
              color={
                hotspot.intensity === 'high' ? '#ef4444' :
                hotspot.intensity === 'medium' ? '#f97316' : '#22c55e'
              }
              weight={2}
              dashArray="5, 5"
            >
              <Popup>
                <div className="bg-slate-900 p-3 rounded-lg border border-cyan-500/30">
                  <h4 className="text-lg font-semibold text-white mb-2">Hazard Hotspot</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Intensity:</span>
                      <span className={`font-medium ${
                        hotspot.intensity === 'high' ? 'text-red-400' :
                        hotspot.intensity === 'medium' ? 'text-orange-400' : 'text-green-400'
                      }`}>
                        {hotspot.intensity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reports:</span>
                      <span className="text-white">{hotspot.reportCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Types:</span>
                      <span className="text-cyan-400">{hotspot.dominantTypes.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>

      {/* Selected Report Details Panel */}
      {selectedReport && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <div className="glass-card p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{selectedReport.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Severity: </span>
                    <span className={`font-medium ${
                      selectedReport.severity === 'critical' ? 'text-red-400' :
                      selectedReport.severity === 'high' ? 'text-orange-400' :
                      selectedReport.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {selectedReport.severity}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Type: </span>
                    <span className="text-cyan-400">{selectedReport.type.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Status: </span>
                    <span className="text-white">{selectedReport.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Population: </span>
                    <span className="text-white">{selectedReport.estimatedAffectedPopulation?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="btn-glass px-3 py-1 ml-4"
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

export default FuturisticHazardMap;