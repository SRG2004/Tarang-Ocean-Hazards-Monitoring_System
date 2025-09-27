
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Fix for default markers in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
});

// Custom icons for different hazard types
const createCustomIcon = (color) => {
  const svgContent = `
    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 15 15 25 15 25s15-10 15-25C30 6.7 23.3 0 15 0z" fill="${color}"/>
      <circle cx="15" cy="15" r="8" fill="white"/>
      <text x="15" y="19" text-anchor="middle" font-size="10" fill="${color}">!</text>
    </svg>
  `.trim();
  
  const encodedSvg = window.btoa(unescape(encodeURIComponent(svgContent)));
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40]
  });
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
  onReportClick,
  onMapClick,
  showHeatmap = true,
  center = [20.5937, 78.9629], // India center
  zoom = 5,
  height = 'calc(100vh - 200px)',
  selectedLocation = null
}) => {
  const [hazardReports, setHazardReports] = useState([]);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [selectedLayers, setSelectedLayers] = useState({
    reports: true,
    heatmap: showHeatmap
  });

  useEffect(() => {
    const fetchHazardReports = async () => {
      const reportsCollection = collection(db, 'hazardReports');
      const reportsSnapshot = await getDocs(reportsCollection);
      const reportsList = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHazardReports(reportsList);
    };

    fetchHazardReports();
  }, []);

  // Generate hotspots from all reports, then filter verified ones.
  const allHotspots = generateHotspots(hazardReports);
  const verifiedReports = hazardReports.filter(report => report.verifiedAt);
  const verifiedHotspotIds = new Set(allHotspots.flatMap(h => h.reports));
  const verifiedHotspots = allHotspots.filter(h => h.reports.some(reportId => verifiedHotspotIds.has(reportId)));

  const handleLayerToggle = (layer) => {
    setSelectedLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const handleLocationSearch = (location) => {
    const locations = {
      'chennai': [13.0827, 80.2707],
      'mumbai': [19.0760, 72.8777],
      'kochi': [9.9312, 76.2673],
      'visakhapatnam': [17.6868, 83.2185],
      'goa': [15.2993, 74.1240],
      'punjab': [31.53, 75.92],
      'himachal': [31.83, 77.00],
      'bihar': [25.61, 85.15],
    };
    
    const coords = locations[location.toLowerCase()];
    if (coords) {
      setMapCenter(coords);
      setMapZoom(10);
    } else {
      setMapCenter([20.5937, 78.9629]);
      setMapZoom(5);
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
            <option value="">All India</option>
            <option value="punjab">Punjab</option>
            <option value="himachal">Himachal Pradesh</option>
            <option value="mumbai">Mumbai</option>
            <option value="chennai">Chennai</option>
            <option value="bihar">Bihar</option>
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
          <div className="legend-item"><div className="legend-marker" style={{backgroundColor: getHazardColor('critical')}}></div><span>Critical</span></div>
          <div className="legend-item"><div className="legend-marker" style={{backgroundColor: getHazardColor('high')}}></div><span>High</span></div>
          <div className="legend-item"><div className="legend-marker" style={{backgroundColor: getHazardColor('medium')}}></div><span>Medium</span></div>
          <div className="legend-item"><div className="legend-marker" style={{backgroundColor: getHazardColor('low')}}></div><span>Low</span></div>
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
          
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Hazard Reports */}
          {selectedLayers.reports && verifiedReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.location.latitude, report.location.longitude]}
              icon={createCustomIcon(getHazardColor(report.severity))}
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
                  <p><strong>Time:</strong> {new Date(report.reportedAt).toLocaleString()}</p>
                  {report.description && <p><strong>Details:</strong> {report.description}</p>}
                  {report.reportedBy && <p><strong>Reported by:</strong> {report.reportedBy.name}</p>}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Hotspots */}
          {selectedLayers.heatmap && verifiedHotspots.map((hotspot) => (
            <Circle
              key={hotspot.id}
              center={hotspot.center}
              radius={hotspot.radius}
              fillColor={getHazardColor(hotspot.intensity)}
              fillOpacity={0.4}
              color={getHazardColor(hotspot.intensity)}
              weight={2}
            >
              <Popup>
                <div className="map-popup">
                  <h4>Hazard Hotspot</h4>
                  <p><strong>Intensity:</strong> {hotspot.intensity}</p>
                  <p><strong>Reports:</strong> {hotspot.reportCount}</p>
                  <p><strong>Dominant Types:</strong> {hotspot.dominantTypes.join(', ')}</p>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* Selected Location Marker */}
          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
              <Popup>Selected Location</Popup>
            </Marker>
          )}

        </MapContainer>
      </div>

      {/* Map Statistics */}
      <div className="map-stats">
        <div className="stat-item">
          <span className="stat-value">{verifiedReports.length}</span>
          <span className="stat-label">Verified Reports</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{verifiedHotspots.length}</span>
          <span className="stat-label">Hotspots</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {verifiedReports.filter(r => r.severity === 'critical' || r.severity === 'high').length}
          </span>
          <span className="stat-label">High Priority</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
