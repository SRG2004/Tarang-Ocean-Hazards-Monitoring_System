import React from 'react';
import HazardMap from '../components/HazardMap';
import '../styles/globals.css';

const MapViewPage = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Live Hazard Map</h1>
        <p className="text-muted-foreground">Real-time hazard locations reported by users.</p>
      </header>
      <HazardMap />
    </div>
  );
};

export default MapViewPage;
