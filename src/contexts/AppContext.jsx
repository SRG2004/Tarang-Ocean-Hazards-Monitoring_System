import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext.jsx';

const AppContext = createContext(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const AppProviderInternal = ({ children }) => {
  const { user, token, loading, isAuthenticated, login, logout, register, updateProfile } = useAuth();
  const [reports, setReports] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  const loadReports = () => {
    // Simulate API call
    const mockReports = [
      { id: 1, hazardType: 'Flood', location: { latitude: 34.05, longitude: -118.24 }, description: 'Street flooding in downtown LA' },
      { id: 2, hazardType: 'Wildfire', location: { latitude: 34.15, longitude: -118.44 }, description: 'Brush fire near the hills' },
    ];
    setReports(mockReports);
  };

  const loadDonations = () => {
    // Simulate API call
    const mockDonations = [
      { id: 1, amount: 100, name: 'Jane Doe', email: 'jane@example.com', date: '2023-10-27' },
      { id: 2, amount: 50, name: 'John Smith', email: 'john@example.com', date: '2023-10-26' },
    ];
    setDonations(mockDonations);
  };

  const loadVolunteers = () => {
    // Simulate API call
    const mockVolunteers = [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', skills: 'First Aid, CPR' },
      { id: 2, name: 'Bob Williams', email: 'bob@example.com', skills: 'Logistics' },
    ];
    setVolunteers(mockVolunteers);
  };

  const processDonation = async (donation) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setDonations([...donations, { ...donation, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
        resolve();
      }, 500);
    });
  };

  const registerVolunteer = async (volunteer) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setVolunteers([...volunteers, { ...volunteer, id: Date.now() }]);
        resolve();
      }, 500);
    });
  };

  useEffect(() => {
    if (user) {
      // Load data based on user role
      loadReports();
      if (user.role === 'official') {
        loadDonations();
        loadVolunteers();
      }
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ 
      user, 
      token, 
      loading, 
      isAuthenticated, 
      login, 
      logout, 
      register, 
      updateProfile, 
      reports, 
      donations, 
      volunteers, 
      loadReports, 
      loadDonations, 
      loadVolunteers, 
      processDonation, 
      registerVolunteer 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider = ({ children }) => (
  <AuthProvider>
    <AppProviderInternal>{children}</AppProviderInternal>
  </AuthProvider>
);
