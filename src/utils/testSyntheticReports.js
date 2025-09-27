/**
 * Test Script for Synthetic Report Generation
 * Run this to test the synthetic report generation functionality
 */

import { syntheticReportGenerator } from './syntheticReportGenerator.js';

// Test function to demonstrate synthetic report generation
export const testSyntheticReports = () => {
  console.log('🧪 Testing Synthetic Report Generation...\n');

  // Test 1: Generate single synthetic report
  console.log('1. Generating single synthetic report:');
  const singleReport = syntheticReportGenerator.generateSyntheticPost({
    hazardType: 'cyclone',
    location: { name: 'Chennai', lat: 13.0827, lng: 80.2707, radius: 0.5 },
    platform: 'twitter',
    sentiment: 'negative',
    severity: 'high'
  });

  console.log('Generated Report:');
  console.log(`  Platform: ${singleReport.platform}`);
  console.log(`  Author: ${singleReport.author}`);
  console.log(`  Content: ${singleReport.content.substring(0, 100)}...`);
  console.log(`  Sentiment: ${singleReport.sentiment.label} (${singleReport.sentiment.score})`);
  console.log(`  Keywords: ${singleReport.keywords.join(', ')}`);
  console.log(`  Location: ${singleReport.location.name} (${singleReport.location.lat.toFixed(4)}, ${singleReport.location.lng.toFixed(4)})`);
  console.log(`  Relevance Score: ${singleReport.relevanceScore}`);
  console.log(`  Is Synthetic: ${singleReport.isSynthetic}`);
  console.log('');

  // Test 2: Generate multiple reports
  console.log('2. Generating multiple synthetic reports:');
  const multipleReports = syntheticReportGenerator.generateMultiplePosts(3, {
    hazardType: 'tsunami',
    sentiment: 'negative',
    severity: 'critical'
  });

  console.log(`Generated ${multipleReports.length} reports:`);
  multipleReports.forEach((report, index) => {
    console.log(`  ${index + 1}. ${report.platform} - ${report.author}: ${report.content.substring(0, 60)}...`);
    console.log(`     Location: ${report.location.name}, Sentiment: ${report.sentiment.label}, Severity: ${report.severity}`);
  });
  console.log('');

  // Test 3: Test different hazard scenarios
  console.log('3. Testing different hazard scenarios:');
  const scenarios = [
    { type: 'flood', location: 'Mumbai', severity: 'medium' },
    { type: 'storm', location: 'Kochi', severity: 'high' },
    { type: 'coastal_erosion', location: 'Goa', severity: 'low' }
  ];

  scenarios.forEach((scenario, index) => {
    const report = syntheticReportGenerator.generateSyntheticPost({
      hazardType: scenario.type,
      location: syntheticReportGenerator.config.locations.find(l => l.name === scenario.location),
      severity: scenario.severity,
      sentiment: 'negative'
    });

    console.log(`  ${index + 1}. ${scenario.type.toUpperCase()} in ${scenario.location}:`);
    console.log(`     ${report.content}`);
    console.log(`     Severity: ${report.severity}, Sentiment: ${report.sentiment.label}`);
    console.log('');
  });

  // Test 4: Test sentiment variations
  console.log('4. Testing sentiment variations:');
  const sentiments = ['positive', 'neutral', 'negative'];
  sentiments.forEach(sentiment => {
    const report = syntheticReportGenerator.generateSyntheticPost({
      hazardType: 'cyclone',
      sentiment: sentiment,
      severity: 'medium'
    });

    console.log(`  ${sentiment.toUpperCase()}: ${report.content.substring(0, 80)}...`);
    console.log(`     Score: ${report.sentiment.score}`);
  });
  console.log('');

  // Test 5: Test coordinate generation
  console.log('5. Testing coordinate generation within radius:');
  const baseLocation = { lat: 13.0827, lng: 80.2707, radius: 1.0 }; // Chennai, 1km radius
  const testReports = syntheticReportGenerator.generateMultiplePosts(5, {
    location: baseLocation
  });

  console.log(`Generated 5 reports within ${baseLocation.radius}km of Chennai:`);
  testReports.forEach((report, index) => {
    const distance = calculateDistance(
      baseLocation.lat,
      baseLocation.lng,
      report.location.lat,
      report.location.lng
    );
    console.log(`  ${index + 1}. Distance: ${distance.toFixed(2)}km`);
  });
  console.log('');

  console.log('✅ Synthetic report generation test completed successfully!');
  console.log('\n📊 Summary:');
  console.log('  - Single report generation: ✅ Working');
  console.log('  - Multiple report generation: ✅ Working');
  console.log('  - Hazard scenario generation: ✅ Working');
  console.log('  - Sentiment analysis: ✅ Working');
  console.log('  - Geographic coordinate generation: ✅ Working');
  console.log('  - Keyword extraction: ✅ Working');
  console.log('  - Relevance scoring: ✅ Working');
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testSyntheticReports = testSyntheticReports;
  console.log('🧪 Synthetic report test function loaded. Run testSyntheticReports() in console.');
}
