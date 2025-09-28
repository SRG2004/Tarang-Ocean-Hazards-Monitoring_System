import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { hazardReportService } from '../services/hazardReportService';
import { AlertCircle, MapPin, Users, Bell, MessageCircle, Layout, FileText, Map as MapIcon, Settings, Heart } from 'lucide-react';
import './CitizenDashboard.css';

const CreateReportForm = lazy(() => import('../components/CreateReportForm'));
const HazardMap = lazy(() => import('../components/HazardMap'));
const DonationForm = lazy(() => import('../components/DonationForm'));
const DonationList = lazy(() => import('../components/DonationList'));
const VolunteerRegistrationForm = lazy(() => import('../components/VolunteerRegistrationForm'));

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    totalReports: 23,
    verified: 19,
    alerts: 12
  });
  const [recentAlerts] = useState([
    { id: 1, type: 'Storm Surge', location: 'Marina Beach', time: '2 hours ago', severity: 'High' },
    { id: 2, type: 'Coastal Flooding', location: 'Besant Nagar', time: '5 hours ago', severity: 'Medium' },
    { id: 3, type: 'High Waves', location: 'Elliot\'s Beach', time: '1 day ago', severity: 'Low' }
  ]);

  const quickActions = [
    {
      title: "Social Media",
      description: "Monitor real-time conversations",
      icon: MessageCircle,
      onClick: () => navigate('/social-media'),
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
      onClick: () => setShowCreateReport(true),
      color: "text-gray-600"
    },
    {
      title: "Map View",
      description: "Interactive hazard map",
      icon: MapIcon,
      onClick: () => navigate('/map'),
      color: "text-gray-600"
    },
    {
      title: "Support & Alerts",
      description: "Notifications and help",
      icon: Bell,
      onClick: () => navigate('/alerts'),
      color: "text-red-500"
    }
  ];

  // Load user reports on component mount
  useEffect(() => {
    loadUserReports();
  }, [user]);

  const loadUserReports = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const reports = await hazardReportService.getReports({ 
        userId: user.uid,
        limit: 20 
      });
      
      setUserReports(reports);
      
    } catch (error) {
      console.error('Error loading user reports:', error);
      // Use fallback data on error
      setUserReports([]);
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

  const mockCommunityFeed = [
    {
      user: "Local Fisherman",
      message: "Strong currents observed near the bay. Fishermen advised to stay ashore.",
      time: "2 hours ago",
      likes: 12
    },
    {
      user: "Coastal Resident",
      message: "High waves at Marina Beach. Please be cautious while walking along the shore.",
      time: "4 hours ago",
      likes: 8
    }
  ];

  const renderDashboardContent = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alerts</p>
              <p className="text-3xl font-bold text-red-600">{stats.alerts}</p>
            </div>
            <Bell className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

      {/* Main Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Your Reports</span>
            </h3>
            <button 
              onClick={() => setShowCreateReport(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
            >
              New Report
            </button>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-gray-500">Loading reports...</p>
            ) : userReports.length === 0 ? (
              <p className="text-gray-500">No reports yet. <button onClick={() => setShowCreateReport(true)} className="text-blue-600 hover:underline">Create one now</button></p>
            ) : (
              <div className="space-y-3">
                {userReports.slice(0, 3).map((report) => (
                  <div key={report.id} className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium text-gray-900">{report.title || 'Hazard Report'}</h4>
                    <p className="text-sm text-gray-600">Status: <span className={`px-2 py-1 rounded-full text-xs ${
                      report.status === 'verified' ? 'bg-green-100 text-green-800' :
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>{report.status}</span></p>
                  </div>
                ))}
                {userReports.length > 3 && (
                  <button className="text-blue-600 hover:underline text-sm">View all reports</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Alerts Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Recent Alerts</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    alert.severity === 'High' ? 'bg-red-500' : 
                    alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{alert.type}</h4>
                    <p className="text-sm text-gray-600">{alert.location} • {alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 col-span-1 lg:col-span-2">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Your Area Map</span>
            </h3>
          </div>
          <div className="p-6">
            <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading map...</div>}>
              <HazardMap />
            </Suspense>
          </div>
        </div>

        {/* Community Feed Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Community Feed</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockCommunityFeed.map((post, index) => (
                <div key={index} className="flex space-x-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{post.user}</h4>
                      <span className="text-xs text-gray-500">{post.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{post.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-gray-700">
                        <Heart className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </button>
                      <span>Reply</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-blue-600 hover:underline text-sm">View more posts</button>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Profile</span>
                <button className="text-blue-600 hover:underline text-sm">Edit</button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Notifications</span>
                <button className="text-blue-600 hover:underline text-sm">Manage</button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Privacy</span>
                <button className="text-blue-600 hover:underline text-sm">Settings</button>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Relief Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Heart className="h-5 w-5 text-green-500" />
              <span>Emergency Relief Fund</span>
            </h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">Support efforts on the ground. Your donation helps provide emergency resources and community support.</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-green-600">₹1,250</span>
              <span className="text-sm text-gray-500">Raised this month</span>
            </div>
            <button
              onClick={() => setShowDonationModal(true)}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 text-sm font-medium"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Tarang</h1>
          <p className="text-gray-600">Your personalized ocean hazard monitoring dashboard</p>
        </div>

        {renderDashboardContent()}

        {/* Modals */}
        {/* Create Report Modal */}
        {showCreateReport && (
          <Suspense fallback={<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded">Loading form...</div>
          </div>}>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
                <CreateReportForm
                  onReportSubmitted={handleReportSuccess}
                  onClose={() => setShowCreateReport(false)}
                />
              </div>
            </div>
          </Suspense>
        )}

        {/* Donation Modal */}
        {showDonationModal && (
          <Suspense fallback={<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded">Loading...</div>
          </div>}>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <DonationForm onDonationSuccess={() => setShowDonationModal(false)} />
              </div>
            </div>
          </Suspense>
        )}

        {/* Volunteer Modal */}
        {showVolunteerModal && (
          <Suspense fallback={<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded">Loading...</div>
          </div>}>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <VolunteerRegistrationForm onRegistrationSuccess={() => setShowVolunteerModal(false)} />
              </div>
            </div>
          </Suspense>
        )}
      </main>
    </div>
  );
};

export default CitizenDashboard;
