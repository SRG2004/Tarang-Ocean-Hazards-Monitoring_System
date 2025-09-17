/**
 * INCOIS Integration Service
 * Handles integration with INCOIS early warning systems and ocean data services
 */

class INCOISIntegrationService {
  constructor() {
    this.baseURL = 'https://incois.gov.in/portal'; // INCOIS portal base URL
    this.alertLevels = ['Green', 'Yellow', 'Orange', 'Red'];
    this.oceanParameters = [
      'wave_height',
      'wave_direction', 
      'wave_period',
      'storm_surge',
      'sea_surface_temperature',
      'current_speed',
      'current_direction',
      'tide_level',
      'atmospheric_pressure'
    ];
  }

  // Get INCOIS alert levels and their descriptions
  getAlertLevels() {
    return [
      {
        level: 'Green',
        color: '#10b981',
        description: 'Normal conditions - No immediate threat',
        action: 'Regular monitoring and preparedness',
        priority: 1
      },
      {
        level: 'Yellow', 
        color: '#f59e0b',
        description: 'Watch - Conditions developing that could lead to hazards',
        action: 'Enhanced monitoring and preparation',
        priority: 2
      },
      {
        level: 'Orange',
        color: '#f97316', 
        description: 'Warning - Hazardous conditions expected',
        action: 'Take precautionary measures, avoid affected areas',
        priority: 3
      },
      {
        level: 'Red',
        color: '#ef4444',
        description: 'Alert - Extremely hazardous conditions imminent/occurring',
        action: 'Emergency response, immediate evacuation if required',
        priority: 4
      }
    ];
  }

  // Simulate INCOIS early warning data (in production, integrate with actual INCOIS APIs)
  async getEarlyWarningData(region = 'all') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const warnings = [
      {
        id: 'INC_2024_001',
        type: 'Cyclone Warning',
        region: 'Bay of Bengal',
        alertLevel: 'Orange',
        issuedTime: new Date(Date.now() - 3600000).toISOString(),
        validUntil: new Date(Date.now() + 86400000).toISOString(),
        parameters: {
          maxWindSpeed: '85 kmph',
          waveHeight: '4.5 meters',
          stormSurgeHeight: '1.5 meters',
          landfall: 'Expected near Visakhapatnam in 18 hours'
        },
        affectedAreas: ['Andhra Pradesh', 'Tamil Nadu', 'Odisha'],
        instructions: [
          'Fishermen advised not to venture into sea',
          'Coastal residents to move to safer places', 
          'Suspend port operations',
          'Alert disaster management teams'
        ]
      },
      {
        id: 'INC_2024_002',
        type: 'High Wave Alert',
        region: 'Arabian Sea',
        alertLevel: 'Yellow',
        issuedTime: new Date(Date.now() - 7200000).toISOString(),
        validUntil: new Date(Date.now() + 43200000).toISOString(),
        parameters: {
          waveHeight: '3.2 meters',
          wavePeriod: '8-10 seconds',
          direction: 'Southwest'
        },
        affectedAreas: ['Maharashtra', 'Gujarat', 'Goa'],
        instructions: [
          'Small vessels avoid deep sea fishing',
          'Beach tourists maintain caution',
          'Monitor marine conditions closely'
        ]
      },
      {
        id: 'INC_2024_003', 
        type: 'Swell Surge Warning',
        region: 'Tamil Nadu Coast',
        alertLevel: 'Orange',
        issuedTime: new Date(Date.now() - 1800000).toISOString(),
        validUntil: new Date(Date.now() + 28800000).toISOString(),
        parameters: {
          swellHeight: '2.8 meters',
          surgePeriod: '12-14 seconds',
          tidalAmplification: 'High'
        },
        affectedAreas: ['Chennai', 'Pondicherry', 'Cuddalore'],
        instructions: [
          'Avoid low-lying coastal areas',
          'Suspend fishing activities',
          'Alert coastal communities'
        ]
      },
      {
        id: 'INC_2024_004',
        type: 'Tsunami Advisory',
        region: 'Indian Ocean',
        alertLevel: 'Green',
        issuedTime: new Date(Date.now() - 10800000).toISOString(),
        validUntil: new Date(Date.now() + 3600000).toISOString(),
        parameters: {
          magnitude: '6.2',
          depth: '45 km',
          epicenter: 'Near Andaman Islands',
          travelTime: '2-3 hours to mainland'
        },
        affectedAreas: ['Andaman & Nicobar Islands', 'East Coast India'],
        instructions: [
          'Monitoring sea level changes',
          'No immediate evacuation required',
          'Stay informed through official channels'
        ]
      }
    ];

    // Filter by region if specified
    if (region !== 'all') {
      return warnings.filter(warning => 
        warning.region.toLowerCase().includes(region.toLowerCase()) ||
        warning.affectedAreas.some(area => 
          area.toLowerCase().includes(region.toLowerCase())
        )
      );
    }

    return warnings;
  }

  // Get ocean parameter data (simulated)
  async getOceanParameters(location, parameters = this.oceanParameters) {
    await new Promise(resolve => setTimeout(resolve, 600));

    const data = {};
    const currentTime = new Date();

    parameters.forEach(param => {
      switch (param) {
        case 'wave_height':
          data[param] = {
            value: (Math.random() * 4 + 1).toFixed(1), 
            unit: 'meters',
            timestamp: currentTime.toISOString(),
            quality: 'good'
          };
          break;
        case 'wave_direction':
          data[param] = {
            value: Math.floor(Math.random() * 360),
            unit: 'degrees',
            timestamp: currentTime.toISOString(),
            quality: 'good'
          };
          break;
        case 'storm_surge':
          data[param] = {
            value: (Math.random() * 2).toFixed(2),
            unit: 'meters',
            timestamp: currentTime.toISOString(),
            quality: 'fair'
          };
          break;
        case 'sea_surface_temperature':
          data[param] = {
            value: (26 + Math.random() * 6).toFixed(1),
            unit: '°C',
            timestamp: currentTime.toISOString(),
            quality: 'excellent'
          };
          break;
        case 'current_speed':
          data[param] = {
            value: (Math.random() * 3).toFixed(2),
            unit: 'm/s',
            timestamp: currentTime.toISOString(),
            quality: 'good'
          };
          break;
        case 'atmospheric_pressure':
          data[param] = {
            value: (1000 + Math.random() * 50).toFixed(1),
            unit: 'hPa',
            timestamp: currentTime.toISOString(),
            quality: 'excellent'
          };
          break;
        default:
          data[param] = {
            value: 'N/A',
            unit: '',
            timestamp: currentTime.toISOString(),
            quality: 'no_data'
          };
      }
    });

    return {
      location: location,
      timestamp: currentTime.toISOString(),
      parameters: data,
      source: 'INCOIS Monitoring Network'
    };
  }

  // Map INCOIS alert levels to internal severity levels
  mapAlertToSeverity(alertLevel) {
    const mapping = {
      'Green': 'low',
      'Yellow': 'medium', 
      'Orange': 'high',
      'Red': 'critical'
    };
    return mapping[alertLevel] || 'medium';
  }

  // Get hazard-specific thresholds based on INCOIS guidelines
  getHazardThresholds() {
    return {
      wave_height: {
        low: { min: 0, max: 2.0, unit: 'meters' },
        medium: { min: 2.0, max: 3.5, unit: 'meters' },
        high: { min: 3.5, max: 5.0, unit: 'meters' },
        critical: { min: 5.0, max: 100, unit: 'meters' }
      },
      storm_surge: {
        low: { min: 0, max: 0.5, unit: 'meters' },
        medium: { min: 0.5, max: 1.0, unit: 'meters' },
        high: { min: 1.0, max: 2.0, unit: 'meters' },
        critical: { min: 2.0, max: 100, unit: 'meters' }
      },
      wind_speed: {
        low: { min: 0, max: 40, unit: 'kmph' },
        medium: { min: 40, max: 70, unit: 'kmph' },
        high: { min: 70, max: 120, unit: 'kmph' },
        critical: { min: 120, max: 1000, unit: 'kmph' }
      },
      current_speed: {
        low: { min: 0, max: 1.0, unit: 'm/s' },
        medium: { min: 1.0, max: 2.0, unit: 'm/s' },
        high: { min: 2.0, max: 3.5, unit: 'm/s' },
        critical: { min: 3.5, max: 100, unit: 'm/s' }
      }
    };
  }

  // Validate hazard report against INCOIS thresholds
  validateHazardReport(report) {
    const thresholds = this.getHazardThresholds();
    const validation = {
      isValid: true,
      warnings: [],
      suggestions: [],
      incoisCompatible: true
    };

    // Check if hazard type is recognized by INCOIS
    const incoisHazards = [
      'tsunami', 'cyclone', 'storm_surge', 'high_waves', 
      'swell_surge', 'coastal_current', 'abnormal_sea_behavior'
    ];

    if (!incoisHazards.includes(report.hazardType)) {
      validation.warnings.push(`Hazard type '${report.hazardType}' may not be directly compatible with INCOIS classification`);
      validation.incoisCompatible = false;
    }

    // Validate geographic coordinates for Indian coastal regions
    if (report.latitude && report.longitude) {
      const isInIndianCoast = (
        (report.latitude >= 8.0 && report.latitude <= 37.0) &&
        (report.longitude >= 68.0 && report.longitude <= 97.0)
      );

      if (!isInIndianCoast) {
        validation.warnings.push('Location appears to be outside Indian coastal regions monitored by INCOIS');
      }
    }

    return validation;
  }
}

// Create and export singleton instance
export const incoisIntegrationService = new INCOISIntegrationService();