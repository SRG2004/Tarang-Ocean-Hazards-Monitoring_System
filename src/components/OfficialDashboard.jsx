import React, { useState } from 'react';
import { AlertCircle, Filter, Search, Clock, MapPin, Users, Bell, FileText, BarChart3 } from 'lucide-react';
import { HazardMap } from './HazardMap';
import './OfficialDashboard.css'; // Assume CSS file exists or create if needed

const OfficialDashboard = () => {
  const [activeSection, setActiveSection] = useState('verification');
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4">
            {[
              { key: 'issue', label: 'Issue Alert', icon: AlertCircle },
              { key: 'verify', label: 'Verify', icon: CheckCircle },
              { key: 'coordinate', label: 'Coordinate Response', icon: Users },
              { key: 'generate', label: 'Generate Report', icon: FileText }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeSection === item.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } flex items-center space-x-2`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Today</p>
                <p className="text-3xl font-bold text-green-600">{stats.verifiedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-red-600">{stats.activeAlerts}</p>
              </div>
              <Bell className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
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
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Control Panel</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Issue Alert</span>
            </button>
            <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Verify Reports</span>
            </button>
            <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Coordinate Response</span>
            </button>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Verification Queue */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Verification Queue</span>
              </h3>
              <div className="flex items-center space-x-2">
                <select 
                  value={filters.region} 
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option>All Regions</option>
                  <option>Chennai</option>
                  <option>Pondicherry</option>
                </select>
                <select 
                  value={filters.status} 
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Unverified</option>
                </select>
                <select 
                  value={filters.time} 
                  onChange={(e) => handleFilterChange('time', e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option>24h</option>
                  <option>48h</option>
                  <option>7d</option>
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

          {/* Alert Management */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
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

            {/* Hazard Map Sidebar */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Hazard Map</span>
                </h3>
              </div>
              <div className="p-6 h-64 overflow-hidden rounded-b-lg">
                <HazardMap />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialDashboard;
