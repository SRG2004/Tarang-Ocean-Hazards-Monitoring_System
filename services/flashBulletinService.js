/**
 * Flash Bulletin Service for Taranga Ocean Hazard Monitor
 * Generates dynamic warning bulletins based on current hazard data for Indian coastal regions
 */

import { getSocialMediaStats } from './socialMediaService.js';

// Indian coastal regions with specific warning types
const INDIAN_COASTAL_REGIONS = {
  'west_coast': {
    name: 'West Coast',
    states: ['maharashtra', 'goa', 'karnataka', 'kerala', 'gujarat'],
    cities: ['mumbai', 'goa', 'mangalore', 'kochi', 'surat', 'porbandar'],
    primaryHazards: ['cyclone', 'monsoon', 'high_tide', 'storm_surge']
  },
  'east_coast': {
    name: 'East Coast', 
    states: ['tamil nadu', 'andhra pradesh', 'odisha', 'west bengal'],
    cities: ['chennai', 'visakhapatnam', 'kolkata', 'pondicherry'],
    primaryHazards: ['cyclone', 'tsunami', 'storm_surge', 'coastal_erosion']
  },
  'southern_coast': {
    name: 'Southern Coast',
    states: ['kerala', 'tamil nadu', 'karnataka'],
    cities: ['kochi', 'trivandrum', 'chennai', 'mangalore'],
    primaryHazards: ['tsunami', 'monsoon', 'high_tide', 'marine_emergency']
  }
};

// Warning templates based on hazard types
const WARNING_TEMPLATES = {
  tsunami: {
    icon: '🌊',
    color: '#dc2626',
    title: 'TSUNAMI ALERT',
    warnings: {
      critical: 'IMMEDIATE EVACUATION: Move to higher ground immediately. Avoid all coastal areas.',
      high: 'HIGH ALERT: Avoid fishing, swimming, and coastal activities. Stay away from beaches.',
      medium: 'CAUTION: Monitor official alerts. Avoid unnecessary coastal activities.',
      low: 'ADVISORY: Exercise caution near coastal areas. Stay updated with latest reports.'
    }
  },
  cyclone: {
    icon: '🌀',
    color: '#ea580c', 
    title: 'CYCLONE ALERT',
    warnings: {
      critical: 'SEVERE CYCLONE: Suspend all fishing activities. Secure boats and vessels immediately.',
      high: 'CYCLONE WARNING: Strong winds expected. Avoid sea travel and coastal areas.',
      medium: 'CYCLONE WATCH: Monitor weather updates. Prepare for potential strong winds.',
      low: 'WEATHER ADVISORY: Cloudy skies and moderate winds expected. Exercise normal caution.'
    }
  },
  flood: {
    icon: '🌊',
    color: '#2563eb',
    title: 'FLOOD ALERT', 
    warnings: {
      critical: 'SEVERE FLOODING: Avoid all coastal roads and low-lying areas. Emergency evacuation advised.',
      high: 'FLOOD WARNING: Heavy rains causing flooding. Avoid coastal and riverside areas.',
      medium: 'FLOOD WATCH: Potential flooding in low areas. Avoid unnecessary travel.',
      low: 'RAIN ADVISORY: Light to moderate rains expected. Exercise normal caution.'
    }
  },
  storm_surge: {
    icon: '⛈️',
    color: '#7c3aed',
    title: 'STORM SURGE ALERT',
    warnings: {
      critical: 'DANGEROUS SURGE: Immediate threat to coastal areas. Evacuate low-lying regions.',
      high: 'SURGE WARNING: High waves and surge expected. Stay away from coastline.',
      medium: 'SURGE WATCH: Elevated sea levels possible. Monitor conditions closely.',
      low: 'MARINE ADVISORY: Slightly elevated sea conditions. Fishing boats exercise caution.'
    }
  },
  monsoon: {
    icon: '🌧️', 
    color: '#059669',
    title: 'MONSOON UPDATE',
    warnings: {
      critical: 'HEAVY MONSOON: Severe rainfall and flooding risk. Avoid fishing and coastal travel.',
      high: 'ACTIVE MONSOON: Heavy rains expected. Fishing vessels return to shore.',
      medium: 'MODERATE MONSOON: Steady rainfall continuing. Exercise caution at sea.',
      low: 'LIGHT MONSOON: Intermittent showers expected. Normal fishing activities with caution.'
    }
  }
};

/**
 * Generate flash bulletins based on current hazard data
 */
export const generateFlashBulletins = async () => {
  try {
    const socialMediaStats = getSocialMediaStats();
    const bulletins = [];
    
    // Analyze current hazard mentions and generate relevant bulletins
    const hazardTypes = extractHazardTypes(socialMediaStats);
    const affectedRegions = extractAffectedRegions(socialMediaStats);
    
    // Generate bulletins for each detected hazard
    for (const hazardType of hazardTypes) {
      const severity = determineBulletinSeverity(hazardType, socialMediaStats);
      const regions = getAffectedRegions(affectedRegions);
      
      if (severity && severity !== 'none') {
        const bulletin = createBulletin(hazardType, severity, regions);
        bulletins.push(bulletin);
      }
    }
    
    // Add general safety bulletin if no specific hazards
    if (bulletins.length === 0) {
      bulletins.push(createGeneralSafetyBulletin());
    }
    
    // Sort by priority (critical first)
    bulletins.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.severity] - priorityOrder[a.severity];
    });
    
    return bulletins.slice(0, 3); // Return top 3 most important bulletins
    
  } catch (error) {
    console.error('Error generating flash bulletins:', error);
    return [createGeneralSafetyBulletin()];
  }
};

/**
 * Extract hazard types from social media statistics
 */
const extractHazardTypes = (stats) => {
  const detectedHazards = new Set();
  
  // Analyze trending topics for hazard keywords
  if (stats.trendingTopics) {
    stats.trendingTopics.forEach(topic => {
      const topicLower = topic.topic.toLowerCase();
      
      if (topicLower.includes('tsunami')) detectedHazards.add('tsunami');
      if (topicLower.includes('cyclone') || topicLower.includes('hurricane')) detectedHazards.add('cyclone');
      if (topicLower.includes('flood')) detectedHazards.add('flood');
      if (topicLower.includes('surge') || topicLower.includes('wave')) detectedHazards.add('storm_surge');
      if (topicLower.includes('monsoon') || topicLower.includes('rain')) detectedHazards.add('monsoon');
    });
  }
  
  return Array.from(detectedHazards);
};

/**
 * Extract affected regions from social media data
 */
const extractAffectedRegions = (stats) => {
  const regions = new Set();
  
  // This would normally analyze the actual social media content
  // For now, we'll use a simplified approach based on mention counts
  if (stats.hazardMentions > 5) {
    regions.add('west_coast');
    regions.add('east_coast');
  } else if (stats.hazardMentions > 2) {
    regions.add('east_coast'); // Bay of Bengal is more cyclone-prone
  }
  
  return Array.from(regions);
};

/**
 * Determine bulletin severity based on hazard type and statistics
 */
const determineBulletinSeverity = (hazardType, stats) => {
  const mentionCount = stats.hazardMentions || 0;
  const negativeRatio = stats.sentimentDistribution?.negative || 0;
  
  if (mentionCount >= 10 && negativeRatio > 50) return 'critical';
  if (mentionCount >= 5 && negativeRatio > 30) return 'high';
  if (mentionCount >= 2) return 'medium';
  if (mentionCount >= 1) return 'low';
  
  return 'none';
};

/**
 * Get affected regions info
 */
const getAffectedRegions = (regionKeys) => {
  return regionKeys.map(key => INDIAN_COASTAL_REGIONS[key]).filter(Boolean);
};

/**
 * Create a bulletin for specific hazard
 */
const createBulletin = (hazardType, severity, regions) => {
  const template = WARNING_TEMPLATES[hazardType];
  
  if (!template) {
    return createGeneralSafetyBulletin();
  }
  
  const affectedAreas = regions.length > 0 
    ? regions.map(r => r.name).join(', ')
    : 'Indian Coastal Areas';
    
  return {
    id: `bulletin_${hazardType}_${Date.now()}`,
    type: hazardType,
    severity: severity,
    icon: template.icon,
    color: template.color,
    title: template.title,
    message: template.warnings[severity],
    affectedAreas: affectedAreas,
    timestamp: new Date().toISOString(),
    priority: getPriority(severity),
    actionItems: getActionItems(hazardType, severity),
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours
  };
};

/**
 * Create general safety bulletin
 */
const createGeneralSafetyBulletin = () => {
  return {
    id: `bulletin_general_${Date.now()}`,
    type: 'general',
    severity: 'low',
    icon: '🌊',
    color: '#059669',
    title: 'OCEAN SAFETY UPDATE',
    message: 'Ocean conditions are normal. Follow standard safety protocols for all marine activities.',
    affectedAreas: 'All Indian Coastal Areas',
    timestamp: new Date().toISOString(),
    priority: 1,
    actionItems: [
      'Check weather conditions before fishing',
      'Carry safety equipment on all boats',
      'Monitor Coast Guard advisories',
      'Report any unusual ocean activity'
    ],
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 hours
  };
};

/**
 * Get priority level for sorting
 */
const getPriority = (severity) => {
  const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
  return priorities[severity] || 1;
};

/**
 * Get action items based on hazard and severity
 */
const getActionItems = (hazardType, severity) => {
  const actionsByType = {
    tsunami: {
      critical: ['Evacuate coastal areas immediately', 'Move to higher ground', 'Avoid all beaches and harbors'],
      high: ['Stay away from coastline', 'Cancel all fishing trips', 'Monitor emergency broadcasts'],
      medium: ['Avoid swimming and fishing', 'Stay alert for updates', 'Keep emergency kit ready'],
      low: ['Exercise normal coastal caution', 'Monitor weather updates', 'Check with local authorities']
    },
    cyclone: {
      critical: ['Secure all vessels immediately', 'Suspend fishing operations', 'Prepare for evacuation'],
      high: ['Return boats to harbor', 'Cancel sea travel', 'Stock emergency supplies'],
      medium: ['Monitor weather closely', 'Prepare boats for rough weather', 'Avoid unnecessary sea trips'],
      low: ['Check weather before going to sea', 'Ensure boat safety equipment', 'Stay in communication']
    },
    flood: {
      critical: ['Evacuate low-lying areas', 'Avoid all flooded roads', 'Seek higher ground'],
      high: ['Avoid coastal roads', 'Cancel fishing activities', 'Monitor water levels'],
      medium: ['Exercise caution near water', 'Avoid low-lying areas', 'Keep updated on conditions'],
      low: ['Normal rain precautions', 'Monitor local conditions', 'Avoid waterlogged areas']
    },
    storm_surge: {
      critical: ['Evacuate coastal zones', 'Avoid all seaside areas', 'Seek immediate shelter'],
      high: ['Stay away from beaches', 'Secure boats and equipment', 'Monitor surge warnings'],
      medium: ['Avoid unnecessary coastal visits', 'Monitor sea conditions', 'Exercise caution'],
      low: ['Normal coastal safety measures', 'Check conditions before activities', 'Stay informed']
    },
    monsoon: {
      critical: ['Avoid all sea travel', 'Heavy rainfall flooding risk', 'Stay in safe shelter'],
      high: ['Return to harbor immediately', 'Avoid fishing', 'Prepare for heavy rains'],
      medium: ['Monitor monsoon updates', 'Exercise sea caution', 'Prepare for rain'],
      low: ['Normal monsoon precautions', 'Check weather before sea trips', 'Carry rain gear']
    }
  };
  
  return actionsByType[hazardType]?.[severity] || [
    'Monitor official weather updates',
    'Follow standard safety protocols',
    'Report unusual conditions to authorities'
  ];
};

/**
 * Get active bulletins (non-expired)
 */
export const getActiveBulletins = async () => {
  const bulletins = await generateFlashBulletins();
  const now = new Date();
  
  return bulletins.filter(bulletin => {
    const expiry = new Date(bulletin.expiresAt);
    return expiry > now;
  });
};