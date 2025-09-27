# Taranga Ocean Hazard Monitor - API Documentation

## 🌐 APIs and Integrations Used

### 1. Firebase Services (Primary Backend)

#### Firebase Authentication
- **Purpose:** User registration, login, and session management
- **Features Used:**
  - Email/password authentication
  - User profile management
  - Role-based access control (Citizens, Officials, Analysts, Volunteers)
  - Real-time authentication state monitoring

#### Firebase Firestore (Database)
- **Purpose:** Real-time NoSQL database for all application data
- **Collections:**
  - `users` - User profiles and authentication data
  - `hazardReports` - Ocean hazard reports with location and media
  - `socialMediaPosts` - Processed social media content with sentiment analysis
  - `donations` - Donation records and transaction data
  - `volunteers` - Volunteer registrations and assignments
  - `volunteerTasks` - Task management for volunteer coordination
  - `notifications` - Real-time alerts and notifications
  - `resourceRequests` - Emergency resource and supply requests

#### Firebase Cloud Storage
- **Purpose:** Media file storage for hazard reports
- **Features:**
  - Photo/video uploads from hazard reports
  - Automatic file compression and optimization
  - Secure download URLs with Firebase Authentication

### 2. Mapping and Geospatial APIs

#### React-Leaflet (Primary Mapping)
- **Purpose:** Interactive maps with hazard visualization
- **Features:**
  - Real-time hazard marker display
  - Alert zone overlays with radius visualization
  - Custom icons for different hazard types
  - Layer controls for filtering data
  - Click events for report details

#### OpenStreetMap Tiles
- **Purpose:** Base map tiles for the interactive map
- **API:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Features:**
  - Free, open-source mapping data
  - Global coverage including Indian coastal regions
  - No API key required

#### Geolib
- **Purpose:** Geospatial calculations and utilities
- **Features:**
  - Distance calculations between coordinates
  - Location-based filtering of reports
  - Radius-based alert zone calculations

### 3. Natural Language Processing APIs

#### Sentiment.js
- **Purpose:** Sentiment analysis of social media content
- **Features:**
  - Real-time sentiment scoring (positive/negative/neutral)
  - Keyword extraction from text content
  - Comparative sentiment analysis
  - Ocean hazard-specific keyword detection

#### Compromise.js
- **Purpose:** Natural language processing and text analysis
- **Features:**
  - Text parsing and linguistic analysis
  - Keyword extraction and categorization
  - Content relevance scoring

### 4. Social Media Integration (Simulated)

#### Twitter API (Configured for Future Integration)
- **Purpose:** Real-time monitoring of Twitter for ocean hazard mentions
- **Planned Features:**
  - Tweet streaming with keyword filters
  - Hashtag monitoring (#tsunami, #cyclone, #marinealert)
  - User verification status checking
  - Geolocation-based tweet filtering

#### Facebook Graph API (Configured for Future Integration)
- **Purpose:** Monitoring public Facebook posts for hazard information
- **Planned Features:**
  - Public post monitoring
  - Page post analysis
  - Geographic filtering for coastal regions

### 5. Real-time Communication

#### React Hot Toast
- **Purpose:** Real-time notification system
- **Features:**
  - Toast notifications for alerts
  - Customizable notification types (success, error, warning)
  - Priority-based notification display
  - Auto-dismiss with configurable timing

#### Firebase Real-time Listeners
- **Purpose:** Live data synchronization
- **Features:**
  - Real-time report updates
  - Live notification delivery
  - Instant data sync across all connected clients

### 6. Data Management and Querying

#### TanStack React Query
- **Purpose:** Server state management and caching
- **Features:**
  - API response caching
  - Background data refetching
  - Optimistic updates
  - Error boundary handling

#### Axios
- **Purpose:** HTTP client for API requests
- **Features:**
  - Request/response interceptors
  - Error handling
  - Request cancellation
  - Response transformation

### 7. Date and Time Processing

#### Date-fns
- **Purpose:** Date manipulation and formatting
- **Features:**
  - Timestamp formatting for reports
  - Time range calculations
  - Relative time display
  - Timezone handling

### 8. Mobile and PWA APIs

#### Service Worker API
- **Purpose:** Progressive Web App functionality
- **Features:**
  - Offline data caching
  - Background sync for reports
  - Push notification handling
  - App installation prompts

#### Geolocation API
- **Purpose:** Location services for hazard reporting
- **Features:**
  - GPS coordinate capture
  - Location-based report tagging
  - Automatic location detection

#### Camera API (Planned)
- **Purpose:** Photo/video capture for hazard documentation
- **Features:**
  - Direct camera access
  - Media file compression
  - Automatic upload to Firebase Storage

## 🔒 Security and Authentication

### Environment Variables Required
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Security Features
- Firebase Security Rules for data access control
- Role-based permissions for different user types
- Secure file upload with authentication
- HTTPS-only communication
- XSS and CSRF protection

## 📱 Deployment APIs

### Vercel Platform API
- **Purpose:** Production deployment and hosting
- **Features:**
  - Automatic builds from Git
  - Global CDN distribution
  - Environment variable management
  - Custom domain support

### PWA Manifest API
- **Purpose:** Mobile app installation
- **Features:**
  - App metadata configuration
  - Icon and splash screen setup
  - Install prompts and app shortcuts

## 🔄 Data Flow Architecture

1. **User Input** → React Components → Firebase Services
2. **Real-time Updates** → Firestore Listeners → React State → UI Updates
3. **Media Upload** → Firebase Storage → Secure URLs → Database References
4. **Geolocation** → Browser Geolocation API → Report Coordinates → Map Display
5. **Notifications** → Firebase → React Hot Toast → User Interface

All APIs are integrated to provide a seamless, real-time ocean hazard monitoring experience with comprehensive data collection, analysis, and response coordination capabilities.