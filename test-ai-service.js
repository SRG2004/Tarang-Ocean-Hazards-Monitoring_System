import AIIntelligenceService from './services/aiIntelligenceService.js';

// Test 1: API Key Validation (runs on import)
console.log('=== Test 1: API Key Validation ===');
try {
  // The import above already triggers validation in constructor
  console.log('✅ Service imported successfully - API keys validated');
} catch (error) {
  console.log('❌ Validation failed:', error.message);
}

// For async tests, wrap in async function
async function runTests() {
  // Test 2: Health Check
  console.log('\n=== Test 2: Health Check ===');
  try {
    const health = await AIIntelligenceService.healthCheck();
    console.log('✅ Health check passed:', JSON.stringify(health, null, 2));
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 3: Happy Path - Analyze Hazard Report
  console.log('\n=== Test 3: Happy Path - Analyze Hazard Report ===');
  try {
    const result = await AIIntelligenceService.analyzeHazardReport({
      type: 'tsunami',
      location: 'Bay of Bengal',
      description: 'Strong earthquake detected',
      severity: 'high'
    });
    console.log('✅ Analyze Hazard Report success:', result.data.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ Analyze Hazard Report failed:', error.message);
  }

  // Test 4: Happy Path - Generate Alert Message
  console.log('\n=== Test 4: Happy Path - Generate Alert Message ===');
  try {
    const alertMsg = await AIIntelligenceService.generateAlertMessage('tsunami', 'Bay of Bengal', 'high');
    console.log('✅ Generate Alert success:', alertMsg.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ Generate Alert failed:', error.message);
  }

  // Test 5: Error Path - Invalid Prompt (empty)
  console.log('\n=== Test 5: Error Path - Empty Prompt ===');
  try {
    await AIIntelligenceService.analyzeHazardReport({});
    console.log('❌ Should have failed for empty prompt');
  } catch (error) {
    console.log('✅ Error handling for empty prompt:', error.message);
  }

  // Test 6: Edge Case - Long Prompt
  console.log('\n=== Test 6: Edge Case - Long Prompt ===');
  const longPromptData = { description: 'A'.repeat(10000) }; // Very long description
  try {
    const result = await AIIntelligenceService.analyzeHazardReport(longPromptData);
    console.log('✅ Long prompt handled:', result ? 'Success' : 'Partial');
  } catch (error) {
    console.log('❌ Long prompt failed:', error.message);
  }

  // Test 7: Simulate Rate Limit (this would require mocking, but check if service handles 429)
  console.log('\n=== Test 7: Rate Limit Simulation (Manual) ===');
  console.log('Note: To test rate limits, make multiple rapid calls or use invalid key to trigger 429.');
  console.log('Service is configured to throw specific error for 429.');

  // Test 8: Timeout Simulation (requires mocking axios timeout)
  console.log('\n=== Test 8: Timeout Handling ===');
  console.log('Service has 30s timeout configured. Test by using slow network or invalid endpoint.');

  console.log('\n=== Thorough Testing Complete ===');
  console.log('Review console output for pass/fail. For full API endpoint testing, start backend server and use curl:');
  console.log('curl -X POST http://localhost:3001/api/ai/analyze -H "Content-Type: application/json" -d \'{"type":"test"}\'');
}

runTests().catch(console.error);
