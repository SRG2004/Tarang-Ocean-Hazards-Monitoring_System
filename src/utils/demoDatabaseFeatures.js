/**
 * Database Features Demo Script
 * Demonstrates all database connectivity features for synthetic reports
 */

import { syntheticReportDbService } from '../services/syntheticReportDatabaseService.js';
import { syntheticReportGenerator } from './syntheticReportGenerator.js';

export async function demoDatabaseFeatures() {
  console.log('🚀 Starting Database Features Demo for Synthetic Reports...');

  try {
    // Demo 1: Database Connection Status
    console.log('\n📊 1. Database Connection Status');
    console.log('='.repeat(50));

    const connectionStatus = await syntheticReportDbService.getConnectionStatus();
    console.log('Connection Status:', connectionStatus);

    if (!connectionStatus.connected) {
      console.log('⚠️ Database not connected. Some features may not work.');
      console.log('Make sure Firebase is properly configured.');
      return;
    }

    // Demo 2: Generate and Save Reports
    console.log('\n💾 2. Generate and Save Synthetic Reports');
    console.log('='.repeat(50));

    const hazardScenarios = [
      { type: 'cyclone', location: 'Chennai', severity: 'critical' },
      { type: 'tsunami', location: 'Visakhapatnam', severity: 'high' },
      { type: 'flood', location: 'Kochi', severity: 'medium' }
    ];

    for (const scenario of hazardScenarios) {
      console.log(`\nGenerating ${scenario.type} scenario for ${scenario.location}...`);

      const reports = syntheticReportGenerator.generateMultiplePosts(2, {
        hazardType: scenario.type,
        severity: scenario.severity,
        location: syntheticReportGenerator.config.locations.find(
          l => l.name.toLowerCase() === scenario.location.toLowerCase()
        )
      });

      const saveResults = await syntheticReportDbService.saveMultipleSyntheticReports(reports);
      console.log(`✅ Saved ${saveResults.length} ${scenario.type} reports to database`);
    }

    // Demo 3: Fetch and Display Reports
    console.log('\n📖 3. Fetch and Display Reports from Database');
    console.log('='.repeat(50));

    const allReports = await syntheticReportDbService.getSyntheticReports({ limit: 10 });
    console.log(`Found ${allReports.length} synthetic reports in database:`);

    allReports.forEach((report, index) => {
      console.log(`${index + 1}. [${report.platform}] ${report.content.substring(0, 60)}...`);
      console.log(`   📍 ${report.location.name} | ⚡ ${report.severity} | 😊 ${report.sentiment.label}`);
      console.log(`   🔗 Relevance: ${report.relevanceScore}% | 👍 ${report.engagement.likes}`);
    });

    // Demo 4: Statistics and Analytics
    console.log('\n📈 4. Database Statistics and Analytics');
    console.log('='.repeat(50));

    const stats = await syntheticReportDbService.getSyntheticReportStats('24h');
    console.log('Overall Statistics:');
    console.log(`  📊 Total Reports: ${stats.total}`);
    console.log(`  🕐 Time Range: ${stats.timeRange}`);
    console.log(`  📅 Generated: ${new Date(stats.generatedAt).toLocaleString()}`);

    console.log('\nBreakdown by Category:');
    console.log('  🌊 Hazard Types:', JSON.stringify(stats.byHazardType, null, 2));
    console.log('  ⚡ Severity Levels:', JSON.stringify(stats.bySeverity, null, 2));
    console.log('  📱 Platforms:', JSON.stringify(stats.byPlatform, null, 2));
    console.log('  😊 Sentiment:', JSON.stringify(stats.bySentiment, null, 2));

    // Demo 5: Real-time Subscription
    console.log('\n📡 5. Real-time Database Subscription');
    console.log('='.repeat(50));

    console.log('Setting up real-time subscription for new reports...');
    const subscriptionId = syntheticReportDbService.subscribeToSyntheticReports(
      (reports) => {
        console.log(`📡 Real-time Update: ${reports.length} new reports received`);
        reports.forEach(report => {
          console.log(`  🆕 [${report.platform}] ${report.content.substring(0, 40)}...`);
        });
      },
      { limit: 5 }
    );

    console.log(`✅ Real-time subscription active: ${subscriptionId}`);

    // Demo 6: Cleanup Old Reports
    console.log('\n🧹 6. Database Cleanup');
    console.log('='.repeat(50));

    console.log('Cleaning up reports older than 30 days...');
    const cleanupResult = await syntheticReportDbService.cleanupOldReports(30);
    console.log(`🗑️ Cleanup completed: ${cleanupResult.deleted} reports deleted`);

    // Demo 7: Advanced Filtering
    console.log('\n🔍 7. Advanced Database Filtering');
    console.log('='.repeat(50));

    const filteredReports = await syntheticReportDbService.getSyntheticReports({
      hazardType: 'cyclone',
      severity: 'critical',
      platform: 'twitter',
      limit: 3
    });

    console.log(`Found ${filteredReports.length} critical cyclone reports on Twitter:`);
    filteredReports.forEach(report => {
      console.log(`  📱 ${report.author}: ${report.content.substring(0, 50)}...`);
    });

    console.log('\n🎉 Database Features Demo Completed Successfully!');
    console.log('\n💡 Available Database Operations:');
    console.log('  • Save synthetic reports to database');
    console.log('  • Fetch reports with advanced filtering');
    console.log('  • Get comprehensive statistics');
    console.log('  • Real-time subscriptions');
    console.log('  • Automatic cleanup of old reports');
    console.log('  • Connection status monitoring');

    return {
      success: true,
      totalReports: allReports.length,
      stats,
      cleanupResult
    };

  } catch (error) {
    console.error('❌ Database features demo failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.demoDatabaseFeatures = demoDatabaseFeatures;
  console.log('💡 Database features demo available as: demoDatabaseFeatures()');
}
