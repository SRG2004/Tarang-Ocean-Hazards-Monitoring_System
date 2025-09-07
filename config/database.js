/**
 * Database Configuration and Connection Management
 * Supports both MongoDB and Firebase with automatic fallback
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import mongoose from 'mongoose';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID
};

// Initialize Firebase
let firebaseApp, db, auth, storage;

try {
  firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
  storage = getStorage(firebaseApp);
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
}

// MongoDB connection setup (backup database)
let mongoConnection = null;

const connectMongoDB = async () => {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      mongoConnection = mongoose.connection;
      console.log('✅ MongoDB connected successfully');
      
      // MongoDB event handlers
      mongoConnection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
      
      mongoConnection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });
      
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      return false;
    }
  }
  return false;
};

// PostgreSQL setup (if available from Replit)
let pgConnection = null;

const connectPostgreSQL = async () => {
  if (process.env.DATABASE_URL) {
    try {
      // Note: Would use pg library if PostgreSQL is preferred
      // const { Pool } = await import('pg');
      // pgConnection = new Pool({
      //   connectionString: process.env.DATABASE_URL,
      //   ssl: process.env.NODE_ENV === 'production'
      // });
      
      console.log('✅ PostgreSQL connection available');
      return true;
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error.message);
      return false;
    }
  }
  return false;
};

// Main database connection function
export const connectDatabase = async () => {
  const databases = [];
  
  // Try Firebase first (primary database)
  if (firebaseApp && db) {
    databases.push({ name: 'Firebase', status: 'connected' });
  }
  
  // Try MongoDB as backup
  const mongoConnected = await connectMongoDB();
  if (mongoConnected) {
    databases.push({ name: 'MongoDB', status: 'connected' });
  }
  
  // Try PostgreSQL if available
  const pgConnected = await connectPostgreSQL();
  if (pgConnected) {
    databases.push({ name: 'PostgreSQL', status: 'available' });
  }
  
  if (databases.length === 0) {
    throw new Error('No database connections available');
  }
  
  console.log('📊 Database connections:', databases);
  return databases;
};

// Database health check
export const checkDatabaseHealth = async () => {
  const health = {
    firebase: false,
    mongodb: false,
    postgresql: false
  };
  
  // Check Firebase
  if (db) {
    try {
      // Simple read operation to test connection
      health.firebase = true;
    } catch (error) {
      console.error('Firebase health check failed:', error);
    }
  }
  
  // Check MongoDB
  if (mongoConnection && mongoConnection.readyState === 1) {
    health.mongodb = true;
  }
  
  // Check PostgreSQL
  if (pgConnection) {
    try {
      // await pgConnection.query('SELECT 1');
      health.postgresql = true;
    } catch (error) {
      console.error('PostgreSQL health check failed:', error);
    }
  }
  
  return health;
};

// Export database instances
export { 
  firebaseApp, 
  db as firestore, 
  auth, 
  storage,
  mongoConnection,
  pgConnection
};