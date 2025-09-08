import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hazardReportService } from '../services/hazardReportService';
import CreateReportForm from '../components/CreateReportForm';
import './CitizenDashboard.css';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
      
      // Calculate stats
      const statsData = {
        total: reports.length,
        verified: reports.filter(r => r.status === 'verified').length,
        pending: reports.filter(r => r.status === 'unverified' || r.status === 'pending').length,
        rejected: reports.filter(r => r.status === 'rejected').length
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

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'report':
        setShowCreateReport(true);
        break;
      case 'map':
        navigate('/map');
        break;
      case 'community':
        navigate('/social-media');
        break;
      case 'settings':
        navigate('/profile');
        break;
      case 'support':
        navigate('/donations');
        break;
      default:
        console.log('Action not implemented:', actionId);
    }
  };

  const quickActions = [
    {
      id: 'report',
      title: 'Report Hazard',
      description: 'Report ocean hazards you observe',
      icon: '⚠️',
      color: '#ef4444'
    },
    {
      id: 'map',
      title: 'View Map',
      description: 'See hazard hotspots and alerts',
      icon: '🗺️',
      color: '#06b6d4'
    },
    {
      id: 'community',
      title: 'Community Feed',
      description: 'Connect with other citizens',
      icon: '👥',
      color: '#8b5cf6'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Manage your preferences',
      icon: '⚙️',
      color: '#64748b'
    },
    {
      id: 'support',
      title: 'Support Relief',
      description: 'Donate to help emergency response',
      icon: '❤️',
      color: '#10b981'
    }
  ];

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
              🏠 Taranga Citizen Dashboard
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
      </nav>

      <main className="dashboard-main">
        {activeTab === 'dashboard' && (
          <>
            {/* Welcome Section */}
            <section className="welcome-section">
              <div className="welcome-card">
                <h1 className="welcome-title">Welcome to Taranga</h1>
                <p className="welcome-subtitle">
                  Stay informed and help keep our coastal communities safe
                </p>
              </div>
            </section>

            {/* Emergency Relief Fund */}
            <section className="relief-section">
              <div className="relief-card">
                <div className="relief-content">
                  <div className="relief-icon">🏥</div>
                  <div className="relief-info">
                    <h3>Emergency Relief Fund</h3>
                    <p>Support communities affected by ocean hazards. Your donation helps provide emergency supplies, rescue equipment, and recovery assistance.</p>
                  </div>
                  <div className="relief-stats">
                    <div className="relief-amount">₹65.21</div>
                    <div className="relief-label">Raised</div>
                  </div>
                  <button 
                    className="donate-button"
                    onClick={() => navigate('/donations')}
                  >
                    💝 Donate Now
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Actions Grid */}
            <section className="actions-section">
              <div className="actions-grid">
                {quickActions.map((action) => (
                  <div 
                    key={action.id} 
                    className="action-card"
                    onClick={() => handleQuickAction(action.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div 
                      className="action-icon"
                      style={{ color: action.color }}
                    >
                      {action.icon}
                    </div>
                    <h3 className="action-title">{action.title}</h3>
                    <p className="action-description">{action.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Stats Cards */}
            <section className="stats-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value" style={{ color: '#6366f1' }}>
                    {loading ? '...' : stats.total}
                  </div>
                  <div className="stat-label">Your Reports</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: '#10b981' }}>
                    {loading ? '...' : stats.verified}
                  </div>
                  <div className="stat-label">Verified</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: '#f59e0b' }}>
                    {loading ? '...' : stats.pending}
                  </div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: '#ef4444' }}>
                    {loading ? '...' : stats.rejected}
                  </div>
                  <div className="stat-label">Rejected</div>
                </div>
              </div>
            </section>

            {/* Recent Reports */}
            <section className="recent-reports-section">
              <h2 className="section-title">Recent Reports</h2>
              <div className="reports-list">
                {loading ? (
                  <div className="loading-state">Loading your reports...</div>
                ) : userReports.length === 0 ? (
                  <div className="empty-state">
                    <p>No reports yet. Click "Report Hazard" to submit your first report!</p>
                  </div>
                ) : (
                  userReports.slice(0, 3).map((report) => (
                    <div key={report.id} className="report-item">
                      <div className="report-content">
                        <div className={`report-status ${report.status}`}>
                          {report.status.toUpperCase()}
                        </div>
                        <h4 className="report-title">{report.title || 'Ocean Hazard Report'}</h4>
                        <div className="report-meta">
                          <span className="report-type">{report.type.replace('_', ' ')}</span>
                          <span className="report-date">{new Date(report.reportedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className={`report-severity ${report.severity}`}>
                        {report.severity.toUpperCase()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'reports' && (
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
        )}
      </main>

      {/* Create Report Modal */}
      {showCreateReport && (
        <CreateReportForm
          onClose={() => setShowCreateReport(false)}
          onSuccess={handleReportSuccess}
        />
      )}
    </div>
  );
};

export default CitizenDashboard;