import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CitizenDashboard from './pages/CitizenDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import SocialMediaMonitoring from './pages/SocialMediaMonitoring';
import DonationManagement from './pages/DonationManagement';
import VolunteerRegistration from './pages/VolunteerRegistration';
import LoginPage from './pages/LoginPage';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/analyst" element={<AnalyticsDashboard />} />
          <Route path="/social-media" element={<SocialMediaMonitoring />} />
          <Route path="/donations" element={<DonationManagement />} />
          <Route path="/volunteer-registration" element={<VolunteerRegistration />} />
        </Routes>
      </div>
    </Router>
  );
}
