import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// App state reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50) // Keep last 50
      };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_MOBILE':
      return { ...state, isMobile: action.payload };
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
    case 'SET_REPORTS':
      return { ...state, reports: action.payload };
    case 'ADD_REPORT':
      return { ...state, reports: [action.payload, ...state.reports] };
    case 'SET_DONATIONS':
      return { ...state, donations: action.payload };
    case 'ADD_DONATION':
      return { ...state, donations: [action.payload, ...state.donations] };
    case 'SET_VOLUNTEERS':
      return { ...state, volunteers: action.payload };
    case 'ADD_VOLUNTEER':
      return { ...state, volunteers: [action.payload, ...state.volunteers] };
    default:
      return state;
  }
};

const initialState = {
  loading: false,
  error: null,
  notifications: [],
  theme: 'light',
  isMobile: false,
  sidebarOpen: false,
  reports: [],
  donations: [],
  volunteers: []
};

const AppProviderInternal = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const auth = useAuth();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      dispatch({ type: 'SET_MOBILE', payload: window.innerWidth < 768 });
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    dispatch({ type: 'SET_THEME', payload: savedTheme });
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Actions
  const setLoading = (loading) => dispatch({ type: 'SET_LOADING', payload: loading });

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
    if (error) {
      addNotification({
        id: Date.now(),
        type: 'error',
        title: 'Error',
        message: error,
        timestamp: new Date()
      });
    }
  };

  const clearError = () => dispatch({ type: 'SET_ERROR', payload: null });

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const setSidebarOpen = (open) => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });

  const toggleSidebar = () => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: !state.sidebarOpen });

  // Data management functions
  const loadReports = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockReports = [
        {
          id: 1,
          hazardType: 'Flood',
          location: { latitude: 34.05, longitude: -118.24 },
          description: 'Street flooding in downtown LA',
          severity: 'High',
          status: 'Active',
          reportedBy: 'user123',
          timestamp: new Date()
        },
        {
          id: 2,
          hazardType: 'Wildfire',
          location: { latitude: 34.15, longitude: -118.44 },
          description: 'Brush fire near the hills',
          severity: 'Critical',
          status: 'Active',
          reportedBy: 'user456',
          timestamp: new Date()
        },
      ];
      dispatch({ type: 'SET_REPORTS', payload: mockReports });
    } catch (error) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (reportData) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const newReport = {
        ...reportData,
        id: Date.now(),
        reportedBy: auth.user?.uid,
        timestamp: new Date(),
        status: 'Pending'
      };
      dispatch({ type: 'ADD_REPORT', payload: newReport });
      addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Report Submitted',
        message: 'Your hazard report has been submitted successfully.',
        timestamp: new Date()
      });
      return newReport;
    } catch (error) {
      setError('Failed to submit report');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadDonations = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockDonations = [
        {
          id: 1,
          amount: 100,
          name: 'Jane Doe',
          email: 'jane@example.com',
          date: new Date('2023-10-27'),
          anonymous: false
        },
        {
          id: 2,
          amount: 50,
          name: 'John Smith',
          email: 'john@example.com',
          date: new Date('2023-10-26'),
          anonymous: false
        },
      ];
      dispatch({ type: 'SET_DONATIONS', payload: mockDonations });
    } catch (error) {
      setError('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const processDonation = async (donationData) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const newDonation = {
        ...donationData,
        id: Date.now(),
        date: new Date(),
        status: 'Completed'
      };
      dispatch({ type: 'ADD_DONATION', payload: newDonation });
      addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Donation Processed',
        message: `Thank you for your generous donation of $${donationData.amount}!`,
        timestamp: new Date()
      });
      return newDonation;
    } catch (error) {
      setError('Failed to process donation');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockVolunteers = [
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          skills: 'First Aid, CPR',
          status: 'Active',
          joinedDate: new Date('2023-09-15')
        },
        {
          id: 2,
          name: 'Bob Williams',
          email: 'bob@example.com',
          skills: 'Logistics',
          status: 'Active',
          joinedDate: new Date('2023-09-20')
        },
      ];
      dispatch({ type: 'SET_VOLUNTEERS', payload: mockVolunteers });
    } catch (error) {
      setError('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  };

  const registerVolunteer = async (volunteerData) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const newVolunteer = {
        ...volunteerData,
        id: Date.now(),
        status: 'Pending',
        joinedDate: new Date()
      };
      dispatch({ type: 'ADD_VOLUNTEER', payload: newVolunteer });
      addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Volunteer Registration Submitted',
        message: 'Your volunteer registration has been submitted and is pending approval.',
        timestamp: new Date()
      });
      return newVolunteer;
    } catch (error) {
      setError('Failed to register volunteer');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data when user changes
  useEffect(() => {
    if (auth.user) {
      loadReports();
      if (auth.hasRole(auth.ROLES.ADMIN) || auth.hasRole(auth.ROLES.MODERATOR)) {
        loadDonations();
        loadVolunteers();
      }
    }
  }, [auth.user]);

  const value = {
    // Auth state
    user: auth.user,
    loading: auth.loading || state.loading,
    error: auth.error || state.error,

    // Auth actions
    login: auth.login,
    signup: auth.signup,
    loginWithGoogle: auth.loginWithGoogle,
    logout: auth.logout,
    updateUserProfile: auth.updateUserProfile,
    hasRole: auth.hasRole,

    // App state
    ...state,

    // App actions
    setLoading,
    setError,
    clearError,
    addNotification,
    setTheme,
    toggleTheme,
    setSidebarOpen,
    toggleSidebar,

    // Data actions
    loadReports,
    addReport,
    loadDonations,
    processDonation,
    loadVolunteers,
    registerVolunteer
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const CombinedProvider = ({ children }) => (
  <AuthProvider>
    <AppProviderInternal>{children}</AppProviderInternal>
  </AuthProvider>
);
