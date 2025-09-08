# Taranga Ocean Hazard Monitor - System Requirements

## System Requirements

### Runtime Environment
- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **Operating System**: Linux, macOS, or Windows
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: At least 1GB free space

## Dependencies

### Core Dependencies
```json
{
  "@tanstack/react-query": "^5.87.1",
  "axios": "^1.11.0",
  "bcryptjs": "^3.0.2",
  "compression": "^1.8.1",
  "compromise": "^14.14.4",
  "cors": "^2.8.5",
  "date-fns": "^4.1.0",
  "dotenv": "^17.2.2",
  "express": "^5.1.0",
  "express-rate-limit": "^8.1.0",
  "firebase": "^12.2.1",
  "firebase-admin": "^13.5.0",
  "geolib": "^3.3.4",
  "helmet": "^8.1.0",
  "jsonwebtoken": "^9.0.2",
  "leaflet": "^1.9.4",
  "mapbox-gl": "^3.14.0",
  "mongoose": "^8.18.0",
  "morgan": "^1.10.1",
  "multer": "^2.0.2",
  "natural": "^8.1.0",
  "node-cron": "^4.2.1",
  "node-fetch": "^3.3.2",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-hot-toast": "^2.6.0",
  "react-leaflet": "^4.2.1",
  "react-map-gl": "^8.0.4",
  "react-router-dom": "^6.26.2",
  "sentiment": "^5.0.2",
  "snoowrap": "^1.23.0",
  "socket.io": "^4.8.1"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.2.37",
  "@types/react-dom": "^18.2.15",
  "@vitejs/plugin-react": "^4.2.0",
  "typescript": "^5.2.2",
  "vite": "^5.0.0"
}
```

## Environment Variables

### Firebase Configuration (Required)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Social Media API Keys (Optional but Recommended)
```env
# TwitterAPI.io (Alternative Twitter API - $0.15/1K tweets)
TWITTERAPI_IO_KEY=your_twitterapi_io_key

# Reddit API (Free)
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
```

### Server Configuration (Optional)
```env
PORT=3001
FRONTEND_URL=http://localhost:5000
NODE_ENV=production
```

## External Services Setup

### 1. Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing
3. Enable the following services:
   - **Authentication**: Email/Password provider
   - **Firestore Database**: In production mode
   - **Storage**: For file uploads
4. Get configuration from Project Settings → General → Your apps
5. Add the Firebase config to environment variables

### 2. TwitterAPI.io (Optional)
1. Visit [TwitterAPI.io](https://twitterapi.io)
2. Sign up for an account
3. Choose a plan (starts at $0.15/1K tweets)
4. Get your API key from the dashboard
5. Add `TWITTERAPI_IO_KEY` to environment variables

### 3. Reddit API (Optional)
1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Create a new app (select "web app" type)
3. Note down the client ID and client secret
4. Add `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` to environment variables

## Installation Steps

### 1. Clone and Install
```bash
git clone <repository-url>
cd taranga-ocean-hazard-monitor
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Add your API keys and configuration to .env file
nano .env
```

### 3. Build Frontend
```bash
npm run build
```

### 4. Start Services

#### Development Mode
```bash
# Terminal 1: Frontend Development Server
npm run dev

# Terminal 2: Backend API Server
node server.js
```

#### Production Mode
```bash
# Build and start production server
npm run build
node server.js
```

## Port Configuration
- **Frontend Development**: http://localhost:5000
- **Backend API**: http://localhost:3001
- **Production**: Backend serves both API and frontend from port 3001

## Database Collections

### Firebase Firestore Collections
- `users` - User profiles and authentication data
- `hazardReports` - Ocean hazard reports with location data
- `socialMediaPosts` - Processed social media content with sentiment analysis
- `donations` - Donation records and campaign data
- `volunteers` - Volunteer registrations and task assignments
- `volunteerTasks` - Task management for volunteers
- `notifications` - Real-time alerts and notifications
- `resourceRequests` - Emergency resource requests

## Security Configuration

### Rate Limiting
- API endpoints: 100 requests per 15 minutes per IP
- Authentication required for most endpoints
- Role-based access control (Citizens, Volunteers, Officials, Analysts)

### CORS Configuration
- Configured for cross-origin requests
- Frontend URL whitelisted
- Credentials support enabled

## Troubleshooting

### Common Issues

#### Firebase Connection Errors
- Verify all Firebase environment variables are set correctly
- Check Firebase project permissions
- Ensure Firestore is initialized in production mode

#### Social Media API Errors  
- Verify API keys are valid and have sufficient credits
- Check API rate limits
- Ensure network connectivity to external APIs

#### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version compatibility
- Verify all environment variables are properly set

#### Port Conflicts
- Frontend development server uses port 5000
- Backend server uses port 3001
- Change ports in configuration if conflicts occur

## Performance Optimization

### Production Recommendations
- Enable compression middleware (already configured)
- Use production build of React (`npm run build`)
- Configure CDN for static assets
- Set up monitoring and logging
- Enable HTTPS in production environment

### Monitoring Features
- Real-time social media monitoring every 30 seconds
- Automated alert system for critical hazards
- WebSocket connections for live updates
- Analytics dashboard with real-time data visualization

## Support

For setup assistance or technical issues:
1. Check the troubleshooting section above
2. Verify all environment variables are correctly configured  
3. Ensure all external services (Firebase, APIs) are properly set up
4. Check console logs for specific error messages