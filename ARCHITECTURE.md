# 🏗️ Taranga Ocean Hazard Monitoring System - Complete Architecture

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Component Architecture](#component-architecture)
6. [Database Schema](#database-schema)
7. [Deployment Architecture](#deployment-architecture)
8. [Security Architecture](#security-architecture)
9. [Real-time Architecture](#real-time-architecture)
10. [AI/ML Architecture](#aiml-architecture)

---

## 🌊 System Overview

The Taranga Ocean Hazard Monitoring System is a comprehensive web application designed to monitor, analyze, and respond to ocean-related hazards through real-time social media monitoring, interactive mapping, and automated alert systems.

### 🎯 Core Features
- **Real-time Social Media Monitoring** - Twitter, Reddit, and custom API integration
- **Interactive Hazard Mapping** - Leaflet-based maps with hotspot visualization
- **Artificial Hotspot Generation** - Synthetic report generation for testing
- **Automated Alert System** - AI-powered risk assessment and notifications
- **Multi-user Dashboard** - Citizen, analyst, and official interfaces
- **Volunteer Management** - Registration and task assignment system

---

## 💻 Technology Stack

### Frontend (Client-Side)
```javascript
// Core Framework
React 18.2.0 - Modern React with hooks and functional components
React Router DOM 6.26.2 - Client-side routing
React Hot Toast 2.6.0 - Toast notifications

// State Management
React Context API - Global state management
@tanstack/react-query 5.87.1 - Server state management and caching

// UI & Mapping
CSS3 - Custom responsive styling
Leaflet 1.9.4 - Interactive maps
React Leaflet 4.2.1 - React wrapper for Leaflet
Mapbox GL 3.14.0 - Advanced mapping features
```

### Backend (Server-Side)
```javascript
// Runtime Environment
Node.js - Server-side JavaScript runtime
Express.js 5.1.0 - Web application framework

// Database & Storage
Firebase Firestore 12.2.1 - NoSQL document database
Firebase Auth 12.2.1 - Authentication service
Firebase Storage 12.2.1 - File storage
MongoDB (Mongoose 8.18.0) - Alternative database option

// Real-time Communication
Socket.IO 4.8.1 - WebSocket communication
Server-Sent Events - Real-time updates
```

### AI/ML & NLP
```javascript
// Natural Language Processing
Sentiment 5.0.2 - Sentiment analysis library
Natural 8.1.0 - Natural language processing
Compromise 14.14.4 - NLP toolkit

// Geospatial Processing
Geolib 3.3.4 - Geographic calculations
Leaflet Maps - Interactive mapping

// Data Processing
Date-fns 4.1.0 - Date manipulation
Node-cron 4.2.1 - Scheduled tasks
```

### Development & Deployment
```javascript
// Build & Development
Vite 5.0.0 - Fast development server
TypeScript 5.2.2 - Type safety
ESLint - Code linting

// Deployment Platforms
Vercel - Frontend deployment
Replit - Development environment
Docker - Containerization (potential)

// Monitoring & Analytics
Morgan 1.10.1 - HTTP request logger
Custom analytics - Built-in monitoring
```

---

## 🏛️ System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT APPLICATIONS                            │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ Web Browser │  │ Mobile App      │  │ Admin Dashboard │              │
│  │ (React SPA) │  │ (Future)        │  │ (React)         │              │
│  └─────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
           │                    │                    │
           │                    │                    │
           ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ Load        │  │ Rate Limiting   │  │ Authentication  │              │
│  │ Balancer    │  │ Middleware      │  │ Middleware      │              │
│  └─────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION SERVER                             │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ Express.js  │  │ Socket.IO       │  │ REST APIs       │              │
│  │ Server      │  │ Server          │  │ Endpoints       │              │
│  └─────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          SERVICE LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ Auth        │  │ Social Media    │  │ Hazard Reports  │              │
│  │ Service     │  │ Service         │  │ Service         │              │
│  └─────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ Firestore   │  │ External APIs   │  │ Cache Layer     │              │
│  │ Database    │  │ (Twitter/Reddit)│  │ (Redis Future)  │              │
│  └─────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Architecture Explanation

**Client Applications Layer**
- **Web Browser**: Main React SPA accessible via modern browsers
- **Mobile App**: Future React Native implementation for mobile devices
- **Admin Dashboard**: Specialized interface for system administrators

**API Gateway Layer**
- **Load Balancer**: Distributes incoming requests across multiple server instances
- **Rate Limiting**: Prevents API abuse with configurable request limits
- **Authentication**: JWT token validation and user session management

**Application Server Layer**
- **Express.js Server**: Handles HTTP requests and API routing
- **Socket.IO Server**: Manages WebSocket connections for real-time features
- **REST APIs**: Provides structured endpoints for all system functionality

**Service Layer**
- **Auth Service**: User authentication, authorization, and session management
- **Social Media Service**: External API integration and data processing
- **Hazard Reports Service**: Report management and geospatial analysis

**Data Layer**
- **Firestore Database**: Primary NoSQL database for application data
- **External APIs**: Third-party services (Twitter, Reddit, Weather APIs)
- **Cache Layer**: Future Redis implementation for performance optimization

---

## 🔄 Data Flow Architecture

### Real-time Data Ingestion Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Social Media  │───▶│   NLP Engine    │───▶│   Database      │
│   APIs          │    │   Processing    │    │   Storage       │
│                 │    │                 │    │                 │
│ • Twitter API   │    │ • Keyword       │    │ • Firestore     │
│ • Reddit API    │    │   Extraction    │    │   Collections   │
│ • Custom APIs   │    │ • Sentiment     │    │ • Real-time     │
│                 │    │   Analysis      │    │   Updates       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Hotspot       │    │   Alert         │    │   UI Updates    │
│   Generation    │    │   System        │    │                 │
│                 │    │                 │    │ • React         │
│ • Clustering    │    │ • Risk          │    │   Components    │
│ • Intensity     │    │   Assessment    │    │ • Real-time     │
│   Calculation   │    │ • Priority      │    │   Maps          │
│                 │    │   Scoring       │    │ • Notifications │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow Explanation

**1. Data Ingestion**
- Social media APIs continuously fetch new posts and content
- Custom APIs accept user-submitted hazard reports
- All data passes through NLP processing for analysis

**2. Processing Pipeline**
- **Keyword Extraction**: Identifies hazard-related terms and phrases
- **Sentiment Analysis**: Determines emotional tone and urgency
- **Geospatial Processing**: Extracts and normalizes location data
- **Relevance Scoring**: Calculates importance based on multiple factors

**3. Storage & Analysis**
- Processed data stored in Firestore collections
- Real-time listeners trigger immediate processing
- Historical data maintained for trend analysis

**4. Response Generation**
- Hotspot clustering algorithm groups related reports
- Alert system evaluates risk and generates notifications
- UI components receive real-time updates via WebSocket

---

## 🧩 Component Architecture

### Frontend Component Structure

```
src/
├── components/                 # Reusable UI Components
│   ├── Navigation.jsx         # Main navigation bar
│   ├── InteractiveMap.jsx     # Leaflet map component
│   ├── CreateReportForm.jsx   # Hazard report form
│   └── ...
├── pages/                     # Page-level components
│   ├── HomePage.jsx          # Landing page
│   ├── SocialMediaMonitoring.jsx  # Social media dashboard
│   ├── CitizenDashboard.jsx  # Citizen interface
│   ├── AnalyticsDashboard.jsx     # Analytics interface
│   └── ...
├── services/                  # API service layer
│   ├── authService.js        # Authentication API calls
│   ├── socialMediaService.js # Social media API calls
│   ├── hazardReportService.js    # Hazard report API calls
│   └── ...
├── contexts/                  # React Context providers
│   └── AppContext.jsx        # Global application state
└── utils/                     # Utility functions
    ├── syntheticReportGenerator.js  # AI report generation
    └── geoUtils.js           # Geospatial utilities
```

### Backend Service Structure

```
├── routes/                    # API route handlers
│   ├── auth.js              # Authentication routes
│   ├── socialMedia.js       # Social media routes
│   ├── hazards.js           # Hazard report routes
│   └── ...
├── services/                 # Business logic layer
│   ├── realTimeService.js   # WebSocket management
│   ├── alertService.js      # Alert generation
│   ├── socialMediaService.js    # External API integration
│   └── ...
├── middleware/               # Express middleware
│   ├── auth.js             # Authentication middleware
│   └── ...
└── config/                  # Configuration files
    └── database.js         # Database configuration
```

### Component Interaction Flow

```
User Action → React Component → API Service → Backend Route → Business Logic → Database → Real-time Broadcast → UI Update
     ↓            ↓              ↓            ↓              ↓            ↓            ↓              ↓
Click Button → Form Submit → HTTP POST → Route Handler → Validation → Firestore → Socket.IO → Component State
```

---

## 🗄️ Database Schema

### Firestore Collections

#### Social Media Posts Collection
```javascript
{
  id: "post_123456",
  content: "Cyclone warning for Chennai coast...",
  platform: "twitter",
  author: "WeatherAlert",
  timestamp: "2024-01-15T10:30:00Z",
  processedAt: "2024-01-15T10:31:00Z",
  sentiment: {
    label: "negative",
    score: -5,
    comparative: -0.25,
    positive: 2,
    negative: 8
  },
  keywords: ["cyclone", "warning", "chennai", "coast"],
  location: {
    name: "Chennai",
    lat: 13.0827,
    lng: 80.2707
  },
  relevanceScore: 95,
  isHazardRelated: true,
  engagement: {
    likes: 150,
    shares: 45,
    comments: 23
  }
}
```

#### Hazard Reports Collection
```javascript
{
  id: "hr_001",
  title: "High Tide Alert - Marina Beach",
  type: "tidal_surge",
  severity: "high",
  status: "active",
  location: {
    latitude: 13.0499,
    longitude: 80.2824,
    address: "Marina Beach, Chennai, Tamil Nadu",
    district: "Chennai",
    state: "Tamil Nadu"
  },
  description: "Unusually high tides observed...",
  reportedBy: {
    id: "user_001",
    name: "Coastal Observer",
    type: "citizen"
  },
  reportedAt: "2024-01-15T08:00:00Z",
  verifiedAt: "2024-01-15T09:00:00Z",
  affectedArea: "2.5 km stretch",
  estimatedAffectedPopulation: 15000
}
```

#### Hotspots Collection
```javascript
{
  id: "hotspot_123",
  center: [13.0827, 80.2707],
  intensity: "high",
  reportCount: 5,
  radius: 25000,
  reports: ["hr_001", "hr_002", "hr_003"],
  dominantTypes: ["cyclone", "flood"],
  lastUpdated: "2024-01-15T10:30:00Z",
  createdAt: "2024-01-15T09:00:00Z"
}
```

---

## 🚀 Deployment Architecture

### Development Environment
```
┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Vite Dev    │  │ Express     │  │ Firebase    │              │
│  │ Server      │  │ Server      │  │ Emulator    │              │
│  │ (port 5173) │  │ (port 3001) │  │ (port 8080) │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Production Environment
```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Vercel      │  │ Replit      │  │ Firebase    │              │
│  │ (Frontend)  │  │ (Backend)   │  │ (Database)  │              │
│  │             │  │             │  │             │              │
│  │ CDN         │  │ Node.js     │  │ Firestore   │              │
│  │ Delivery    │  │ Runtime     │  │ Real-time   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Scalability Features
- **Horizontal Scaling**: Multiple Express server instances
- **Database Auto-scaling**: Firestore automatic scaling
- **CDN Integration**: Static asset delivery via Vercel
- **Load Balancing**: Request distribution across instances

---

## 🔒 Security Architecture

### Authentication Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Login    │───▶│   JWT Token     │───▶│   Protected     │
│                 │    │   Generation    │    │   Routes        │
│ • Email/Password│    │                 │    │                 │
│ • Social Login  │    │ • 24h Expiry    │    │ • API Access    │
│ • MFA (Future)  │    │ • Secure Hash   │    │ • Role-based    │
│                 │    │                 │    │   Authorization │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Measures
- **Helmet.js**: Security headers and XSS protection
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Request sanitization and validation
- **JWT Authentication**: Secure token-based authentication

---

## 📡 Real-time Architecture

### WebSocket Communication
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │◀──▶│   Socket.IO     │◀──▶│   Server        │
│   Connection    │    │   Server        │    │   Events        │
│                 │    │                 │    │                 │
│ • Auto-reconnect│    │ • Room          │    │ • Event         │
│ • Heartbeat     │    │   Management    │    │   Broadcasting  │
│ • Error Handling│    │ • Message       │    │ • State         │
│                 │    │   Queue         │    │   Management    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Real-time Features
- **Live Hazard Updates**: Real-time report notifications
- **Social Media Stream**: Live social media post updates
- **Alert Broadcasting**: Immediate emergency notifications
- **User Presence**: Online status and activity tracking

---

## 🤖 AI/ML Architecture

### NLP Processing Pipeline
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Raw Text      │───▶│   Sentiment     │───▶│   Hazard        │
│   Input         │    │   Analysis      │    │   Classification│
│                 │    │                 │    │                 │
│ • Social Posts  │    │ • Score         │    │ • Type          │
│ • User Reports  │    │   Calculation   │    │   Detection     │
│ • Comments      │    │ • Label         │    │ • Severity      │
│                 │    │   Assignment    │    │   Assessment    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Machine Learning Features
- **Sentiment Analysis**: Emotional tone detection
- **Keyword Extraction**: Hazard-related term identification
- **Content Classification**: Automatic categorization
- **Risk Assessment**: Automated severity scoring
- **Anomaly Detection**: Unusual pattern identification

---

## 📊 Performance Architecture

### Caching Strategy
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │───▶│   React Query   │───▶│   Memory        │
│   Data          │    │   Cache         │    │   Cache         │
│                 │    │                 │    │                 │
│ • API Responses │    │ • Client-side   │    │ • Session       │
│ • User Data     │    │   Caching       │    │   Storage       │
│ • Static Content│    │ • Background    │    │ • Application   │
│                 │    │   Updates       │    │   State         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Performance Optimizations
- **Code Splitting**: Route-based component loading
- **Image Optimization**: Lazy loading and compression
- **API Response Caching**: Client-side data caching
- **Database Query Optimization**: Efficient Firestore queries
- **Real-time Data Streaming**: WebSocket-based updates

---

## 🔧 Development Workflow

### Git Workflow
```
main ──────── develop ──────── feature/synthetic-hotspots
   │              │                    │
   │              │                    │
   ▼              ▼                    ▼
Production   Staging           Development
Deployment   Testing           Feature Work
```

### CI/CD Pipeline
- **Development**: Automatic deployment to staging
- **Testing**: Automated test execution
- **Production**: Manual approval and deployment
- **Monitoring**: Performance and error tracking

---

## 📈 Monitoring & Analytics

### System Monitoring
- **Application Performance**: Response times and error rates
- **Database Performance**: Query performance and storage usage
- **Real-time Metrics**: WebSocket connections and message rates
- **User Analytics**: Feature usage and engagement metrics

### Error Tracking
- **Client-side Errors**: React error boundaries
- **Server-side Errors**: Express error handling middleware
- **Database Errors**: Firestore error monitoring
- **External API Errors**: Third-party service monitoring

---

This comprehensive architecture provides a robust, scalable foundation for the Taranga Ocean Hazard Monitoring System, supporting real-time data processing, AI-powered analysis, and multi-platform deployment.


-----
To install dependencies on another device to make the project work, you should follow these steps:

Ensure you have Node.js and npm installed on the device.

Copy the project files, including the package.json and package-lock.json files.

Open a terminal in the project root directory.

Run the command:


npm install

This will install all the dependencies listed in package.json.

After installation, you can start the development server or build the project as needed using the scripts defined in package.json, for example:


npm run dev

to start the development server.