/**
 * Taranga Ocean Hazard Monitoring System - Backend Server
 * Complete Node.js/Express backend with RESTful APIs, real-time features,
 * and comprehensive ocean hazard data management
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import route modules
import authRoutes from './routes/auth.js';
import hazardRoutes from './routes/hazards.js';
import socialMediaRoutes from './routes/socialMedia.js';
import donationRoutes from './routes/donations.js';
import volunteerRoutes from './routes/volunteers.js';
import analyticsRoutes from './routes/analytics.js';
import notificationRoutes from './routes/notifications.js';

// Import middleware and utilities
import { authenticateToken } from './middleware/auth.js';
import { connectDatabase } from './config/database.js';
import { initializeRealTimeServices } from './services/realTimeService.js';
import { startSocialMediaMonitoring } from './services/socialMediaService.js';
import { startAutomatedAlerts } from './services/alertService.js';

// ES Module setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
app.set('trust proxy', true); // Trust proxy for rate limiting in Replit environment
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

/**
 * Security and Performance Middleware
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"],
    },
  },
}));

app.use(compression());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/hazards', hazardRoutes);
app.use('/api/social-media', socialMediaRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: 'connected',
      realTime: 'active',
      socialMedia: 'monitoring',
      alerts: 'running'
    }
  });
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'Access granted to protected resource',
    user: req.user
  });
});

/**
 * Real-time Socket.IO Events
 */
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join user to their personal room for notifications
  socket.on('join-user-room', (userId) => {
    if (userId) {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined personal room`);
    }
  });
  
  // Join hazard monitoring rooms based on location
  socket.on('join-location-room', (coordinates) => {
    if (coordinates && coordinates.lat && coordinates.lng) {
      const locationRoom = `location-${Math.floor(coordinates.lat)}-${Math.floor(coordinates.lng)}`;
      socket.join(locationRoom);
      console.log(`Client joined location room: ${locationRoom}`);
    }
  });
  
  // Handle hazard report submissions
  socket.on('new-hazard-report', (reportData) => {
    // Broadcast to relevant location rooms
    const locationRoom = `location-${Math.floor(reportData.coordinates.lat)}-${Math.floor(reportData.coordinates.lng)}`;
    socket.to(locationRoom).emit('hazard-alert', {
      type: 'new-report',
      data: reportData,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle volunteer status updates
  socket.on('volunteer-status-update', (data) => {
    socket.broadcast.emit('volunteer-update', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

/**
 * Error Handling Middleware
 */
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate entry',
      field: Object.keys(err.keyPattern)[0]
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routes (non-API routes)

// Catch-all for SPA routing (non-API routes)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      error: 'API route not found',
      path: req.originalUrl
    });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/**
 * Server Initialization
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    console.log('✅ Database connected successfully');
    
    // Initialize real-time services
    initializeRealTimeServices(io);
    console.log('✅ Real-time services initialized');
    
    // Start social media monitoring
    await startSocialMediaMonitoring();
    console.log('✅ Social media monitoring started');
    
    // Start automated alert system
    startAutomatedAlerts(io);
    console.log('✅ Automated alert system started');
    
    // Start server
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🌊 Taranga Ocean Hazard Monitor Server running on port ${PORT}`);
      console.log(`📡 Real-time WebSocket server active`);
      console.log(`🔒 Security middleware enabled`);
      console.log(`📊 Analytics and monitoring active`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

// Export for testing
export { app, server, io };