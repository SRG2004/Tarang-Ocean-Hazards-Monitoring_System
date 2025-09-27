/**
 * Database Connectivity Test Script
 * Tests the synthetic report database integration
 */

import { syntheticReportDbService } from '../services/syntheticReportDatabaseService.js';
import { syntheticReportGenerator } from './syntheticReportGenerator.js';

export async function testDatabaseConnectivity() {
  console.log('🗄️ Testing Database Connectivity for Synthetic Reports...');

  try {
    // Test 1: Check database connection
    console.log('\n1️⃣ Testing database connection...');
    const connectionStatus = await syntheticReportDbService.getConnectionStatus();
    console.log('Connection Status:', connectionStatus);

    if (!connectionStatus.connected) {
      console.error('❌ Database connection failed:', connectionStatus.error);
      return false;
    }

    console.log('✅ Database connection successful');

    // Test 2: Generate and save synthetic reports
    console.log('\n2️⃣ Generating and saving synthetic reports...');
    const testReports = syntheticReportGenerator.generateMultiplePosts(3, {
      hazardType: 'cyclone',
      location: { name: 'Chennai', lat: 13.0827, lng: 80.2707, radius: 0.5 },
      severity: 'high'
    });

    console.log('Generated reports:', testReports.map(r => ({
      id: r.id,
      content: r.content.substring(0, 50) + '...',
      platform: r.platform,
      hazardType: r.hazardType
    })));

    const saveResults = await syntheticReportDbService.saveMultipleSyntheticReports(testReports);
    console.log('✅ Saved reports to database:', saveResults.length);

    // Test 3: Fetch synthetic reports from database
    console.log('\n3️⃣ Fetching synthetic reports from database...');
    const fetchedReports = await syntheticReportDbService.getSyntheticReports({
      limit: 5,
      hazardType: 'cyclone'
    });

    console.log('Fetched reports:', fetchedReports.map(r => ({
      id: r.id,
      content: r.content.substring(0, 50) + '...',
      platform: r.platform,
      isSynthetic: r.isSynthetic
    })));

    // Test 4: Get statistics
    console.log('\n4️⃣ Getting synthetic report statistics...');
    const stats = await syntheticReportDbService.getSyntheticReportStats('24h');
    console.log('Database Statistics:', {
      total: stats.total,
      byHazardType: stats.byHazardType,
      bySeverity: stats.bySeverity,
      byPlatform: stats.byPlatform
    });

    // Test 5: Test real-time subscription
    console.log('\n5️⃣ Testing real-time subscription...');
    const subscriptionId = syntheticReportDbService.subscribeToSyntheticReports(
      (reports) => {
        console.log('📡 Real-time update received:', reports.length, 'reports');
      },
      { limit: 3 }
    );

    console.log('✅ Real-time subscription active:', subscriptionId);

    // Clean up subscription after 5 seconds
    setTimeout(() => {
      syntheticReportDbService.unsubscribeFromSyntheticReports(subscriptionId);
      console.log('🧹 Cleaned up real-time subscription');
    }, 5000);

    console.log('\n🎉 All database connectivity tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Database connectivity test failed:', error);
    return false;
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testDatabaseConnectivity = testDatabaseConnectivity;
  console.log('💡 Database connectivity test function available as: testDatabaseConnectivity()');
}
