import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import hazardRoutes from './routes/hazards.js';
import donationRoutes from './routes/donations.js';
import volunteerRoutes from './routes/volunteers.js';
import analyticsRoutes from './routes/analytics.js';
import notificationRoutes from './routes/notifications.js';
import socialMediaRoutes from './routes/socialMedia.js';
import aiRoutes from './routes/ai.js';

// Import services
import { initializeRealTimeService } from './services/realTimeService.js';
import { initializeSocialMediaService } from './services/socialMediaService.js';
import { initializeAIIntelligenceService } from './services/aiIntelligenceService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hazards', hazardRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/social-media', socialMediaRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on('leave-room', (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Initialize services
initializeRealTimeService(io);
initializeSocialMediaService(io);
initializeAIIntelligenceService(io);

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

server.listen(port, () => {
  console.log(`🌊 Tarang Ocean Hazards Monitoring System`);
  console.log(`✅ Server running on port: ${port}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Real-time services initialized`);
});
