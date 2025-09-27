import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || 'Demo User',
    email: user?.email || 'demo@oceanhazard.com',
    phone: user?.phone || '+91 9876543210',
    role: user?.role || 'citizen',
    location: {
      state: user?.location?.state || 'Tamil Nadu',
      district: user?.location?.district || 'Chennai',
      coastalArea: user?.location?.coastalArea || 'Marina Beach'
    }
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    newsletter: true,
    emergencyAlerts: true,
    socialMediaMentions: false
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'light',
    mapStyle: 'satellite',
    alertRadius: '50',
    autoLocation: true,
    dataSharing: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔐' },
    { id: 'data', label: 'Data & Privacy', icon: '🛡️' }
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    alert('Settings saved successfully!');
  };

  const handleLogout = () => {
    logout();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="tab-content">
            <h3>Profile Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={profileData.role}
                  onChange={handleProfileChange}
                >
                  <option value="citizen">Citizen</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="official">Official</option>
                  <option value="analyst">Analyst</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="location.state"
                  value={profileData.location.state}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div className="form-group">
                <label>District</label>
                <input
                  type="text"
                  name="location.district"
                  value={profileData.location.district}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="tab-content">
            <h3>Notification Preferences</h3>
            <div className="notification-settings">
              {Object.entries(notifications).map(([key, value]) => (
                <label key={key} className="notification-item">
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handleNotificationChange}
                  />
                  <span className="notification-label">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="tab-content">
            <h3>Application Preferences</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Language</label>
                <select
                  name="language"
                  value={preferences.language}
                  onChange={handlePreferenceChange}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Theme</label>
                <select
                  name="theme"
                  value={preferences.theme}
                  onChange={handlePreferenceChange}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Map Style</label>
                <select
                  name="mapStyle"
                  value={preferences.mapStyle}
                  onChange={handlePreferenceChange}
                >
                  <option value="satellite">Satellite</option>
                  <option value="street">Street</option>
                  <option value="terrain">Terrain</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Alert Radius (km)</label>
                <select
                  name="alertRadius"
                  value={preferences.alertRadius}
                  onChange={handlePreferenceChange}
                >
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                  <option value="100">100 km</option>
                </select>
              </div>
            </div>
            
            <div className="checkbox-settings">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  name="autoLocation"
                  checked={preferences.autoLocation}
                  onChange={handlePreferenceChange}
                />
                <span>Auto-detect location</span>
              </label>
              
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  name="dataSharing"
                  checked={preferences.dataSharing}
                  onChange={handlePreferenceChange}
                />
                <span>Share anonymous usage data</span>
              </label>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="tab-content">
            <h3>Security Settings</h3>
            <div className="security-actions">
              <div className="security-item">
                <h4>Change Password</h4>
                <p>Update your account password</p>
                <button className="btn-secondary">Change Password</button>
              </div>
              
              <div className="security-item">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
                <button className="btn-secondary">Enable 2FA</button>
              </div>
              
              <div className="security-item">
                <h4>Active Sessions</h4>
                <p>Manage your active login sessions</p>
                <button className="btn-secondary">View Sessions</button>
              </div>
              
              <div className="security-item danger">
                <h4>Sign Out All Devices</h4>
                <p>Sign out from all devices except this one</p>
                <button className="btn-danger">Sign Out All</button>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="tab-content">
            <h3>Data & Privacy</h3>
            <div className="data-actions">
              <div className="data-item">
                <h4>Download Your Data</h4>
                <p>Download a copy of your account data</p>
                <button className="btn-secondary">Download Data</button>
              </div>
              
              <div className="data-item">
                <h4>Data Retention</h4>
                <p>Manage how long we keep your data</p>
                <button className="btn-secondary">Manage Retention</button>
              </div>
              
              <div className="data-item danger">
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all data</p>
                <button className="btn-danger">Delete Account</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your account preferences and settings</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              {profileData.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="user-details">
              <h3>{profileData.fullName}</h3>
              <p>{profileData.role}</p>
            </div>
          </div>

          <nav className="settings-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="settings-actions">
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Sign Out
            </button>
          </div>
        </div>

        <div className="settings-content">
          {renderTabContent()}
          
          <div className="content-actions">
            <button className="btn-primary" onClick={handleSave}>
              💾 Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;