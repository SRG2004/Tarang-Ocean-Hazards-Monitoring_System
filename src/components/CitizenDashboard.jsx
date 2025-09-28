import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { FileText, Bell, Users, AlertCircle, MapPin } from 'lucide-react';
import { CreateReportForm } from '../components/CreateReportForm';
import { VolunteerRegistrationForm } from '../components/VolunteerRegistrationForm';
import Navbar from '../components/Navbar';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [showReportForm, setShowReportForm] = useState(false);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [userReports, setUserReports] = useState([]);

  // Mock data matching screenshot
  const stats = [
    { label: 'My Reports', value: 23, icon: FileText, color: 'text-primary' },
    { label: 'Recent Alerts', value: 19, icon: Bell, color: 'text-danger' },
    { label: 'Community', value: 12, icon: Users, color: 'text-success' }
  ];

  const recentReports = [
    { type: 'Storm Surge', location: 'Marina Beach', status: 'Verified' },
    { type: 'Coastal Flooding', location: 'Besant Nagar', status: 'Pending' },
    { type: 'High Waves', location: 'Elliot\'s Beach', status: 'Verified' }
  ];

  const recentAlerts = [
    { type: 'High Alert - Storm Surge', location: 'Marina Beach', time: '2 hours ago', severity: 'High' },
    { type: 'Medium Alert - Coastal Flooding', location: 'Besant Nagar', time: '5 hours ago', severity: 'Medium' },
    { type: 'Low Alert - High Waves', location: 'Elliot\'s Beach', time: '1 day ago', severity: 'Low' }
  ];

  const communityFeed = [
    {
      title: 'Beach Cleanup on Marina Beach',
      description: 'Join us this Saturday for a community beach cleanup. Help keep our shores clean!',
      time: '2 hours ago'
    },
    {
      title: 'Storm Surge Warning',
      description: 'High waves expected along the coast. Fishermen advised to stay ashore until further notice.',
      time: '4 hours ago'
    }
  ];

  useEffect(() => {
    // Load user reports - mock for now
    setUserReports(recentReports);
  }, []);

  const handleReportSubmit = () => {
    setShowReportForm(false);
    // Refresh reports
    setUserReports([...userReports, { type: 'New Report', location: 'New Location', status: 'Pending' }]);
  };

  const handleVolunteerSubmit = () => {
    setShowVolunteerForm(false);
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setShowReportForm(true)}
            className="btn-primary flex items-center justify-center space-x-2 py-4 px-6"
          >
            <AlertCircle className="h-5 w-5" />
            <span>Report Hazard</span>
          </button>
          <button
            onClick={() => setShowVolunteerForm(true)}
            className="btn-secondary flex items-center justify-center space-x-2 py-4 px-6"
          >
            <Users className="h-5 w-5" />
            <span>Join Network</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Reports Table */}
            <div className="card">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Recent Reports</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userReports.map((report, index) => (
                      <tr key={index}>
                        <td className="font-medium">{report.type}</td>
                        <td>{report.location}</td>
                        <td>
                          <span className={`badge ${report.status === 'Verified' ? 'badge-success' : 'badge-warning'}`}>
                            {report.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Community Feed */}
            <div className="card">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Community Updates</span>
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {communityFeed.map((update, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h4 className="font-medium text-text-primary">{update.title}</h4>
                    <p className="text-sm text-text-secondary mt-1">{update.description}</p>
                    <p className="text-xs text-text-muted mt-2">{update.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts Sidebar */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <div className="card">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Recent Alerts</span>
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.severity === 'High' ? 'bg-danger' :
                      alert.severity === 'Medium' ? 'bg-warning' : 'bg-success'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary text-sm">{alert.type}</h4>
                      <p className="text-xs text-text-secondary">{alert.location}</p>
                      <p className="text-xs text-text-muted">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High Alert */}
            <div className="card p-4 bg-danger/10 border-l-4 border-danger">
              <h4 className="font-semibold text-danger text-sm mb-2">High Alert</h4>
              <p className="text-xs text-text-secondary mb-3">Storm Surge Warning</p>
              <p className="text-xs text-text-secondary">Marina Beach area affected. Evacuation in progress.</p>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showReportForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Report Hazard</h3>
                <button onClick={() => setShowReportForm(false)} className="text-text-secondary hover:text-text-primary">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <CreateReportForm onReportSubmitted={handleReportSubmit} onClose={() => setShowReportForm(false)} />
            </div>
          </div>
        )}

        {showVolunteerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Join Volunteer Network</h3>
                <button onClick={() => setShowVolunteerForm(false)} className="text-text-secondary hover:text-text-primary">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <VolunteerRegistrationForm onRegistrationSuccess={handleVolunteerSubmit} onClose={() => setShowVolunteerForm(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CitizenDashboard;
