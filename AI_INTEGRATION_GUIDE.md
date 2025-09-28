# AI Integration Guide for Tarang Ocean Hazards Monitoring System

This guide provides comprehensive troubleshooting and configuration instructions for integrating AI services (Perplexity, Gemini) and Firebase into the Tarang Ocean Hazards Monitoring System. It addresses common API configuration issues, error handling, and best practices for smooth operation.

## Prerequisites

- Node.js >= 16.0.0
- Valid API keys for:
  - Perplexity AI (starts with `pplx-`)
  - Google Gemini AI
- Firebase project setup with Firestore enabled
- Backend server running on port 3000
- Frontend dev server running on port 5173 (via `npm run dev`)

## Setup Instructions

### 1. Environment Configuration (.env)

Create or update your `.env` file in the project root with the following variables:

```
# AI Services
PERPLEXITY_API_KEY=pplx-your-key-here
GEMINI_API_KEY=AIza-your-gemini-key-here

# Firebase
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=your-app-id

# Backend
PORT=3000
JWT_SECRET=your-jwt-secret
DATABASE_URL=sqlite:./database.db  # Or your DB connection string

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100
```

**Important Notes:**
- Perplexity keys **must** start with `pplx-`. If yours doesn't, generate a new one from the Perplexity dashboard.
- Gemini keys start with `AIza`. Ensure it's the correct API key for the Generative Language API.
- Never commit `.env` to Git. It's already in `.gitignore`.

### 2. Install Dependencies

Run the following to ensure all required packages are installed:

```bash
npm install
npm install dotenv axios @google/generative-ai perplexity-ai firebase
```

### 3. Firebase Setup

#### a. Initialize Firebase
Update `src/config/firebase.js` with your project credentials from the Firebase Console.

#### b. Create Required Indexes
Firestore requires indexes for complex queries. If you encounter errors like "The query requires an index", follow these steps:

1. Go to [Firebase Console](https://console.firebase.google.com/) > Your Project > Firestore Database > Indexes tab.
2. Click "Create Index" and configure based on error messages:
   - **For hazard reports queries:** Collection: `hazards`, Fields: `location` (Ascending), `timestamp` (Descending), `status` (Ascending)
   - **For user roles:** Collection: `users`, Fields: `role` (Ascending), `email` (Ascending)
   - **For alerts:** Collection: `alerts`, Fields: `severity` (Descending), `createdAt` (Descending)

Example error link format: `https://console.firebase.google.com/project/your-project/database/firestore/indexes?create_composite=YOUR_INDEX_SPEC`

3. Click the link in your error logs to auto-create the index.

#### c. Security Rules
Update Firestore rules in the console for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Role-based access for hazards
    match /hazards/{hazardId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['official', 'analyst'];
    }
    
    // Public read for alerts
    match /alerts/{alertId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```

### 4. AI Services Configuration

#### Perplexity AI
- **Model:** `llama-3.1-sonar-small-128k-online` (updated for 2024)
- **Endpoint:** `https://api.perplexity.ai/chat/completions`
- **Usage:** Integrated in `services/aiIntelligenceService.js` for hazard analysis and report generation.

#### Google Gemini
- **Model:** `gemini-1.5-pro` (avoid `-latest` for stability)
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`
- **Usage:** Fallback for sentiment analysis and natural language processing.

### 5. Backend Server Setup

1. Start the backend:
   ```bash
   npm start  # Or node index.js if configured
   ```

2. Verify health check:
   ```bash
   curl http://localhost:3000/api/ai/health
   ```
   Expected response: `{"status": "healthy", "services": {"perplexity": "connected", "gemini": "connected"}}`

### 6. Frontend Setup

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:5173` in your browser.

3. Test connections:
   - Login with test credentials (admin@test.com / password123 for official/analyst roles)
   - Navigate to dashboards and verify API calls (check browser console for errors)

## Troubleshooting Common Issues

### API Key Errors (401 Unauthorized)
- **Symptom:** `Invalid API key` or `Authentication failed`
- **Fix:**
  1. Verify keys in `.env` (no extra spaces/quotes)
  2. Regenerate keys from respective dashboards
  3. Restart server: `npm start`
  4. Run test: `node test-ai-config.js`

### Rate Limiting (429 Too Many Requests)
- **Symptom:** `Rate limit exceeded`
- **Fix:**
  1. Implemented in `services/aiIntelligenceService.js` with 100 requests/15min window
  2. Wait 15 minutes or upgrade to paid plan
  3. Monitor usage in API dashboards

### Timeout Errors
- **Symptom:** Request hangs or times out
- **Fix:**
  - Default timeout: 30 seconds (configurable in service)
  - Check internet connection
  - Use fallback AI service if primary fails

### Firebase Errors
- **Index Missing (400 Bad Request):**
  - Click the console link in error message to create index
  - Wait 1-2 minutes for indexing to complete

- **Permission Denied (403):**
  - Update security rules as shown above
  - Ensure user is authenticated

- **Quota Exceeded:**
  - Upgrade Firebase plan or optimize queries

### Model Name Errors
- **Symptom:** `Model not found`
- **Fix:**
  - Perplexity: Use `llama-3.1-sonar-small-128k-online`
  - Gemini: Use `gemini-1.5-pro`
  - Check API documentation for latest models

### Server Connection Issues
- **Symptom:** Frontend can't reach backend APIs (CORS errors)
- **Fix:**
  1. Ensure backend runs on port 3000
  2. Check `index.js` for CORS middleware
  3. For production, update frontend proxy in `vite.config.js`

## Testing Your Configuration

Run the automated test script:

```bash
node test-ai-config.js
```

**Expected Output (with valid keys and server running):**
```
🚀 Starting AI Configuration Tests...

🔍 Testing API Key Validation... ✅ PASS
🏥 Testing AI Service Health Check... ✅ PASS
🌊 Testing Hazard Analysis... ✅ PASS
📝 Testing Report Generation... ✅ PASS

📊 Test Results: 4/4 tests passed
🎉 All tests passed! Your AI configuration is working correctly.
```

**If tests fail:**
- Follow the "Common fixes" in the output
- Check server logs for detailed errors
- Verify `.env` file location and format

## Key Features Implemented

- **API Key Validation:** Automatic checks on startup
- **Error Handling:** Specific messages for 401, 429, 500 errors
- **Rate Limiting:** Prevents abuse and API bans
- **Fallback Mechanisms:** Gemini as backup for Perplexity
- **Health Checks:** `/api/ai/health` endpoint for monitoring
- **Timeout Management:** 30s default with retries

## Production Deployment

### Vercel (Recommended)
1. Update `vercel.json` for backend routes
2. Set environment variables in Vercel dashboard
3. Deploy: `vercel --prod`

### Firebase Hosting (Frontend Only)
1. Build: `npm run build`
2. Deploy: `firebase deploy`

### Monitoring
- Use Firebase Analytics for usage tracking
- Set up error reporting with Sentry
- Monitor API quotas in respective dashboards

## Support

If issues persist:
1. Run `node test-ai-config.js` and share output
2. Check browser console and server logs
3. Verify API keys haven't expired
4. Contact support@perplexity.ai or Google Cloud support

**Last Updated:** October 2024
**Version:** 2.0.0

---

This guide ensures reliable AI integration for ocean hazard monitoring. For custom modifications, refer to `services/aiIntelligenceService.js`.
