import axios from 'axios';
import RateLimit from 'axios-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// API Configuration
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PERPLEXITY_BASE_URL = 'https://api.perplexity.ai';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

// Model names
const PERPLEXITY_MODEL = 'llama-3.1-sonar-small-128k-online';
const GEMINI_MODEL = 'gemini-1.5-pro';

// Rate limiting: 60 requests per minute for Perplexity, 15 for Gemini
const perplexityHttp = axios.create({
  baseURL: PERPLEXITY_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

const geminiHttp = axios.create({
  baseURL: GEMINI_BASE_URL,
  timeout: 30000, // 30 second timeout
  params: {
    key: GEMINI_API_KEY,
  },
});

// Apply rate limiting
const rateLimitedPerplexity = RateLimit(perplexityHttp, { maxRequests: 60, perMilliseconds: 60000 });
const rateLimitedGemini = RateLimit(geminiHttp, { maxRequests: 15, perMilliseconds: 60000 });

// API Key Validation
function validateApiKeys() {
  const errors = [];
  
  if (!PERPLEXITY_API_KEY || !PERPLEXITY_API_KEY.startsWith('pplx-')) {
    errors.push('Invalid Perplexity API key: Must start with "pplx-"');
  }
  
  if (!GEMINI_API_KEY) {
    errors.push('Missing Gemini API key');
  }
  
  if (errors.length > 0) {
    throw new Error(`API Configuration Errors: ${errors.join(', ')}`);
  }
  
  console.log('✅ API keys validated successfully');
}

// Health Check
async function healthCheck() {
  try {
    // Test Perplexity
    const perplexityTest = await rateLimitedPerplexity.post(`/chat/completions`, {
      model: PERPLEXITY_MODEL,
      messages: [{ role: 'user', content: 'Say hello' }],
    });
    
    // Test Gemini
    const geminiTest = await rateLimitedGemini.post(`models/${GEMINI_MODEL}:generateContent`, {
      contents: [{ parts: [{ text: 'Say hello' }] }],
    });
    
    return {
      perplexity: { status: 'healthy', response: perplexityTest.status },
      gemini: { status: 'healthy', response: geminiTest.status },
    };
  } catch (error) {
    console.error('Health check failed:', error.message);
    throw new Error(`API Health Check Failed: ${error.message}`);
  }
}

// Perplexity AI Integration
async function callPerplexity(prompt, options = {}) {
  try {
    const response = await rateLimitedPerplexity.post(`/chat/completions`, {
      model: PERPLEXITY_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      stream: false,
    });
    
    return {
      success: true,
      data: response.data.choices[0].message.content,
      usage: response.data.usage,
    };
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded for Perplexity. Please wait and try again.');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout for Perplexity API.');
    }
    throw new Error(`Perplexity API Error: ${error.response?.data?.error?.message || error.message}`);
  }
}

// Gemini AI Integration
async function callGemini(prompt, options = {}) {
  try {
    const response = await rateLimitedGemini.post(`models/${GEMINI_MODEL}:generateContent`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 1000,
      },
    });
    
    const content = response.data.candidates[0].content.parts[0].text;
    
    return {
      success: true,
      data: content,
      usage: { tokens: response.data.usageMetadata },
    };
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded for Gemini. Please wait and try again.');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout for Gemini API.');
    }
    throw new Error(`Gemini API Error: ${error.response?.data?.error?.message || error.message}`);
  }
}

// Main AI Intelligence Service Class
class AIIntelligenceService {
  constructor() {
    validateApiKeys();
    console.log('AI Intelligence Service initialized successfully');
  }
  
  async analyzeHazardReport(reportData) {
    const prompt = `Analyze this ocean hazard report: ${JSON.stringify(reportData)}. Provide risk assessment, recommended actions, and urgency level.`;
    
    try {
      // Try Perplexity first, fallback to Gemini
      let result = await callPerplexity(prompt);
      if (!result.success) {
        console.warn('Perplexity failed, falling back to Gemini');
        result = await callGemini(prompt);
      }
      
      return result;
    } catch (error) {
      console.error('Hazard analysis failed:', error.message);
      throw error;
    }
  }
  
  async generateAlertMessage(hazardType, location, severity) {
    const prompt = `Generate a concise public alert message for ${hazardType} at ${location} with severity ${severity}. Include safety instructions.`;
    
    try {
      let result = await callPerplexity(prompt, { maxTokens: 200 });
      if (!result.success) {
        result = await callGemini(prompt, { maxTokens: 200 });
      }
      
      return result.data;
    } catch (error) {
      console.error('Alert generation failed:', error.message);
      throw error;
    }
  }
  
  async healthCheck() {
    return await healthCheck();
  }
}

// Export the service
export default new AIIntelligenceService();

// For Firebase integration notes:
// Ensure Firebase indexes are created via console for queries like:
// - hazards (composite: status, createdAt)
// - alerts (composite: active, timestamp)
// Refer to error messages for exact index creation links.
