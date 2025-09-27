import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import RoleSelectionPage from './pages/RoleSelectionPage';
import SimpleLoginPage from './pages/SimpleLoginPage';

import MainLayout from './components/MainLayout';
import CitizenDashboard from './components/dashboards/CitizenDashboard';
import OfficialDashboard from './components/dashboards/OfficialDashboard';
import AnalystDashboard from './components/dashboards/AnalystDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import MinimalHazardMap from './components/MinimalHazardMap';
import ReportHazardForm from './components/ReportHazardForm';
import DonationsInterface from './components/DonationsInterface';
import SocialMediaMonitoring from './components/SocialMediaMonitoring';
import SettingsPage from './components/SettingsPage';

const AppRouter = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <RoleSelectionPage />} />
        <Route path="/login/:role?" element={user ? <Navigate to="/dashboard" /> : <SimpleLoginPage />} />
        <Route path="/dashboard/*" element={user ? <MainLayout user={user} /> : <Navigate to="/" />}>
          {/* <Route index element={<Dashboard user={user} />} /> */}
          <Route path="map" element={<MinimalHazardMap />} />
          <Route path="report" element={<ReportHazardForm />} />
          <Route path="donate" element={<DonationsInterface />} />
          <Route path="reports" element={<h1>Manage Reports</h1>} />
          <Route path="volunteers" element={<h1>Volunteer Management</h1>} />
          <Route path="social-media" element={<SocialMediaMonitoring />} />
          <Route path="admin/users" element={<h1>User Management</h1>} />
          <Route path="admin/settings" element={<h1>System Settings</h1>} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

const Dashboard = ({ user }) => {
  switch (user.role) {
    case 'citizen':
      return <CitizenDashboard />;
    case 'official':
      return <OfficialDashboard />;
    case 'analyst':
      return <AnalystDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" />;
  }
};

export default AppRouter;
