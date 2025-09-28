import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testAPIKeyValidation() {
  log(colors.blue, '🔍 Testing API Key Validation...');

  const perplexityKey = process.env.PERPLEXITY_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!perplexityKey) {
    log(colors.red, '❌ FAIL: PERPLEXITY_API_KEY not found in .env');
    return false;
  }

  if (!geminiKey) {
    log(colors.red, '❌ FAIL: GEMINI_API_KEY not found in .env');
    return false;
  }

  if (!perplexityKey.startsWith('pplx-')) {
    log(colors.red, '❌ FAIL: Perplexity API key must start with "pplx-"');
    return false;
  }

  log(colors.green, '✅ PASS: API keys are properly formatted');
  return true;
}

async function testHealthCheck() {
  log(colors.blue, '🏥 Testing AI Service Health Check...');

  try {
    const response = await axios.get('http://localhost:3000/api/ai/health');
    if (response.status === 200 && response.data.status === 'healthy') {
      log(colors.green, '✅ PASS: AI service health check successful');
      return true;
    } else {
      log(colors.red, '❌ FAIL: AI service health check failed');
      return false;
    }
  } catch (error) {
    log(colors.red, `❌ FAIL: Health check error - ${error.message}`);
    log(colors.yellow, '💡 Make sure the server is running on port 3000');
    return false;
  }
}

async function testHazardAnalysis() {
  log(colors.blue, '🌊 Testing Hazard Analysis...');

  const testData = {
    description: 'Strong waves and high tide causing coastal erosion',
    location: 'Miami Beach, FL',
    severity: 'high'
  };

  try {
    const response = await axios.post('http://localhost:3000/api/ai/analyze', testData);
    if (response.status === 200 && response.data.analysis) {
      log(colors.green, '✅ PASS: Hazard analysis successful');
      log(colors.cyan, `📊 Analysis: ${response.data.analysis.substring(0, 100)}...`);
      return true;
    } else {
      log(colors.red, '❌ FAIL: Hazard analysis failed');
      return false;
    }
  } catch (error) {
    log(colors.red, `❌ FAIL: Hazard analysis error - ${error.message}`);
    if (error.response?.status === 429) {
      log(colors.yellow, '💡 Rate limit exceeded - try again later');
    } else if (error.response?.status === 401) {
      log(colors.yellow, '💡 API key invalid - check your .env file');
    }
    return false;
  }
}

async function testReportGeneration() {
  log(colors.blue, '📝 Testing Report Generation...');

  const testData = {
    hazardType: 'Storm Surge',
    location: 'Atlantic Coast',
    analysis: 'High risk area with potential for significant damage'
  };

  try {
    const response = await axios.post('http://localhost:3000/api/ai/report', testData);
    if (response.status === 200 && response.data.report) {
      log(colors.green, '✅ PASS: Report generation successful');
      log(colors.cyan, `📄 Report: ${response.data.report.substring(0, 100)}...`);
      return true;
    } else {
      log(colors.red, '❌ FAIL: Report generation failed');
      return false;
    }
  } catch (error) {
    log(colors.red, `❌ FAIL: Report generation error - ${error.message}`);
    return false;
  }
}

async function main() {
  log(colors.magenta, '🚀 Starting AI Configuration Tests...\n');

  let passed = 0;
  let total = 4;

  if (await testAPIKeyValidation()) passed++;
  if (await testHealthCheck()) passed++;
  if (await testHazardAnalysis()) passed++;
  if (await testReportGeneration()) passed++;

  log(colors.magenta, `\n📊 Test Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    log(colors.green, '🎉 All tests passed! Your AI configuration is working correctly.');
  } else {
    log(colors.red, '⚠️  Some tests failed. Check the troubleshooting guide in AI_INTEGRATION_GUIDE.md');
    log(colors.yellow, '\n🔧 Common fixes:');
    log(colors.yellow, '   1. Update API keys in .env (Perplexity: pplx-*, Gemini: AIza...)');
    log(colors.yellow, '   2. Ensure server is running: npm start');
    log(colors.yellow, '   3. Check Firebase indexes if using Firestore');
    log(colors.yellow, '   4. Verify model names are current');
  }

  process.exit(passed === total ? 0 : 1);
}

main().catch(error => {
  log(colors.red, `💥 Test runner error: ${error.message}`);
  process.exit(1);
});
