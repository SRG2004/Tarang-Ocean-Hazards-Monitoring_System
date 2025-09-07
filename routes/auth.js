/**
 * Authentication Routes
 * Handles user registration, login, password reset, and profile management
 */

import express from 'express';
import { 
  authenticateToken, 
  generateToken, 
  hashPassword, 
  comparePassword,
  validateUserInput,
  authRateLimit
} from '../middleware/auth.js';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { firestore } from '../config/database.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user with role-based access
 */
router.post('/register', 
  authRateLimit(3, 15 * 60 * 1000), // 3 attempts per 15 minutes
  validateUserInput({
    email: { required: true, email: true },
    password: { required: true, minLength: 8 },
    fullName: { required: true, minLength: 2, maxLength: 100 },
    role: { required: true }
  }),
  async (req, res) => {
    try {
      const { email, password, fullName, role, phone, location, organization } = req.body;
      
      // Validate role
      const validRoles = ['citizen', 'volunteer', 'official', 'analyst'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          error: 'Invalid role',
          validRoles
        });
      }
      
      // Check if user already exists
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return res.status(409).json({
          error: 'User already exists with this email',
          code: 'USER_EXISTS'
        });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Generate unique user ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create user document
      const userData = {
        id: userId,
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName,
        role,
        phone: phone || '',
        location: location || {},
        organization: organization || '',
        status: 'active',
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
        preferences: {
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          language: 'en',
          timezone: 'Asia/Kolkata'
        },
        stats: {
          reportsSubmitted: 0,
          donationsCount: 0,
          volunteerHours: 0
        }
      };
      
      // Additional role-specific fields
      if (role === 'volunteer') {
        userData.volunteer = {
          skills: [],
          availability: 'weekends',
          emergencyContact: {},
          certifications: [],
          rating: 0,
          completedTasks: 0
        };
      }
      
      if (role === 'official') {
        userData.official = {
          department: organization || '',
          jurisdiction: location || {},
          clearanceLevel: 'basic',
          verifiedBy: null,
          verifiedAt: null
        };
      }
      
      // Save to Firestore
      await setDoc(doc(firestore, 'users', userId), userData);
      
      // Generate JWT token
      const token = generateToken(userData);
      
      // Remove sensitive data from response
      delete userData.password;
      
      res.status(201).json({
        message: 'User registered successfully',
        user: userData,
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Registration failed',
        code: 'REGISTRATION_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login',
  authRateLimit(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  validateUserInput({
    email: { required: true, email: true },
    password: { required: true }
  }),
  async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;
      
      // Find user by email
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return res.status(401).json({
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        });
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      // Check if account is active
      if (userData.status !== 'active') {
        return res.status(401).json({
          error: 'Account is not active',
          code: 'ACCOUNT_INACTIVE',
          status: userData.status
        });
      }
      
      // Verify password
      const isPasswordValid = await comparePassword(password, userData.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        });
      }
      
      // Update last login
      await updateDoc(doc(firestore, 'users', userData.id), {
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Generate JWT token (longer expiry if remember me is checked)
      const tokenExpiry = rememberMe ? '30d' : '24h';
      const token = generateToken({
        ...userData,
        expiresIn: tokenExpiry
      });
      
      // Remove sensitive data
      delete userData.password;
      
      res.json({
        message: 'Login successful',
        user: userData,
        token,
        expiresIn: tokenExpiry
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        code: 'LOGIN_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * GET /api/auth/profile
 * Get current user's profile information
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    
    if (!userDoc.exists()) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    const userData = userDoc.data();
    delete userData.password; // Remove sensitive data
    
    res.json({
      user: userData
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      code: 'PROFILE_ERROR'
    });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile information
 */
router.put('/profile', 
  authenticateToken,
  validateUserInput({
    fullName: { minLength: 2, maxLength: 100 },
    phone: { minLength: 10, maxLength: 15 },
    email: { email: true }
  }),
  async (req, res) => {
    try {
      const userId = req.user.userId || req.user.id;
      const { fullName, phone, location, organization, preferences } = req.body;
      
      const updateData = {
        updatedAt: new Date().toISOString()
      };
      
      // Only update provided fields
      if (fullName) updateData.fullName = fullName;
      if (phone) updateData.phone = phone;
      if (location) updateData.location = location;
      if (organization) updateData.organization = organization;
      if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };
      
      await updateDoc(doc(firestore, 'users', userId), updateData);
      
      // Get updated user data
      const updatedUserDoc = await getDoc(doc(firestore, 'users', userId));
      const updatedUser = updatedUserDoc.data();
      delete updatedUser.password;
      
      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
      
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        error: 'Failed to update profile',
        code: 'UPDATE_PROFILE_ERROR'
      });
    }
  }
);

/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post('/change-password',
  authenticateToken,
  validateUserInput({
    currentPassword: { required: true },
    newPassword: { required: true, minLength: 8 }
  }),
  async (req, res) => {
    try {
      const userId = req.user.userId || req.user.id;
      const { currentPassword, newPassword } = req.body;
      
      // Get current user data
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      const userData = userDoc.data();
      
      // Verify current password
      const isCurrentPasswordValid = await comparePassword(currentPassword, userData.password);
      
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          error: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        });
      }
      
      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);
      
      // Update password
      await updateDoc(doc(firestore, 'users', userId), {
        password: hashedNewPassword,
        updatedAt: new Date().toISOString()
      });
      
      res.json({
        message: 'Password changed successfully'
      });
      
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        error: 'Failed to change password',
        code: 'CHANGE_PASSWORD_ERROR'
      });
    }
  }
);

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', authenticateToken, async (req, res) => {
  // In a stateless JWT setup, logout is primarily handled client-side
  // We can log the logout event and optionally blacklist the token
  
  try {
    const userId = req.user.userId || req.user.id;
    
    // Update last activity
    await updateDoc(doc(firestore, 'users', userId), {
      lastActivity: new Date().toISOString()
    });
    
    res.json({
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
});

/**
 * GET /api/auth/verify-token
 * Verify if current token is valid
 */
router.get('/verify-token', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user.userId || req.user.id,
      email: req.user.email,
      role: req.user.role,
      fullName: req.user.fullName
    }
  });
});

export default router;