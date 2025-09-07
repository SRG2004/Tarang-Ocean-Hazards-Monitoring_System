import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './contexts/AppContext';
import HomePage from './pages/HomePage';
import CitizenDashboard from './pages/CitizenDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import SocialMediaMonitoring from './pages/SocialMediaMonitoring';
import DonationManagement from './pages/DonationManagement';
import VolunteerRegistration from './pages/VolunteerRegistration';
import LoginPage from './pages/LoginPage';
import MapViewPage from './pages/MapViewPage';
import './App.css';

export default function App() {
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
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/citizen" element={<CitizenDashboard />} />
            <Route path="/analyst" element={<AnalyticsDashboard />} />
            <Route path="/social-media" element={<SocialMediaMonitoring />} />
            <Route path="/donations" element={<DonationManagement />} />
            <Route path="/volunteer-registration" element={<VolunteerRegistration />} />
            <Route path="/map" element={<MapViewPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}
