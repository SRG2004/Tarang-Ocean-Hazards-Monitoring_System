# AI Integration Troubleshooting Guide

## Immediate Action Items

1. **Update your API keys** in `.env`:
   - Perplexity keys must start with `pplx-`
   - Get fresh keys if yours are invalid

2. **Update model names**:
   - Perplexity: `llama-3.1-sonar-small-128k-online`
   - Gemini: `gemini-1.5-pro` (not `gemini-1.5-pro-latest`)

3. **Create Firebase indexes** by clicking the console links in your error messages

4. **Test your configuration** with the provided test script

## Key Fixes Made

- ✅ **Proper API key validation** on service initialization
- ✅ **Updated API endpoints** and request formats for 2024
- ✅ **Enhanced error handling** with specific error messages
- ✅ **Rate limiting** to prevent 429 errors
- ✅ **Timeout handling** to prevent hanging requests
- ✅ **Health check method** to verify API connectivity

The server is running correctly - these are just configuration issues with external services that should be resolved once you update your API keys and endpoints.
