/**
 * Geospatial Utility Functions
 * Functions for distance calculation, coordinate validation, and location-based operations
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} Radians
 */
const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

/**
 * Check if a point is within a circular radius
 * @param {number} centerLat - Center latitude
 * @param {number} centerLng - Center longitude
 * @param {number} pointLat - Point latitude
 * @param {number} pointLng - Point longitude
 * @param {number} radiusKm - Radius in kilometers
 * @returns {boolean} True if point is within radius
 */
export const isWithinRadius = (centerLat, centerLng, pointLat, pointLng, radiusKm) => {
  const distance = calculateDistance(centerLat, centerLng, pointLat, pointLng);
  return distance <= radiusKm;
};

/**
 * Validate coordinate values
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if coordinates are valid
 */
export const isValidCoordinate = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
};

/**
 * Get Indian coastal regions based on coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Coastal region name
 */
export const getCoastalRegion = (lat, lng) => {
  // Define approximate boundaries for Indian coastal regions
  const regions = [
    { name: 'West Bengal Coast', bounds: { minLat: 21.5, maxLat: 22.5, minLng: 87.5, maxLng: 88.5 } },
    { name: 'Odisha Coast', bounds: { minLat: 19.0, maxLat: 22.0, minLng: 84.5, maxLng: 87.5 } },
    { name: 'Andhra Pradesh Coast', bounds: { minLat: 13.5, maxLat: 19.5, minLng: 79.5, maxLng: 85.0 } },
    { name: 'Tamil Nadu East Coast', bounds: { minLat: 8.0, maxLat: 13.5, minLng: 78.0, maxLng: 81.0 } },
    { name: 'Tamil Nadu South Coast', bounds: { minLat: 8.0, maxLat: 10.0, minLng: 77.0, maxLng: 79.0 } },
    { name: 'Kerala Coast', bounds: { minLat: 8.0, maxLat: 12.5, minLng: 74.5, maxLng: 77.5 } },
    { name: 'Karnataka Coast', bounds: { minLat: 12.5, maxLat: 15.0, minLng: 74.0, maxLng: 75.5 } },
    { name: 'Goa Coast', bounds: { minLat: 15.0, maxLat: 15.8, minLng: 73.7, maxLng: 74.3 } },
    { name: 'Maharashtra Coast', bounds: { minLat: 15.8, maxLat: 20.0, minLng: 72.5, maxLng: 73.5 } },
    { name: 'Gujarat Coast', bounds: { minLat: 20.0, maxLat: 24.0, minLng: 68.0, maxLng: 73.0 } },
  ];
  
  for (const region of regions) {
    const { bounds } = region;
    if (lat >= bounds.minLat && lat <= bounds.maxLat && 
        lng >= bounds.minLng && lng <= bounds.maxLng) {
      return region.name;
    }
  }
  
  return 'Unknown Region';
};

export default {
  calculateDistance,
  isWithinRadius,
  isValidCoordinate,
  getCoastalRegion
};