/**
 * Authentication and Authorization Middleware
 * Supports JWT tokens, Firebase Auth, and role-based access control
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getAuth } from 'firebase-admin/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate JWT token for user
 * @param {Object} user - User object with id and role
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id || user.uid,
      email: user.email,
      role: user.role || 'citizen',
      fullName: user.fullName
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Verify JWT token and add user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        code: 'NO_TOKEN'
      });
    }
    
    // Try JWT verification first
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Get fresh user data from database
      const userDoc = await getDoc(doc(firestore, 'users', decoded.userId));
      
      if (!userDoc.exists()) {
        return res.status(401).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }
      
      const userData = userDoc.data();
      
      // Check if user is active
      if (userData.status !== 'active') {
        return res.status(401).json({
          error: 'Account is not active',
          code: 'ACCOUNT_INACTIVE'
        });
      }
      
      req.user = {
        ...decoded,
        ...userData,
        id: decoded.userId
      };
      
      next();
      
    } catch (jwtError) {
      // If JWT fails, try Firebase token verification
      try {
        const decodedFirebaseToken = await verifyFirebaseToken(token);
        
        // Get user data from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', decodedFirebaseToken.uid));
        
        if (!userDoc.exists()) {
          return res.status(401).json({
            error: 'User not found in database',
            code: 'USER_NOT_FOUND'
          });
        }
        
        req.user = {
          userId: decodedFirebaseToken.uid,
          email: decodedFirebaseToken.email,
          ...userDoc.data()
        };
        
        next();
        
      } catch (firebaseError) {
        return res.status(403).json({
          error: 'Invalid or expired token',
          code: 'INVALID_TOKEN',
          details: process.env.NODE_ENV === 'development' ? firebaseError.message : undefined
        });
      }
    }
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Authentication service error',
      code: 'AUTH_SERVICE_ERROR'
    });
  }
};

/**
 * Verify Firebase ID token (if Firebase Admin is available)
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>} Decoded token
 */
const verifyFirebaseToken = async (idToken) => {
  try {
    // This would work if Firebase Admin SDK is properly initialized
    // const decodedToken = await getAuth().verifyIdToken(idToken);
    // return decodedToken;
    
    // For now, throw error to fallback to JWT
    throw new Error('Firebase Admin not configured');
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
};

/**
 * Role-based authorization middleware
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    const userRole = req.user.role || 'citizen';
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: userRole
      });
    }
    
    next();
  };
};

/**
 * Check if user owns the resource or has admin privileges
 * @param {string} userIdField - Field name containing user ID in request params/body
 * @returns {Function} Express middleware function
 */
export const authorizeOwnerOrAdmin = (userIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    const requestUserId = req.params[userIdField] || req.body[userIdField];
    const currentUserId = req.user.userId || req.user.id;
    const userRole = req.user.role || 'citizen';
    
    // Allow if user owns the resource or is an admin/official
    const isOwner = requestUserId === currentUserId;
    const isAdmin = ['admin', 'official', 'analyst'].includes(userRole);
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied - insufficient permissions',
        code: 'ACCESS_DENIED'
      });
    }
    
    next();
  };
};

/**
 * Rate limiting for authentication endpoints
 * @param {number} maxAttempts - Maximum attempts per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Express middleware function
 */
export const authRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const clientId = req.ip + req.headers['user-agent'];
    const now = Date.now();
    
    if (!attempts.has(clientId)) {
      attempts.set(clientId, { count: 1, resetTime: now + windowMs });
    } else {
      const clientAttempts = attempts.get(clientId);
      
      if (now > clientAttempts.resetTime) {
        // Reset window
        clientAttempts.count = 1;
        clientAttempts.resetTime = now + windowMs;
      } else {
        clientAttempts.count++;
        
        if (clientAttempts.count > maxAttempts) {
          const resetIn = Math.ceil((clientAttempts.resetTime - now) / 1000);
          return res.status(429).json({
            error: 'Too many authentication attempts',
            code: 'RATE_LIMITED',
            resetIn: resetIn
          });
        }
      }
    }
    
    next();
  };
};

/**
 * Validate user input for registration/login
 * @param {Object} validationRules - Validation rules object
 * @returns {Function} Express middleware function
 */
export const validateUserInput = (validationRules) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(validationRules)) {
      const value = req.body[field];
      
      if (rules.required && (!value || value.trim() === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      if (value) {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must not exceed ${rules.maxLength} characters`);
        }
        
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
        
        if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field} must be a valid email address`);
        }
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }
    
    next();
  };
};