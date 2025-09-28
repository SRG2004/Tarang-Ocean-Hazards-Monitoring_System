import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { hazardReportService } from '../services/hazardReportService';
import { AlertCircle, MapPin, Users, Bell } from 'lucide-react';
import './CitizenDashboard.css';

const CreateReportForm = lazy(() => import('../components/CreateReportForm'));
const HazardMap = lazy(() => import('../components/HazardMap'));
const DonationForm = lazy(() => import('../components/DonationForm'));
const DonationList = lazy(() => import('../components/DonationList'));
const VolunteerRegistrationForm = lazy(() => import('../components/VolunteerRegistrationForm'));

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 23,
    verified: 19,
    alerts: 12
  });
  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, type: 'Storm Surge', location: 'Marina Beach', time: '2 hours ago', severity: 'High' },
    { id: 2, type: 'Coastal Flooding', location: 'Besant Nagar', time: '5 hours ago', severity: 'Medium' },
    { id: 3, type: 'High Waves', location: 'Elliot\'s Beach', time: '1 day ago', severity: 'Low' }
  ]);

  // Load user reports on component mount
  useEffect(() => {
    if (activeTab === 'reports') {
      loadUserReports();
    }
  }, [user, activeTab]);

  const loadUserReports = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const reports = await hazardReportService.getReports({ 
        userId: user.uid,
        limit: 20 
      });
      
      setUserReports(reports);
      
      // Calculate stats
      const statsData = {
        totalReports: reports.length,
        verified: reports.filter((r) => r.status === 'verified').length,
        alerts: reports.filter((r) => r.status === 'alert').length
      };
      setStats(statsData);
      
    } catch (error) {
      console.error('Error loading user reports:', error);
      // Use fallback data on error
      setUserReports([]);
      setStats({ totalReports: 0, verified: 0, alerts: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleReportSuccess = () => {
    setShowCreateReport(false);
    loadUserReports(); // Refresh the reports list
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Verified</p>
                    <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Alerts</p>
                    <p className="text-3xl font-bold text-red-600">{stats.alerts}</p>
                  </div>
                  <Bell className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button 
                onClick={() => setShowCreateReport(true)}
                className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 flex items-center space-x-3"
              >
                <AlertCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Report Hazard</h3>
                  <p className="text-sm text-blue-100">Quickly report observed hazards</p>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('volunteer')}
                className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 flex items-center space-x-3"
              >
                <Users className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Join Volunteer</h3>
                  <p className="text-sm text-green-100">Join the volunteer network</p>
                </div>
              </button>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          alert.severity === 'High' ? 'bg-red-500' : 
                          alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{alert.type}</h4>
                        <p className="text-sm text-gray-600">{alert.location} • {alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Your Area Map */}
            <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Your Area Map</span>
                </h3>
              </div>
              <div className="p-6">
                <Suspense fallback={<div className="text-center py-8">Loading map...</div>}>
                  <HazardMap />
                </Suspense>
              </div>
            </div>
          </div>
        );
      case 'reports':
        if (loading) return <div className="p-6 text-center">Loading reports...</div>;
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">My Reports ({userReports.length})</h3>
            {userReports.length === 0 ? (
              <p className="text-gray-500">No reports yet. <button onClick={() => setShowCreateReport(true)} className="text-blue-600 hover:underline">Create one now</button></p>
            ) : (
              <div className="space-y-4">
                {userReports.map((report) => (
                  <div key={report.id} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium">{report.title || 'Hazard Report'}</h4>
                    <p className="text-sm text-gray-600">Status: {report.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'map':
        return (
          <div className="p-6">
            <Suspense fallback={<div className="text-center py-8">Loading map...</div>}>
              <HazardMap />
            </Suspense>
          </div>
        );
      case 'donations':
        return (
          <>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Donations</h3>
              <Suspense fallback={<div>Loading...</div>}>
                <DonationForm onDonationSuccess={() => {}} />
                <DonationList />
              </Suspense>
            </div>
          </>
        );
      case 'volunteer':
        return (
          <div className="p-6">
            <Suspense fallback={<div>Loading...</div>}>
              <VolunteerRegistrationForm onRegistrationSuccess={() => {}} />
            </Suspense>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              onClick={() => navigate('/')}
            >
              <span className="text-xl">🏠</span>
              <span className="font-semibold">Tarang Citizen Dashboard</span>
            </button>
            <div className="flex items-center space-x-4">
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Citizen
              </button>
              <button 
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'reports', label: 'My Reports' },
              { key: 'map', label: 'Hazard Map' },
              { key: 'donations', label: 'Donations' },
              { key: 'volunteer', label: 'Volunteer' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          {renderTabContent()}
        </Suspense>
      </main>

      {/* Create Report Modal */}
      {showCreateReport && (
        <Suspense fallback={<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">Loading form...</div>
        </div>}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <CreateReportForm
                onReportSubmitted={handleReportSuccess}
                onClose={() => setShowCreateReport(false)}
              />
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default CitizenDashboard;
