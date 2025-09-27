import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { hazardReportService } from '../services/hazardReportService';
import './CitizenDashboard.css';

const CreateReportForm = lazy(() => import('../components/CreateReportForm'));
const HazardMap = lazy(() => import('../components/HazardMap'));
const DonationForm = lazy(() => import('../components/DonationForm'));
const DonationList = lazy(() => import('../components/DonationList'));
const VolunteerRegistrationForm = lazy(() => import('../components/VolunteerRegistrationForm'));

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  });

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
        total: reports.length,
        verified: reports.filter((r) => r.status === 'verified').length,
        pending: reports.filter((r) => r.status === 'unverified' || r.status === 'pending').length,
        rejected: reports.filter((r) => r.status === 'rejected').length
      };
      setStats(statsData);
      
    } catch (error) {
      console.error('Error loading user reports:', error);
      // Use fallback data on error
      setUserReports([]);
      setStats({ total: 0, verified: 0, pending: 0, rejected: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleReportSuccess = () => {
    setShowCreateReport(false);
    loadUserReports(); // Refresh the reports list
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <section className="welcome-section">
            <div className="welcome-card">
              <h1 className="welcome-title">Welcome to Tarang</h1>
              <p className="welcome-subtitle">
                Stay informed and help keep our coastal communities safe
              </p>
            </div>
          </section>
        );
      case 'reports':
        return (
          <section className="reports-tab">
            <div className="reports-header">
              <h2>Your Reports</h2>
              <button 
                className="new-report-button"
                onClick={() => setShowCreateReport(true)}
              >
                + New Report
              </button>
            </div>
            <div className="reports-list">
              {loading ? (
                <div className="loading-state">Loading your reports...</div>
              ) : userReports.length === 0 ? (
                <div className="empty-state">
                  <p>No reports yet. Submit your first hazard report!</p>
                  <button 
                    className="new-report-button"
                    onClick={() => setShowCreateReport(true)}
                  >
                    + Create Your First Report
                  </button>
                </div>
              ) : (
                userReports.map((report) => (
                  <div key={report.id} className="report-card">
                    <div className={`report-status ${report.status}`}>
                      {report.status.toUpperCase()}
                    </div>
                    <h3 className="report-title">{report.title || 'Ocean Hazard Report'}</h3>
                    <div className="report-details">
                      <span className="report-type">{report.type.replace('_', ' ')}</span>
                      <span className="report-date">{new Date(report.reportedAt).toLocaleDateString()}</span>
                    </div>
                    <div className={`report-severity ${report.severity}`}>
                      {report.severity.toUpperCase()}
                    </div>
                    {report.description && (
                      <p className="report-description">{report.description}</p>
                    )}
                    {report.images && report.images.length > 0 && (
                      <div className="report-images">
                        {report.images.slice(0, 3).map((imageUrl, index) => (
                          <img 
                            key={index} 
                            src={imageUrl} 
                            alt={`Report image ${index + 1}`}
                            className="report-image-thumbnail"
                          />
                        ))}
                        {report.images.length > 3 && (
                          <span className="more-images">+{report.images.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        );
      case 'map':
        return <HazardMap />;
      case 'donations':
        return (
          <>
            <DonationForm onDonationSuccess={() => {}} />
            <DonationList />
          </>
        );
      case 'volunteer':
        return <VolunteerRegistrationForm onRegistrationSuccess={() => {}} />;
      default:
        return null;
    }
  };

  return (
    <div className="citizen-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <button 
              className="logo-button"
              onClick={() => navigate('/')}
            >
              🏠 Tarang Citizen Dashboard
            </button>
          </div>
          <div className="header-actions">
            <button className="user-button">Citizen</button>
            <button className="sign-out-button">Sign Out</button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          My Reports
        </button>
        <button 
          className={`nav-tab ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          Hazard Map
        </button>
        <button 
          className={`nav-tab ${activeTab === 'donations' ? 'active' : ''}`}
          onClick={() => setActiveTab('donations')}
        >
          Donations
        </button>
        <button 
          className={`nav-tab ${activeTab === 'volunteer' ? 'active' : ''}`}
          onClick={() => setActiveTab('volunteer')}
        >
          Volunteer
        </button>
      </nav>

      <main className="dashboard-main">
        <Suspense fallback={<div>Loading...</div>}>
          {renderTabContent()}
        </Suspense>
      </main>

      {/* Create Report Modal */}
      {showCreateReport && (
        <Suspense fallback={<div>Loading...</div>}>
          <CreateReportForm
            onReportSubmitted={handleReportSuccess}
          />
        </Suspense>
      )}
    </div>
  );
};

export default CitizenDashboard;