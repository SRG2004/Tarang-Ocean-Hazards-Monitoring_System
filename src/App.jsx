import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './contexts/AppContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CitizenDashboard from './pages/CitizenDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import SocialMediaMonitoring from './pages/SocialMediaMonitoring';
import DonationManagement from './pages/DonationManagement';
import VolunteerRegistration from './pages/VolunteerRegistration';
import UserRegistration from './pages/UserRegistration';
import LoginPage from './pages/LoginPage';
import MapViewPage from './pages/MapViewPage';
import Settings from './pages/Settings';
import './App.css';

export default function App() {
  // Environment check for debugging deployment issues
  const isProduction = import.meta.env.PROD;
  
  if (isProduction) {
    console.log('🌊 Taranga Ocean Hazard Monitor - Production Mode');
    console.log('Environment:', import.meta.env.MODE);
  }

  try {
    return (
      <AppProvider>
        <Router>
          <div className="App">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<UserRegistration />} />
              <Route path="/citizen" element={<CitizenDashboard />} />
              <Route path="/analyst" element={<AnalyticsDashboard />} />
              <Route path="/official" element={<DonationManagement />} />
              <Route path="/social-media" element={<SocialMediaMonitoring />} />
              <Route path="/donations" element={<DonationManagement />} />
              <Route path="/volunteer-registration" element={<VolunteerRegistration />} />
              <Route path="/map" element={<MapViewPage />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    );
  } catch (error) {
    console.error('App Error:', error);
    // Fallback UI for production errors
    return (
      <div style={{
        padding: '40px 20px',
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{color: '#1f2937', marginBottom: '20px'}}>🌊 Taranga Ocean Hazard Monitor</h1>
          <div style={{padding: '20px', background: '#fef2f2', borderRadius: '8px', marginBottom: '20px'}}>
            <p style={{color: '#dc2626', margin: 0}}>Application is loading... Please refresh the page.</p>
          </div>
          <p style={{color: '#6b7280'}}>If this issue persists, please contact support.</p>
        </div>
      </div>
    );
  }
}
