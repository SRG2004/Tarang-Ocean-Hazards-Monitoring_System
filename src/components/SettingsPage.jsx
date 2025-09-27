import React, { useState } from 'react';
import { 
  User,
  Bell,
  Shield,
  MapPin,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Phone,
  Save,
  AlertTriangle,
  CheckCircle,
  Settings as SettingsIcon
} from 'lucide-react';

export const SettingsPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: 'Mumbai, Maharashtra',
      bio: ''
    },
    notifications: {
      email: true,
      sms: true,
      push: true,
      criticalAlerts: true,
      weeklyReports: false,
      socialMediaMentions: true,
      volunteerOpportunities: false
    },
    privacy: {
      profileVisible: true,
      locationSharing: false,
      dataAnalytics: true,
      thirdPartySharing: false
    },
    preferences: {
      theme: 'light',
      language: 'en',
      mapProvider: 'leaflet',
      defaultView: 'dashboard',
      alertRadius: '50'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1500);
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card space-y-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-50 border border-blue-200 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card-feature">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={settings.profile.location}
                      onChange={(e) => updateSetting('profile', 'location', e.target.value)}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="input resize-none"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Profile Verification</p>
                      <p className="text-blue-700">
                        Keep your profile information up-to-date to ensure you receive important
                        alerts and can be contacted during emergency situations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold">Notification Preferences</h2>
                </div>

                <div className="space-y-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Methods</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive alerts via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.email}
                            onChange={(e) => updateSetting('notifications', 'email', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-medium text-gray-900">SMS Alerts</p>
                            <p className="text-sm text-gray-500">Critical alerts via SMS</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.sms}
                            onChange={(e) => updateSetting('notifications', 'sms', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-purple-500" />
                          <div>
                            <p className="font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-500">Real-time app notifications</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.push}
                            onChange={(e) => updateSetting('notifications', 'push', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Types</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'criticalAlerts', label: 'Critical Hazard Alerts', desc: 'Immediate danger notifications', required: true },
                        { key: 'weeklyReports', label: 'Weekly Summary Reports', desc: 'Weekly hazard activity summary' },
                        { key: 'socialMediaMentions', label: 'Social Media Monitoring', desc: 'Relevant social media alerts' },
                        { key: 'volunteerOpportunities', label: 'Volunteer Opportunities', desc: 'New volunteer opportunities in your area' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900">{item.label}</p>
                              {item.required && (
                                <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications[item.key]}
                              onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                              disabled={item.required}
                              className="sr-only peer"
                            />
                            <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${item.required ? 'opacity-50' : ''}`}></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-red-600" />
                  <h2 className="text-xl font-semibold">Privacy & Security</h2>
                </div>

                <div className="space-y-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Privacy</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'profileVisible', label: 'Public Profile', desc: 'Make your profile visible to other users' },
                        { key: 'locationSharing', label: 'Location Sharing', desc: 'Share your location for better emergency response' },
                        { key: 'dataAnalytics', label: 'Usage Analytics', desc: 'Help improve the platform with anonymous usage data' },
                        { key: 'thirdPartySharing', label: 'Third-party Data Sharing', desc: 'Share anonymized data with research partners' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.privacy[item.key]}
                              onChange={(e) => updateSetting('privacy', item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-1">Important Security Notice</p>
                        <p className="text-amber-700">
                          Your safety is our priority. Location sharing is recommended for faster
                          emergency response, but you maintain full control over your privacy settings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex items-center space-x-3 mb-6">
                  <SettingsIcon className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold">App Preferences</h2>
                </div>

                <div className="space-y-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'light', label: 'Light', icon: Sun },
                            { value: 'dark', label: 'Dark', icon: Moon },
                            { value: 'auto', label: 'Auto', icon: Globe }
                          ].map((theme) => {
                            const IconComponent = theme.icon;
                            return (
                              <button
                                key={theme.value}
                                onClick={() => updateSetting('preferences', 'theme', theme.value)}
                                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                                  settings.preferences.theme === theme.value
                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                    : 'border-gray-200 hover:border-purple-300'
                                }`}
                              >
                                <IconComponent className="w-6 h-6 mb-2" />
                                <span className="text-sm font-medium">{theme.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                        <select
                          value={settings.preferences.language}
                          onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                          className="input"
                        >
                          <option value="en">English</option>
                          <option value="hi">हिन्दी (Hindi)</option>
                          <option value="bn">বাংলা (Bengali)</option>
                          <option value="te">తెలుగు (Telugu)</option>
                          <option value="ta">தமிழ் (Tamil)</option>
                          <option value="mr">मराठी (Marathi)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Map & Location</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Map Provider</label>
                        <select
                          value={settings.preferences.mapProvider}
                          onChange={(e) => updateSetting('preferences', 'mapProvider', e.target.value)}
                          className="input"
                        >
                          <option value="leaflet">OpenStreetMap (Leaflet)</option>
                          <option value="google">Google Maps</option>
                          <option value="mapbox">Mapbox</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Alert Radius (km)
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={settings.preferences.alertRadius}
                          onChange={(e) => updateSetting('preferences', 'alertRadius', e.target.value)}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>10 km</span>
                          <span className="font-medium">{settings.preferences.alertRadius} km</span>
                          <span>100 km</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Default Dashboard View</label>
                        <select
                          value={settings.preferences.defaultView}
                          onChange={(e) => updateSetting('preferences', 'defaultView', e.target.value)}
                          className="input"
                        >
                          <option value="dashboard">Overview Dashboard</option>
                          <option value="map">Hazard Map</option>
                          <option value="reports">Recent Reports</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
              <div className="flex items-center space-x-2">
                {saveStatus === 'success' && (
                  <div className="flex items-center space-x-2 text-green-600 animate-fade-in-scale">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Settings saved successfully</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center space-x-2"
              >
                {isSaving && <div className="loading" />}
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};