import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { AlertTriangle, Users, FileText, Bell, Users2, AlertCircle, Database, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';

const OfficialDashboard = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [filters, setFilters] = useState({ region: 'All', status: 'All', time: '24h' });

  // Mock data matching screenshot
  const stats = [
    { label: 'Pending Verification', value: 47, icon: AlertTriangle, color: 'text-warning' },
    { label: 'Verified Today', value: 23, icon: Users, color: 'text-success' },
    { label: 'Active Alerts', value: 8, icon: Bell, color: 'text-danger' },
    { label: 'Alerts Profile', value: 15, icon: Users2, color: 'text-primary' }
  ];

  const verificationQueue = [
    { id: 1, title: 'High waves at Marina Beach', status: 'Pending', region: 'Chennai', time: '2h ago' },
    { id: 2, title: 'Storm surge reported', status: 'Unverified', region: 'Pondicherry', time: '4h ago' },
    { id: 3, title: 'Coastal flooding', status: 'Pending', region: 'Tamil Nadu', time: '6h ago' }
  ];

  const alerts = [
    { type: 'Storm Surge', severity: 'High', locations: 5, status: 'Active' },
    { type: 'High Waves', severity: 'Medium', locations: 3, status: 'Active' },
    { type: 'Coastal Flooding', severity: 'Low', locations: 2, status: 'Monitoring' }
  ];

  const resources = [
    { label: 'Emergency Teams', value: '12 Active' },
    { label: 'Medical Units', value: '8 Deployed' },
    { label: 'Relief Supplies', value: '₹2.5L Distributed' },
    { label: 'Volunteers', value: '45 On Ground' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAction = (action) => {
    console.log(`${action} clicked`);
    // Implement actions
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Control Panel */}
        <div className="card mb-8">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-text-primary">Control Panel</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => handleAction('Issue Alert')}
              className="btn-primary bg-danger text-white p-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-danger/90"
            >
              <AlertCircle className="h-5 w-5" />
              <span>Issue Alert</span>
            </button>
            <button 
              onClick={() => handleAction('Verify')}
              className="btn-primary bg-success text-white p-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-success/90"
            >
              <Users className="h-5 w-5" />
              <span>Verify</span>
            </button>
            <button 
              onClick={() => handleAction('Coordinate Response')}
              className="btn-primary bg-primary text-white p-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-primary/90"
            >
              <Users2 className="h-5 w-5" />
              <span>Coordinate Response</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Verification Queue */}
          <div className="card">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Verification Queue</span>
              </h3>
              <div className="flex items-center space-x-2">
                <select 
                  value={filters.region} 
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="input text-sm px-2 py-1"
                >
                  <option>All Regions</option>
                  <option>Chennai</option>
                  <option>Pondicherry</option>
                </select>
                <select 
                  value={filters.status} 
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="input text-sm px-2 py-1"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Unverified</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Report</th>
                    <th>Status</th>
                    <th>Region</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {verificationQueue.map((report, index) => (
                    <tr key={index}>
                      <td className="font-medium">{report.title}</td>
                      <td>
                        <span className={`badge ${report.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                          {report.status}
                        </span>
                      </td>
                      <td>{report.region}</td>
                      <td>{report.time}</td>
                      <td className="space-x-2">
                        <button className="text-primary hover:underline text-sm">View</button>
                        <button className="text-success hover:underline text-sm">Verify</button>
                        <button className="text-danger hover:underline text-sm">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alert Management */}
          <div className="card">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Alert Management</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="bg-secondary/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text-primary">{alert.type}</h4>
                    <span className={`badge ${alert.severity === 'High' ? 'badge-danger' : alert.severity === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">Locations: {alert.locations}</p>
                  <p className="text-sm text-text-secondary">Status: {alert.status}</p>
                  <div className="flex space-x-2 mt-3">
                    <button className="text-primary hover:underline text-sm">Edit</button>
                    <button className="text-success hover:underline text-sm">Activate</button>
                    <button className="text-danger hover:underline text-sm">Deactivate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Allocation */}
          <div className="card">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Resource Allocation</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {resources.map((resource, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                  <span className="text-sm text-text-secondary">{resource.label}</span>
                  <span className="text-sm font-medium text-text-primary">{resource.value}</span>
                </div>
              ))}
              <button 
                onClick={() => handleAction('Manage Resources')}
                className="w-full btn-primary mt-4"
              >
                Manage Resources
              </button>
            </div>
          </div>

          {/* Hazard Map */}
          <div className="card col-span-1 lg:col-span-2">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Hazard Map</span>
              </h3>
            </div>
            <div className="p-6">
              {/* Placeholder for map - implement HazardMap component */}
              <div className="h-64 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-text-secondary">Interactive Hazard Map</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficialDashboard;
