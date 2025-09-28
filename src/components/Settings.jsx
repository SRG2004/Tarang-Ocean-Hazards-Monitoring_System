import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Bell, Mail, Download, Shield, LogOut } from 'lucide-react';
import Navbar from './Navbar';

const Settings = () => {
  const { user, logout } = useApp();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });
  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    profilePublic: true
  });

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyToggle = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
  };

  const handleDownloadData = () => {
    // Implement data download
    console.log('Download data requested');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
          <p className="text-text-secondary">Manage your notifications, privacy, and account settings</p>
        </div>

        <div className="space-y-8">
          {/* Notifications Section */}
          <div className="card">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-text-primary flex items-center space-x-2 mb-4">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.email}
                    onChange={() => handleNotificationToggle('email')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary">Push Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.push}
                    onChange={() => handleNotificationToggle('push')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary">SMS Alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.sms}
                    onChange={() => handleNotificationToggle('sms')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>

          {/* Privacy & Data Section */}
          <div className="card">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-text-primary flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5" />
                <span>Privacy & Data</span>
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary">Allow Data Sharing</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={privacy.dataSharing}
                    onChange={() => handlePrivacyToggle('dataSharing')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary">Public Profile</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={privacy.profilePublic}
                    onChange={() => handlePrivacyToggle('profilePublic')}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={handleDownloadData}
                  className="flex items-center space-x-2 text-primary hover:underline text-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Your Data</span>
                </button>
                <p className="text-xs text-text-secondary">Export all your reports, alerts, and activity data</p>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Account</h2>
              <div className="space-y-4">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 btn-danger text-white py-2 px-4 rounded-md hover:bg-danger/90"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
                <button className="w-full text-sm text-danger hover:underline">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
