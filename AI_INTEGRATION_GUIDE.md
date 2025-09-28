# AI Integration Troubleshooting Guide

## Immediate Action Items

1. **Update your API keys** in `.env`:
   - Perplexity keys must start with `pplx-`
   - Get fresh keys if yours are invalid

2. **Update model names**:
   - Perplexity: `sonar-pro`
   - Gemini: `gemini-1.5-pro` (not `gemini-1.5-pro-latest`)

3. **Create Firebase indexes** by clicking the console links in your error messages

4. **Test your configuration** with the provided test script

## How to Create Firebase Indexes

If you encounter errors like "The query requires an index" when running queries in Firestore (e.g., for hazards or alerts), follow these steps to create the required indexes:

### Step-by-Step Guide

1. **Access Firebase Console**:
   - Go to [Firebase Console](https://console.firebase.google.com/).
   - Select your project (Tarang Ocean Hazards Monitoring System).

2. **Navigate to Firestore Database**:
   - In the left sidebar, click **Firestore Database**.
   - Ensure you're in the correct project and database mode (Native or Datastore—use Native for Firestore).

3. **Go to Indexes Tab**:
   - Click on the **Indexes** tab (next to Rules and Data).

4. **Create a New Index**:
   - Click **Create Index**.
   - Fill in the details based on the error message (it will provide a direct link or details):
     - **Collection ID**: e.g., `hazards` or `alerts`.
     - **Fields**:
       - For hazards queries (e.g., filter by status and order by createdAt):
         - Field 1: `status` (Ascending).
         - Field 2: `createdAt` (Descending).
       - For alerts queries (e.g., filter by active and order by timestamp):
         - Field 1: `active` (Ascending).
         - Field 2: `timestamp` (Descending).
     - **Query Scope**: Collection (default for most cases).
   - Click **Create**.

5. **Wait for Index to Build**:
   - Indexes may take a few minutes to build (status shows "Building" → "Enabled").
   - Once enabled, retry your query—the error should resolve.

### Common Indexes for This Project
Based on typical queries in the services:
- **Hazards Collection**:
  - Composite: `status` (asc) + `createdAt` (desc) – For fetching pending/verified reports ordered by time.
- **Alerts Collection**:
  - Composite: `active` (asc) + `timestamp` (desc) – For active alerts ordered by recency.
- **Users/Volunteers**: If needed, `role` (asc) + `createdAt` (desc).

### Troubleshooting Index Errors
- **Error Message**: Look for "FAILED_PRECONDITION: The query requires an index. You can create it here: [link]".
  - Click the link—it auto-fills the index form in the console.
- **Index Not Found**: If no link, manually create as above using query fields from your code (e.g., in hazardService.js or realTimeService.js).
- **Permissions**: Ensure your Firebase project has billing enabled for production queries (free tier limits apply).
- **Test**: After creation, run `node test-ai-service.js` or backend queries to verify.

If errors persist, share the exact error message for specific guidance.

## Key Fixes Made

- ✅ **Proper API key validation** on service initialization
- ✅ **Updated API endpoints** and request formats for 2024
- ✅ **Enhanced error handling** with specific error messages
- ✅ **Rate limiting** to prevent 429 errors
- ✅ **Timeout handling** to prevent hanging requests
- ✅ **Health check method** to verify API connectivity

The server is running correctly - these are just configuration issues with external services that should be resolved once you update your API keys and endpoints.
