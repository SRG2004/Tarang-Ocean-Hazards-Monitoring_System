// Sample hazard reports for testing map markers and hotspots
export const sampleHazardReports = [
  {
    id: 'hr_2025_punjab',
    title: 'Catastrophic Flooding in Punjab',
    type: 'flood',
    severity: 'critical',
    status: 'active',
    location: {
      latitude: 31.53,
      longitude: 75.92,
      address: 'Over 1,400 villages submerged, Punjab',
      district: 'State-wide',
      state: 'Punjab'
    },
    description: 'Unprecedented monsoon rains led to catastrophic floods, submerging over 1,400 villages. Mass evacuations are underway. Caused by dam overflow and unregulated development.',
    reportedBy: {
      id: 'gov_punjab_dma',
      name: 'Punjab Disaster Management Authority',
      type: 'official'
    },
    reportedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    verifiedBy: 'admin@oceanhazard.com',
    affectedArea: '1,400 villages',
    estimatedAffectedPopulation: 2500000,
    emergencyContacts: ['1077', '112'],
    images: [],
    weatherConditions: {
      windSpeed: '25 km/h',
      waveHeight: 'N/A',
      temperature: '24°C',
      visibility: 'Poor'
    },
    tags: ['critical', 'flooding', 'evacuation_mandatory', 'monsoon_disaster']
  },
  {
    id: 'hr_2025_hp',
    title: 'Flash Floods & Landslides in Himachal Pradesh',
    type: 'landslide',
    severity: 'high',
    status: 'active',
    location: {
      latitude: 31.83,
      longitude: 77.00,
      address: 'Multiple districts, Himachal Pradesh',
      district: 'State-wide',
      state: 'Himachal Pradesh'
    },
    description: 'Relentless monsoon downpours triggered severe flash floods and landslides, resulting in loss of life and destruction of key transportation networks.',
    reportedBy: {
      id: 'gov_hp_dma',
      name: 'Himachal Pradesh DMA',
      type: 'official'
    },
    reportedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'admin@oceanhazard.com',
    tags: ['high', 'flash_flood', 'landslide', 'monsoon']
  },
    {
    id: 'hr_2025_mumbai',
    title: 'Severe Urban & Coastal Flooding in Mumbai',
    type: 'flood',
    severity: 'high',
    status: 'active',
    location: {
      latitude: 19.07,
      longitude: 72.87,
      address: 'Coastal and low-lying areas, Mumbai',
      district: 'Mumbai',
      state: 'Maharashtra'
    },
    description: 'Extreme urban and coastal flooding due to tidal surges and poor drainage after intense rainfall. Major disruptions to transport and daily life.',
    reportedBy: {
      id: 'citizen_mumbai_01',
      name: 'Mumbai Resident',
      type: 'citizen'
    },
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'officer@oceanhazard.com',
    tags: ['high', 'urban_flooding', 'tidal_surge', 'mumbai_rains']
  },
  {
    id: 'hr_2025_chennai',
    title: 'Extreme Coastal Flooding in Chennai',
    type: 'flood',
    severity: 'high',
    status: 'active',
    location: {
      latitude: 13.08,
      longitude: 80.27,
      address: 'Low-lying coastal regions, Chennai',
      district: 'Chennai',
      state: 'Tamil Nadu'
    },
    description: 'Tidal surges combined with heavy rainfall have caused extreme coastal flooding, revealing the city\'s vulnerability.',
    reportedBy: {
      id: 'gov_chennai_corp',
      name: 'Greater Chennai Corporation',
      type: 'official'
    },
    reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'admin@oceanhazard.com',
    tags: ['high', 'coastal_flooding', 'chennai_rains']
  },
  {
    id: 'hr_2025_bihar',
    title: 'Ganga River Breaches Danger Mark in Bihar',
    type: 'flood',
    severity: 'high',
    status: 'active',
    location: {
      latitude: 25.61,
      longitude: 85.15,
      address: 'Riverbanks along Ganga, Bihar',
      district: 'State-wide',
      state: 'Bihar'
    },
    description: 'The Ganga River has breached danger marks in multiple locations, causing severe crop damage and threatening embankments.',
    reportedBy: {
      id: 'gov_bihar_wrd',
      name: 'Bihar Water Resource Dept.',
      type: 'official'
    },
    reportedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'admin@oceanhazard.com',
    tags: ['high', 'river_flood', 'ganga', 'agriculture_loss']
  },
  {
    id: 'hr_001',
    title: 'High Tide Alert - Marina Beach',
    type: 'tidal_surge',
    severity: 'high',
    status: 'active',
    location: {
      latitude: 13.0499,
      longitude: 80.2824,
      address: 'Marina Beach, Chennai, Tamil Nadu',
      district: 'Chennai',
      state: 'Tamil Nadu'
    },
    description: 'Unusually high tides observed with potential flooding risk in low-lying areas. Water levels 1.5m above normal.',
    reportedBy: {
      id: 'user_001',
      name: 'Coastal Observer',
      type: 'citizen'
    },
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'officer@oceanhazard.com',
    affectedArea: '2.5 km stretch',
    estimatedAffectedPopulation: 15000,
    emergencyContacts: ['+91-044-25361721', '+91-044-25361722'],
    images: ['marina_hightide_001.jpg', 'marina_flooding_002.jpg'],
    weatherConditions: {
      windSpeed: '45 km/h',
      waveHeight: '3.2m',
      temperature: '28°C',
      visibility: 'Moderate'
    },
    tags: ['urgent', 'flooding', 'evacuation_advisory']
  },
  {
    id: 'hr_002',
    title: 'Cyclone Warning - Visakhapatnam Coast',
    type: 'cyclone',
    severity: 'critical',
    status: 'active',
    location: {
      latitude: 17.7231,
      longitude: 83.3012,
      address: 'Visakhapatnam Beach, Andhra Pradesh',
      district: 'Visakhapatnam',
      state: 'Andhra Pradesh'
    },
    description: 'Severe cyclonic storm approaching coast. Expected landfall in 8-12 hours. Immediate evacuation recommended.',
    reportedBy: {
      id: 'user_002',
      name: 'Meteorological Station',
      type: 'official'
    },
    reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'admin@oceanhazard.com',
    affectedArea: '50 km radius',
    estimatedAffectedPopulation: 500000,
    emergencyContacts: ['+91-891-2560037', '+91-891-2560038'],
    images: ['cyclone_satellite_001.jpg', 'coastal_preparation_002.jpg'],
    weatherConditions: {
      windSpeed: '120 km/h',
      waveHeight: '8.5m',
      temperature: '26°C',
      visibility: 'Poor'
    },
    tags: ['critical', 'evacuation_mandatory', 'cyclone', 'red_alert']
  },
  {
    id: 'hr_003',
    title: 'Oil Spill Detected - Kochi Harbor',
    type: 'pollution',
    severity: 'medium',
    status: 'investigating',
    location: {
      latitude: 9.9312,
      longitude: 76.2673,
      address: 'Kochi Harbor, Fort Kochi, Kerala',
      district: 'Ernakulam',
      state: 'Kerala'
    },
    description: 'Oil spill detected near harbor area. Marine life at risk. Cleanup operations initiated.',
    reportedBy: {
      id: 'user_003',
      name: 'Fisherman Association',
      type: 'citizen'
    },
    reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'analyst@oceanhazard.com',
    affectedArea: '1.2 km²',
    estimatedAffectedPopulation: 5000,
    emergencyContacts: ['+91-484-2668001', '+91-484-2668002'],
    images: ['oil_spill_001.jpg', 'affected_marine_002.jpg'],
    weatherConditions: {
      windSpeed: '15 km/h',
      waveHeight: '1.1m',
      temperature: '30°C',
      visibility: 'Good'
    },
    tags: ['pollution', 'marine_life', 'cleanup_required']
  },
  {
    id: 'hr_004',
    title: 'Rough Sea Warning - Goa Beaches',
    type: 'rough_sea',
    severity: 'medium',
    status: 'active',
    location: {
      latitude: 15.2993,
      longitude: 74.1240,
      address: 'Calangute Beach, Goa',
      district: 'North Goa',
      state: 'Goa'
    },
    description: 'Rough sea conditions with strong currents. Swimming and water sports prohibited.',
    reportedBy: {
      id: 'user_004',
      name: 'Lifeguard Team',
      type: 'official'
    },
    reportedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'officer@oceanhazard.com',
    affectedArea: '15 km coastline',
    estimatedAffectedPopulation: 25000,
    emergencyContacts: ['+91-832-2419132', '+91-832-2419133'],
    images: ['rough_waves_001.jpg', 'warning_signs_002.jpg'],
    weatherConditions: {
      windSpeed: '35 km/h',
      waveHeight: '2.8m',
      temperature: '32°C',
      visibility: 'Good'
    },
    tags: ['swimming_prohibited', 'tourist_advisory', 'rough_sea']
  },
  {
    id: 'hr_005',
    title: 'Coastal Erosion Alert - Puducherry',
    type: 'erosion',
    severity: 'low',
    status: 'monitoring',
    location: {
      latitude: 11.9139,
      longitude: 79.8145,
      address: 'Promenade Beach, Puducherry',
      district: 'Puducherry',
      state: 'Puducherry'
    },
    description: 'Gradual coastal erosion observed. Protective measures being evaluated.',
    reportedBy: {
      id: 'user_005',
      name: 'Coastal Research Station',
      type: 'researcher'
    },
    reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'analyst@oceanhazard.com',
    affectedArea: '800m coastline',
    estimatedAffectedPopulation: 2000,
    emergencyContacts: ['+91-413-2334791', '+91-413-2334792'],
    images: ['erosion_001.jpg', 'baseline_comparison_002.jpg'],
    weatherConditions: {
      windSpeed: '20 km/h',
      waveHeight: '1.5m',
      temperature: '29°C',
      visibility: 'Excellent'
    },
    tags: ['monitoring', 'erosion', 'research']
  }
];

// Generate hotspots based on report density
export const generateHotspots = (reports = sampleHazardReports) => {
  const hotspots = [];
  const locationGroups = {};

  // Group reports by proximity (within ~50km)
  reports.forEach(report => {
    const key = `${Math.round(report.location.latitude * 10) / 10}_${Math.round(report.location.longitude * 10) / 10}`;
    if (!locationGroups[key]) {
      locationGroups[key] = [];
    }
    locationGroups[key].push(report);
  });

  // Create hotspots from grouped locations
  Object.values(locationGroups).forEach(group => {
    if (group.length >= 2) { // At least 2 reports to form a hotspot
      const avgLat = group.reduce((sum, r) => sum + r.location.latitude, 0) / group.length;
      const avgLng = group.reduce((sum, r) => sum + r.location.longitude, 0) / group.length;
      
      const criticalCount = group.filter(r => r.severity === 'critical').length;
      const highCount = group.filter(r => r.severity === 'high').length;
      const activeCount = group.filter(r => r.status === 'active').length;
      
      let intensity = 'low';
      if (criticalCount > 0 || highCount >= 2) intensity = 'high';
      else if (highCount > 0 || activeCount >= 3) intensity = 'medium';
      
      hotspots.push({
        id: `hotspot_${Math.random().toString(36).substr(2, 9)}`,
        center: [avgLat, avgLng],
        intensity,
        reportCount: group.length,
        radius: Math.min(50000, group.length * 15000), // Max 50km radius
        reports: group.map(r => r.id),
        dominantTypes: [...new Set(group.map(r => r.type))],
        lastUpdated: new Date().toISOString()
      });
    }
  });

  return hotspots;
};

// Statistics for dashboard
export const getReportStatistics = (reports = sampleHazardReports) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    total: reports.length,
    active: reports.filter(r => r.status === 'active').length,
    critical: reports.filter(r => r.severity === 'critical').length,
    today: reports.filter(r => new Date(r.reportedAt) >= today).length,
    thisWeek: reports.filter(r => new Date(r.reportedAt) >= thisWeek).length,
    thisMonth: reports.filter(r => new Date(r.reportedAt) >= thisMonth).length,
    byType: reports.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {}),
    bySeverity: reports.reduce((acc, r) => {
      acc[r.severity] = (acc[r.severity] || 0) + 1;
      return acc;
    }, {}),
    byState: reports.reduce((acc, r) => {
      acc[r.location.state] = (acc[r.location.state] || 0) + 1;
      return acc;
    }, {})
  };
};
