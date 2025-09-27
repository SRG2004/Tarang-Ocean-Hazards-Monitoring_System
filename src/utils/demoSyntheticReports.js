/**
 * Demonstration Script for Synthetic Report Generation
 * Shows how to use the synthetic report system
 */

import { syntheticReportGenerator } from './syntheticReportGenerator.js';

// Demo function to showcase the synthetic report system
export const demoSyntheticReports = () => {
  console.log('🚀 Synthetic Report Generation Demo\n');

  // Demo 1: Generate reports for different hazard scenarios
  console.log('1. 🌊 Hazard Scenario Generation:');
  const scenarios = [
    { type: 'cyclone', location: 'Chennai', severity: 'high' },
    { type: 'tsunami', location: 'Visakhapatnam', severity: 'critical' },
    { type: 'flood', location: 'Mumbai', severity: 'medium' }
  ];

  scenarios.forEach((scenario, index) => {
    const report = syntheticReportGenerator.generateSyntheticPost({
      hazardType: scenario.type,
      location: syntheticReportGenerator.config.locations.find(l => l.name === scenario.location),
      severity: scenario.severity,
      sentiment: 'negative'
    });

    console.log(`   ${index + 1}. ${scenario.type.toUpperCase()} in ${scenario.location}:`);
    console.log(`      "${report.content}"`);
    console.log(`      📍 Location: ${report.location.name} (${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)})`);
    console.log(`      🎭 Sentiment: ${report.sentiment.label} (${report.sentiment.score})`);
    console.log(`      ⚡ Severity: ${report.severity} | Relevance: ${report.relevanceScore}%`);
    console.log('');
  });

  // Demo 2: Generate multiple reports for hotspot creation
  console.log('2. 📍 Hotspot Generation Test:');
  const hotspotReports = syntheticReportGenerator.generateMultiplePosts(5, {
    hazardType: 'storm',
    location: syntheticReportGenerator.config.locations.find(l => l.name === 'Kochi'),
    sentiment: 'negative',
    severity: 'high'
  });

  console.log(`   Generated ${hotspotReports.length} storm reports near Kochi:`);
  hotspotReports.forEach((report, index) => {
    console.log(`   ${index + 1}. 📱 ${report.platform} - ${report.author}`);
    console.log(`      📍 (${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)})`);
    console.log(`      💬 "${report.content.substring(0, 80)}..."`);
    console.log('');
  });

  // Demo 3: Show sentiment variations
  console.log('3. 🎭 Sentiment Analysis Test:');
  const sentiments = ['positive', 'neutral', 'negative'];
  sentiments.forEach(sentiment => {
    const report = syntheticReportGenerator.generateSyntheticPost({
      hazardType: 'coastal_erosion',
      sentiment: sentiment,
      severity: 'medium'
    });

    console.log(`   ${sentiment.toUpperCase()}: ${report.sentiment.score} - "${report.content.substring(0, 60)}..."`);
  });
  console.log('');

  // Demo 4: Platform diversity
  console.log('4. 📱 Platform Diversity Test:');
  const platforms = ['twitter', 'facebook', 'instagram', 'youtube'];
  platforms.forEach(platform => {
    const report = syntheticReportGenerator.generateSyntheticPost({
      platform: platform,
      hazardType: 'high_waves'
    });

    console.log(`   ${platform.toUpperCase()}: ${report.author} - "${report.content.substring(0, 50)}..."`);
  });
  console.log('');

  console.log('✅ Demo completed successfully!');
  console.log('\n📊 Key Features Demonstrated:');
  console.log('  ✓ Realistic hazard scenario generation');
  console.log('  ✓ Geographic coordinate generation');
  console.log('  ✓ Sentiment analysis integration');
  console.log('  ✓ Multi-platform support');
  console.log('  ✓ Hotspot clustering capability');
  console.log('  ✓ Engagement metrics simulation');
  console.log('  ✓ Keyword extraction');
  console.log('  ✓ Relevance scoring');
  console.log('\n🎯 Ready for integration with social media monitoring and interactive map!');
};

// Export for browser console use
if (typeof window !== 'undefined') {
  window.demoSyntheticReports = demoSyntheticReports;
  console.log('🚀 Demo function loaded. Run demoSyntheticReports() in console.');
}
