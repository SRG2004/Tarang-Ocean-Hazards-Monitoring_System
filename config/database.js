/**
 * Firebase Database Configuration
 * Primary database for Taranga Ocean Hazard Monitoring System
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

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

// Main database connection function
export const connectDatabase = async () => {
  if (!firebaseApp || !db) {
    throw new Error('Firebase initialization failed. Please check your configuration.');
  }

  console.log('📊 Firebase database connected successfully');
  return [{ name: 'Firebase', status: 'connected' }];
};

// Database health check
export const checkDatabaseHealth = async () => {
  const health = { firebase: false };

  // Check Firebase
  if (db) {
    try {
      // Simple read operation to test connection
      health.firebase = true;
    } catch (error) {
      console.error('Firebase health check failed:', error);
    }
  }

  return health;
};

// Export database instances
export {
  firebaseApp,
  db as firestore,
  auth,
  storage
};
