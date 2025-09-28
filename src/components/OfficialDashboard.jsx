import React, { useState } from 'react';
import { AlertCircle, Filter, Search, Clock, MapPin, Users, Bell, FileText, BarChart3, MessageCircle, Layout, Shield as ShieldIcon, Database } from 'lucide-react';
import { HazardMap } from './HazardMap';
import './OfficialDashboard.css';

const OfficialDashboard = () => {
  const [filters, setFilters] = useState({ region: 'All', status: 'All', time: '24h' });

  const stats = {
    pending: 47,
    verifiedToday: 23,
    activeAlerts: 8,
    alertsProfile: 15
  };

  const alerts = [
    { type: 'Storm Surge', severity: 'High', locations: 5, status: 'Active' },
    { type: 'High Waves', severity: 'Medium', locations: 3, status: 'Active' },
    { type: 'Coastal Flooding', severity: 'Low', locations: 2, status: 'Monitoring' }
  ];

  const verificationQueue = [
    { id: 1, title: 'High waves at Marina Beach', status: 'Pending', region: 'Chennai', time: '2h ago' },
    { id: 2, title: 'Storm surge reported', status: 'Unverified', region: 'Pondicherry', time: '4h ago' },
    { id: 3, title: 'Coastal flooding', status: 'Pending', region: 'Tamil Nadu', time: '6h ago' }
  ];

  const quickActions = [
    {
      title: "Social Media",
      description: "Monitor real-time conversations",
      icon: MessageCircle,
      onClick: () => {}, // Placeholder
      color: "text-blue-500"
    },
    {
      title: "My Dashboard",
      description: "Personalized overview",
      icon: Layout,
      onClick: () => {}, // Already on dashboard
      color: "text-gray-600"
    },
    {
      title: "Reports",
      description: "View and manage reports",
      icon: FileText,
      onClick: () => {}, // Placeholder
      color: "text-gray-600"
    },
    {
      title: "Map View",
      description: "Interactive hazard map",
      icon: MapPin,
      onClick: () => {}, // Placeholder
      color: "text-gray-600"
    },
    {
      title: "Support & Alerts",
      description: "Notifications and help",
      icon: Bell,
      onClick: () => {}, // Placeholder
      color: "text-red-500"
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleIssueAlert = () => {
    // Placeholder for issue alert functionality
    console.log('Issue alert clicked');
  };

  const handleVerifyReports = () => {
    // Placeholder for verify reports functionality
    console.log('Verify reports clicked');
  };

  const handleCoordinateResponse = () => {
    // Placeholder for coordinate response functionality
    console.log('Coordinate response clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <ShieldIcon className="h-6 w-6 text-green-500" />
              <span className="text-xl font-semibold text-gray-900">Tarang Official Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Official
              </button>
              <button className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Official Dashboard</h1>
          <p className="text-gray-600">Manage resources, coordinate responses, and monitor hazard events</p>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center"
              onClick={action.onClick}
            >
              <action.icon className={`w-6 h-6 mb-2 ${action.color}`} />
              <h3 className="text-sm font-medium text-gray-900 mb-1">{action.title}</h3>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Today</p>
                <p className="text-3xl font-bold text-green-600">{stats.verifiedToday}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-red-600">{stats.activeAlerts}</p>
              </div>
              <Bell className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alerts Profile</p>
                <p className="text-3xl font-bold text-blue-600">{stats.alertsProfile}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Control Panel</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={handleIssueAlert}
              className="bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 flex items-center justify-center space-x-2 transition-colors"
            >
              <AlertCircle className="h-5 w-5" />
              <span>Issue Alert</span>
            </button>
            <button 
              onClick={handleVerifyReports}
              className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2 transition-colors"
            >
              <AlertCircle className="h-5 w-5" />
              <span>Verify Reports</span>
            </button>
            <button 
              onClick={handleCoordinateResponse}
              className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2 transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Coordinate Response</span>
            </button>
          </div>
        </div>

        {/* Main Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Verification Queue Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Verification Queue</span>
              </h3>
              <div className="flex items-center space-x-2 text-sm">
                <select 
                  value={filters.region} 
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1"
                >
                  <option>All Regions</option>
                  <option>Chennai</option>
                  <option>Pondicherry</option>
                </select>
                <select 
                  value={filters.status} 
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Unverified</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {verificationQueue.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          report.status === 'Unverified' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button className="text-green-600 hover:text-green-900 mr-3">Verify</button>
                        <button className="text-red-600 hover:text-red-900">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alert Management Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Alert Management</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{alert.type}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      alert.severity === 'High' ? 'bg-red-100 text-red-800' : 
                      alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Locations: {alert.locations}</p>
                  <p className="text-sm text-gray-600">Status: {alert.status}</p>
                  <div className="flex space-x-2 mt-3">
                    <button className="text-blue-600 hover:underline text-sm">Edit</button>
                    <button className="text-green-600 hover:underline text-sm">Activate</button>
                    <button className="text-red-600 hover:underline text-sm">Deactivate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Allocation Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Resource Allocation</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Emergency Teams</span>
                  <span className="text-sm font-medium text-gray-900">12 Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Medical Units</span>
                  <span className="text-sm font-medium text-gray-900">8 Deployed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Relief Supplies</span>
                  <span className="text-sm font-medium text-gray-900">₹2.5L Distributed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Volunteers</span>
                  <span className="text-sm font-medium text-gray-900">45 On Ground</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-sm font-medium">
                Manage Resources
              </button>
            </div>
          </div>

          {/* Hazard Map Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 col-span-1 lg:col-span-2">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Hazard Map</span>
              </h3>
            </div>
            <div className="p-6">
              <HazardMap />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficialDashboard;
