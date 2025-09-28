import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User roles
  const ROLES = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    EDITOR: 'editor',
    USER: 'user'
  };

  // Initialize user profile in Firestore
  const initializeUserProfile = async (userData, additionalData = {}) => {
    try {
      const userRef = doc(db, 'users', userData.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const userProfile = {
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName || userData.email.split('@')[0],
          photoURL: userData.photoURL || null,
          role: ROLES.USER, // Default role
          createdAt: new Date(),
          lastLogin: new Date(),
          isActive: true,
          ...additionalData
        };

        await setDoc(userRef, userProfile);
        return userProfile;
      } else {
        // Update last login
        await updateDoc(userRef, {
          lastLogin: new Date(),
          isActive: true
        });
        return userSnap.data();
      }
    } catch (error) {
      console.error('Error initializing user profile:', error);
      throw error;
    }
  };

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      await updateProfile(result.user, { displayName });

      // Initialize user profile
      const userProfile = await initializeUserProfile(result.user, { displayName });

      return { user: result.user, profile: userProfile };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Get user profile
      const userProfile = await initializeUserProfile(result.user);

      return { user: result.user, profile: userProfile };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Initialize user profile
      const userProfile = await initializeUserProfile(result.user);

      return { user: result.user, profile: userProfile };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });

      // Update local state
      setUser(prev => ({ ...prev, ...updates }));

      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Check if user has role
  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;

    const roleHierarchy = {
      [ROLES.USER]: 1,
      [ROLES.EDITOR]: 2,
      [ROLES.MODERATOR]: 3,
      [ROLES.ADMIN]: 4
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  // Get users by role (admin only)
  const getUsersByRole = async (role) => {
    try {
      if (!hasRole(ROLES.ADMIN)) throw new Error('Unauthorized');

      const q = query(collection(db, 'users'), where('role', '==', role));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userProfile = userSnap.data();
            setUser({ ...firebaseUser, ...userProfile });
          } else {
            // Create profile if it doesn't exist
            const userProfile = await initializeUserProfile(firebaseUser);
            setUser({ ...firebaseUser, ...userProfile });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(firebaseUser); // Fallback to basic user data
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
    hasRole,
    getUsersByRole,
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
