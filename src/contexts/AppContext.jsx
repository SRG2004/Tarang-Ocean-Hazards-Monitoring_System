import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { hazardReportService } from '../services/hazardReportService';
import { socialMediaService } from '../services/socialMediaService';
import { donationService } from '../services/donationService';
import { notificationService } from '../services/notificationService';
import { volunteerService } from '../services/volunteerService';

// Initial state
const initialState = {
  // Auth state
  user: null,
  isAuthenticated: false,
  loading: true,
  
  // Reports state
  reports: [],
  reportsLoading: false,
  
  // Social media state
  socialMediaPosts: [],
  socialMediaLoading: false,
  sentimentStats: { positive: 0, negative: 0, neutral: 0, total: 0 },
  trendingTopics: [],
  
  // Donations state
  donations: [],
  donationStats: {
    totalAmount: 0,
    totalDonations: 0,
    uniqueDonors: 0,
    thisMonth: 0
  },
  
  // Notifications state
  notifications: [],
  unreadCount: 0,
  
  // Volunteers state
  volunteers: [],
  volunteerTasks: [],
  volunteerStats: {
    totalVolunteers: 0,
    activeVolunteers: 0,
    totalTasks: 0,
    openTasks: 0
  },
  
  // App state
  error: null,
  successMessage: null
};

// Action types
const ActionTypes = {
  // Auth actions
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  LOGOUT: 'LOGOUT',
  
  // Reports actions
  SET_REPORTS: 'SET_REPORTS',
  ADD_REPORT: 'ADD_REPORT',
  UPDATE_REPORT: 'UPDATE_REPORT',
  SET_REPORTS_LOADING: 'SET_REPORTS_LOADING',
  
  // Social media actions
  SET_SOCIAL_MEDIA_POSTS: 'SET_SOCIAL_MEDIA_POSTS',
  SET_SOCIAL_MEDIA_LOADING: 'SET_SOCIAL_MEDIA_LOADING',
  SET_SENTIMENT_STATS: 'SET_SENTIMENT_STATS',
  SET_TRENDING_TOPICS: 'SET_TRENDING_TOPICS',
  
  // Donations actions
  SET_DONATIONS: 'SET_DONATIONS',
  ADD_DONATION: 'ADD_DONATION',
  SET_DONATION_STATS: 'SET_DONATION_STATS',
  
  // Notifications actions
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  
  // Volunteers actions
  SET_VOLUNTEERS: 'SET_VOLUNTEERS',
  ADD_VOLUNTEER: 'ADD_VOLUNTEER',
  SET_VOLUNTEER_TASKS: 'SET_VOLUNTEER_TASKS',
  ADD_VOLUNTEER_TASK: 'ADD_VOLUNTEER_TASK',
  SET_VOLUNTEER_STATS: 'SET_VOLUNTEER_STATS',
  
  // App actions
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS_MESSAGE: 'SET_SUCCESS_MESSAGE',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    // Auth cases
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false
      };
    
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        loading: false
      };
    
    // Reports cases
    case ActionTypes.SET_REPORTS:
      return { ...state, reports: action.payload };
    
    case ActionTypes.ADD_REPORT:
      return {
        ...state,
        reports: [action.payload, ...state.reports]
      };
    
    case ActionTypes.UPDATE_REPORT:
      return {
        ...state,
        reports: state.reports.map(report =>
          report.id === action.payload.id ? action.payload : report
        )
      };
    
    case ActionTypes.SET_REPORTS_LOADING:
      return { ...state, reportsLoading: action.payload };
    
    // Social media cases
    case ActionTypes.SET_SOCIAL_MEDIA_POSTS:
      return { ...state, socialMediaPosts: action.payload };
    
    case ActionTypes.SET_SOCIAL_MEDIA_LOADING:
      return { ...state, socialMediaLoading: action.payload };
    
    case ActionTypes.SET_SENTIMENT_STATS:
      return { ...state, sentimentStats: action.payload };
    
    case ActionTypes.SET_TRENDING_TOPICS:
      return { ...state, trendingTopics: action.payload };
    
    // Donations cases
    case ActionTypes.SET_DONATIONS:
      return { ...state, donations: action.payload };
    
    case ActionTypes.ADD_DONATION:
      return {
        ...state,
        donations: [action.payload, ...state.donations]
      };
    
    case ActionTypes.SET_DONATION_STATS:
      return { ...state, donationStats: action.payload };
    
    // Notifications cases
    case ActionTypes.SET_NOTIFICATIONS:
      return { ...state, notifications: action.payload };
    
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    
    case ActionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    
    case ActionTypes.SET_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };
    
    // Volunteers cases
    case ActionTypes.SET_VOLUNTEERS:
      return { ...state, volunteers: action.payload };
    
    case ActionTypes.ADD_VOLUNTEER:
      return {
        ...state,
        volunteers: [action.payload, ...state.volunteers]
      };
    
    case ActionTypes.SET_VOLUNTEER_TASKS:
      return { ...state, volunteerTasks: action.payload };
    
    case ActionTypes.ADD_VOLUNTEER_TASK:
      return {
        ...state,
        volunteerTasks: [action.payload, ...state.volunteerTasks]
      };
    
    case ActionTypes.SET_VOLUNTEER_STATS:
      return { ...state, volunteerStats: action.payload };
    
    // App cases
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    
    case ActionTypes.SET_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload };
    
    case ActionTypes.CLEAR_MESSAGES:
      return { ...state, error: null, successMessage: null };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auth functions
  const login = async (email, password) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const result = await authService.login(email, password);
      dispatch({ type: ActionTypes.SET_USER, payload: result.user });
      dispatch({ type: ActionTypes.SET_SUCCESS_MESSAGE, payload: 'Login successful!' });
      return result;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const result = await authService.register(userData);
      dispatch({ type: ActionTypes.SET_USER, payload: result.user });
      dispatch({ type: ActionTypes.SET_SUCCESS_MESSAGE, payload: 'Registration successful!' });
      return result;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: ActionTypes.LOGOUT });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Reports functions
  const loadReports = async (filters = {}) => {
    try {
      dispatch({ type: ActionTypes.SET_REPORTS_LOADING, payload: true });
      const reports = await hazardReportService.getReports(filters);
      dispatch({ type: ActionTypes.SET_REPORTS, payload: reports });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load reports' });
    } finally {
      dispatch({ type: ActionTypes.SET_REPORTS_LOADING, payload: false });
    }
  };

  const submitReport = async (reportData) => {
    try {
      const result = await hazardReportService.submitReport({
        ...reportData,
        userId: state.user?.uid
      });
      dispatch({ type: ActionTypes.ADD_REPORT, payload: result.data });
      dispatch({ type: ActionTypes.SET_SUCCESS_MESSAGE, payload: 'Report submitted successfully!' });
      return result;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to submit report' });
      throw error;
    }
  };

  // Social media functions
  const loadSocialMediaData = async () => {
    try {
      dispatch({ type: ActionTypes.SET_SOCIAL_MEDIA_LOADING, payload: true });
      
      // Load simulated data
      const posts = await socialMediaService.fetchSimulatedSocialMediaData();
      const stats = await socialMediaService.getSentimentStats();
      const trending = await socialMediaService.getTrendingTopics();
      
      dispatch({ type: ActionTypes.SET_SOCIAL_MEDIA_POSTS, payload: posts });
      dispatch({ type: ActionTypes.SET_SENTIMENT_STATS, payload: stats });
      dispatch({ type: ActionTypes.SET_TRENDING_TOPICS, payload: trending });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load social media data' });
    } finally {
      dispatch({ type: ActionTypes.SET_SOCIAL_MEDIA_LOADING, payload: false });
    }
  };

  // Donation functions
  const loadDonations = async () => {
    try {
      const donations = await donationService.getDonations();
      const stats = await donationService.getDonationStats();
      dispatch({ type: ActionTypes.SET_DONATIONS, payload: donations });
      dispatch({ type: ActionTypes.SET_DONATION_STATS, payload: stats });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load donations' });
    }
  };

  const processDonation = async (donationData) => {
    try {
      const result = await donationService.processDonation({
        ...donationData,
        userId: state.user?.uid
      });
      dispatch({ type: ActionTypes.ADD_DONATION, payload: result.data });
      dispatch({ type: ActionTypes.SET_SUCCESS_MESSAGE, payload: 'Donation processed successfully!' });
      
      // Reload donation stats
      const stats = await donationService.getDonationStats();
      dispatch({ type: ActionTypes.SET_DONATION_STATS, payload: stats });
      
      return result;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to process donation' });
      throw error;
    }
  };

  // Volunteer functions
  const loadVolunteers = async () => {
    try {
      const volunteers = await volunteerService.getVolunteers();
      const tasks = await volunteerService.getTasks();
      const stats = await volunteerService.getVolunteerStats();
      
      dispatch({ type: ActionTypes.SET_VOLUNTEERS, payload: volunteers });
      dispatch({ type: ActionTypes.SET_VOLUNTEER_TASKS, payload: tasks });
      dispatch({ type: ActionTypes.SET_VOLUNTEER_STATS, payload: stats });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load volunteer data' });
    }
  };

  const registerVolunteer = async (volunteerData) => {
    try {
      const result = await volunteerService.registerVolunteer({
        ...volunteerData,
        userId: state.user?.uid
      });
      dispatch({ type: ActionTypes.ADD_VOLUNTEER, payload: result.data });
      dispatch({ type: ActionTypes.SET_SUCCESS_MESSAGE, payload: 'Volunteer registration successful!' });
      return result;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to register volunteer' });
      throw error;
    }
  };

  // Utility functions
  const clearMessages = () => {
    dispatch({ type: ActionTypes.CLEAR_MESSAGES });
  };

  // Initialize app
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (user) {
        const userData = await authService.getUserData(user.uid);
        dispatch({ type: ActionTypes.SET_USER, payload: { ...user, ...userData } });
      } else {
        dispatch({ type: ActionTypes.SET_USER, payload: null });
      }
    });

    return unsubscribe;
  }, []);

  // Load initial data when user is authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      loadReports();
      loadSocialMediaData();
      loadDonations();
      loadVolunteers();
    }
  }, [state.isAuthenticated]);

  const value = {
    // State
    ...state,
    
    // Auth functions
    login,
    register,
    logout,
    
    // Reports functions
    loadReports,
    submitReport,
    
    // Social media functions
    loadSocialMediaData,
    
    // Donation functions
    loadDonations,
    processDonation,
    
    // Volunteer functions
    loadVolunteers,
    registerVolunteer,
    
    // Utility functions
    clearMessages
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};