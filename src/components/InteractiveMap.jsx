import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';

// Fix for default markers in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
});

// Custom icons for different hazard types
const createCustomIcon = (color, type) => {
  const iconHtml = `
    <div class="custom-marker" style="background-color: ${color};">
      <div class="marker-content">${getHazardIcon(type)}</div>
    </div>
  `;
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.7 0 0 6.7 0 15c0 15 15 25 15 25s15-10 15-25C30 6.7 23.3 0 15 0z" fill="${color}"/>
        <circle cx="15" cy="15" r="8" fill="white"/>
        <text x="15" y="19" text-anchor="middle" font-size="10" fill="${color}">${getHazardIcon(type)}</text>
      </svg>
    `)}`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40]
  });
};

const getHazardIcon = (type) => {
  const icons = {
    tsunami: '🌊',
    cyclone: '🌀',
    storm: '⛈️',
    flood: '🌊',
    high_waves: '🌊',
    strong_currents: '🌊',
    coastal_erosion: '🏖️',
    default: '⚠️'
  };
  return icons[type] || icons.default;
};

const getHazardColor = (severity) => {
  const colors = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#d97706',
    low: '#16a34a',
    default: '#6b7280'
  };
  return colors[severity] || colors.default;
};

// Component to update map view
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  
  return null;
};

const InteractiveMap = ({ 
  reports = [], 
  alerts = [], 
  onReportClick,
  onMapClick,
  showHeatmap = true,
  center = [13.0827, 80.2707], // Chennai coordinates
  zoom = 8,
  height = '500px'
}) => {
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [selectedLayers, setSelectedLayers] = useState({
    reports: true,
    alerts: true,
    heatmap: showHeatmap
  });

  // Sample hazard data if no reports provided
  const sampleReports = reports.length > 0 ? reports : [
    {
      id: 1,
      type: 'cyclone',
      severity: 'high',
      title: 'Cyclone Warning - Bay of Bengal',
      coordinates: { lat: 13.0827, lng: 80.2707 },
      timestamp: new Date().toISOString(),
      status: 'active'
    },
    {
      id: 2,
      type: 'high_waves',
      severity: 'medium',
      title: 'High Waves - Marina Beach',
      coordinates: { lat: 13.0499, lng: 80.2824 },
      timestamp: new Date().toISOString(),
      status: 'verified'
    },
    {
      id: 3,
      type: 'strong_currents',
      severity: 'high',
      title: 'Strong Currents - Visakhapatnam',
      coordinates: { lat: 17.6868, lng: 83.2185 },
      timestamp: new Date().toISOString(),
      status: 'active'
    },
    {
      id: 4,
      type: 'tsunami',
      severity: 'critical',
      title: 'Tsunami Alert - Kochi',
      coordinates: { lat: 9.9312, lng: 76.2673 },
      timestamp: new Date().toISOString(),
      status: 'critical'
    }
  ];

  const sampleAlerts = alerts.length > 0 ? alerts : [
    {
      id: 1,
      type: 'evacuation',
      coordinates: { lat: 13.0827, lng: 80.2707 },
      radius: 10000, // 10km
      message: 'Evacuation zone - Cyclone approach',
      severity: 'critical'
    },
    {
      id: 2,
      type: 'warning',
      coordinates: { lat: 17.6868, lng: 83.2185 },
      radius: 5000, // 5km
      message: 'High wave warning zone',
      severity: 'medium'
    }
  ];

  const handleLayerToggle = (layer) => {
    setSelectedLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const handleLocationSearch = (location) => {
    // Simple location search - in a real app, use geocoding service
    const locations = {
      'chennai': [13.0827, 80.2707],
      'mumbai': [19.0760, 72.8777],
      'kochi': [9.9312, 76.2673],
      'visakhapatnam': [17.6868, 83.2185],
      'goa': [15.2993, 74.1240]
    };
    
    const coords = locations[location.toLowerCase()];
    if (coords) {
      setMapCenter(coords);
      setMapZoom(10);
    }
  };

  return (
    <div className="interactive-map-container">
      {/* Map Controls */}
      <div className="map-controls">
        <div className="layer-controls">
          <h4>Map Layers</h4>
          <label>
            <input
              type="checkbox"
              checked={selectedLayers.reports}
              onChange={() => handleLayerToggle('reports')}
            />
            Hazard Reports
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedLayers.alerts}
              onChange={() => handleLayerToggle('alerts')}
            />
            Alert Zones
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedLayers.heatmap}
              onChange={() => handleLayerToggle('heatmap')}
            />
            Density Heatmap
          </label>
        </div>
        
        <div className="location-search">
          <select 
            onChange={(e) => handleLocationSearch(e.target.value)}
            defaultValue=""
          >
            <option value="">Quick Jump To...</option>
            <option value="chennai">Chennai</option>
            <option value="mumbai">Mumbai</option>
            <option value="kochi">Kochi</option>
            <option value="visakhapatnam">Visakhapatnam</option>
            <option value="goa">Goa</option>
          </select>
        </div>
      </div>

      {/* Map Legend */}
      <div className="map-legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-marker critical"></div>
            <span>Critical Hazard</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker high"></div>
            <span>High Risk</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker medium"></div>
            <span>Medium Risk</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker low"></div>
            <span>Low Risk</span>
          </div>
        </div>
      </div>

      {/* Main Map */}
      <div className="map-wrapper" style={{ height }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ width: '100%', height: '100%' }}
          onClick={onMapClick}
        >
          <MapUpdater center={mapCenter} zoom={mapZoom} />
          
          {/* Base tile layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Hazard Reports */}
          {selectedLayers.reports && sampleReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.coordinates.lat, report.coordinates.lng]}
              icon={createCustomIcon(getHazardColor(report.severity), report.type)}
              eventHandlers={{
                click: () => onReportClick && onReportClick(report)
              }}
            >
              <Popup>
                <div className="map-popup">
                  <h4>{report.title}</h4>
                  <p><strong>Type:</strong> {report.type.replace('_', ' ')}</p>
                  <p><strong>Severity:</strong> {report.severity}</p>
                  <p><strong>Status:</strong> {report.status}</p>
                  <p><strong>Time:</strong> {new Date(report.timestamp).toLocaleString()}</p>
                  {report.description && (
                    <p><strong>Details:</strong> {report.description}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Alert Zones */}
          {selectedLayers.alerts && sampleAlerts.map((alert) => (
            <Circle
              key={alert.id}
              center={[alert.coordinates.lat, alert.coordinates.lng]}
              radius={alert.radius}
              fillColor={getHazardColor(alert.severity)}
              fillOpacity={0.3}
              color={getHazardColor(alert.severity)}
              weight={2}
            >
              <Popup>
                <div className="map-popup">
                  <h4>Alert Zone</h4>
                  <p><strong>Type:</strong> {alert.type}</p>
                  <p><strong>Message:</strong> {alert.message}</p>
                  <p><strong>Radius:</strong> {(alert.radius / 1000).toFixed(1)} km</p>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>

      {/* Map Statistics */}
      <div className="map-stats">
        <div className="stat-item">
          <span className="stat-value">{sampleReports.length}</span>
          <span className="stat-label">Active Reports</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{sampleAlerts.length}</span>
          <span className="stat-label">Alert Zones</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {sampleReports.filter(r => r.severity === 'critical' || r.severity === 'high').length}
          </span>
          <span className="stat-label">High Priority</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;