# Taranga Ocean Hazard Monitor

## Overview

Taranga is a comprehensive ocean hazard monitoring and reporting platform that enables real-time crowdsourced data collection, social media monitoring, and emergency response coordination for India's coastal regions. The platform serves multiple user roles including citizens, volunteers, officials, and analysts, providing both web and mobile interfaces for hazard reporting, resource management, and situational awareness.

The system integrates Firebase for backend services, interactive mapping capabilities, sentiment analysis for social media monitoring, and a complete donation management system to support disaster response efforts.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### September 27, 2025
- **Complete GitHub Import Setup**: Successfully imported and configured the Taranga Ocean Hazard Monitor project for Replit environment
- **Dependencies**: Installed all npm dependencies including React and TypeScript type definitions
- **Dual Server Architecture**:
  - Backend (Node.js + Express) running on port 3001 with mock authentication system
  - Frontend (React + Vite) running on port 5000 with proper host configuration (0.0.0.0:5000)
- **Environment Configuration**:
  - Vite configured with proper proxy to backend API (/api routes → localhost:3001)
  - Host settings configured for Replit iframe access (allowedHosts: true equivalent)
  - Package.json scripts updated for proper development and production workflows
- **Development Setup**:
  - TypeScript configuration working with all LSP diagnostics resolved
  - Context providers (AuthContext + AppContext) properly configured for authentication
  - Hot module replacement (HMR) working correctly with live updates
  - Workflows configured for both backend and frontend servers
- **Production Deployment**:
  - Deployment configuration set for autoscale target with npm build
  - Production-ready build system with Vite optimization
- **Testing**: Both servers confirmed running successfully on correct ports
- **Project Status**: Fully functional development environment ready for use and deployment

## System Architecture

### Frontend Architecture
- **React 18.2.0** web application built with Vite for fast development and optimized builds
- **Component-based architecture** with modular CSS files for each major page/component
- **Client-side routing** using React Router DOM for navigation between different dashboards
- **Responsive design** optimized for both desktop and mobile web browsers
- **TypeScript configuration** available for type safety (though currently using JSX)

### Authentication & User Management
- **Firebase Authentication** for user registration, login, and session management
- **Role-based access control** supporting four user types: Citizens, Volunteers, Officials, and Analysts
- **User profile management** with Firestore document storage for extended user data
- **Automatic role-based dashboard routing** after successful authentication

### Data Storage & Backend
- **Firebase Firestore** as the primary NoSQL database for storing:
  - User profiles and authentication data
  - Hazard reports with geolocation and media attachments
  - Volunteer registrations and task assignments
  - Donation records and campaign data
  - Social media monitoring data and sentiment analysis
  - Real-time notifications and alerts
- **Firebase Storage** for media file uploads (photos, videos) attached to hazard reports
- **Real-time data synchronization** using Firestore listeners for live updates

### Mapping & Geospatial Features
- **Dual mapping support** with both Leaflet and Mapbox GL implementations
- **Geolib library** for distance calculations and geospatial operations
- **Interactive hazard visualization** with dynamic hotspot generation based on report density
- **Location-based filtering** and search capabilities
- **Geolocation services** for automatic location detection and tagging

### Analytics & Social Media Monitoring
- **Sentiment analysis** using the Sentiment.js library for social media content
- **Natural language processing** with Compromise.js for text analysis
- **Keyword extraction** for ocean hazard-related content identification
- **Social media trend visualization** and dashboard analytics
- **Real-time data processing** for incoming social media feeds

### Notification System
- **React Hot Toast** for real-time in-app notifications
- **Firebase-based notification storage** for persistent messaging
- **Priority-based alert system** with different urgency levels
- **Multi-channel notification delivery** for critical alerts

### Mobile App Generation
- **React Native compatibility** with build scripts for mobile app generation
- **Capacitor integration** configured for cross-platform mobile deployment
- **Offline capability** planning with sync mechanisms for remote areas
- **Mobile-optimized UI** components and responsive design patterns

## External Dependencies

### Firebase Services
- **Firebase Authentication** - User registration, login, and session management
- **Firebase Firestore** - Primary database for all application data
- **Firebase Storage** - Media file storage for report attachments
- **Firebase Hosting** - Potential deployment target for web application

### Mapping & Location Services
- **Mapbox GL JS** - Primary mapping solution with advanced visualization capabilities
- **Leaflet** - Alternative mapping solution for broader browser compatibility
- **React-Leaflet** - React components for Leaflet integration
- **React-Map-GL** - React wrapper for Mapbox GL

### Data Processing & Analytics
- **TanStack React Query** - Server state management and caching
- **Axios** - HTTP client for API requests
- **Sentiment** - JavaScript sentiment analysis library
- **Natural** - Natural language processing toolkit
- **Compromise** - Text processing and linguistic analysis
- **Geolib** - Geospatial calculations and utilities

### UI & User Experience
- **React Router DOM** - Client-side routing and navigation
- **React Hot Toast** - Toast notification system
- **Date-fns** - Date manipulation and formatting utilities

### Development & Build Tools
- **Vite** - Fast build tool and development server
- **TypeScript** - Type checking and development tooling
- **Vitejs Plugin React** - React integration for Vite

### Planned Social Media Integrations
- **Twitter API** - For monitoring tweets related to ocean hazards
- **Facebook Graph API** - For analyzing public posts about coastal events
- **YouTube API** - For processing comments on weather/disaster-related videos

### Mobile Development
- **React Native** - Cross-platform mobile app development
- **Capacitor** - Native mobile app wrapper and plugin system
- **Gradle** - Android build system for APK generation