import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CitizenDashboard.css';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Your Reports', value: '2', color: '#6366f1' },
    { label: 'Verified', value: '1', color: '#10b981' },
    { label: 'Pending', value: '1', color: '#f59e0b' }
  ];

  const recentReports = [
    {
      id: 1,
      title: 'High waves observed near beach',
      type: 'high_waves',
      status: 'unverified',
      severity: 'medium',
      date: '07/09/2025'
    },
    {
      id: 2,
      title: 'Strong currents in the bay',
      type: 'strong_currents',
      status: 'verified',
      severity: 'high',
      date: '07/09/2025'
    }
  ];

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
                  <div key={action.id} className="action-card">
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
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div 
                      className="stat-value"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Reports */}
            <section className="recent-reports-section">
              <h2 className="section-title">Recent Reports</h2>
              <div className="reports-list">
                {recentReports.map((report) => (
                  <div key={report.id} className="report-item">
                    <div className="report-content">
                      <div className={`report-status ${report.status}`}>
                        {report.status.toUpperCase()}
                      </div>
                      <h4 className="report-title">{report.title}</h4>
                      <div className="report-meta">
                        <span className="report-type">{report.type}</span>
                        <span className="report-date">{report.date}</span>
                      </div>
                    </div>
                    <div className={`report-severity ${report.severity}`}>
                      {report.severity.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'reports' && (
          <section className="reports-tab">
            <div className="reports-header">
              <h2>Your Reports</h2>
              <button className="new-report-button">+ New Report</button>
            </div>
            <div className="reports-list">
              {recentReports.map((report) => (
                <div key={report.id} className="report-card">
                  <div className={`report-status ${report.status}`}>
                    {report.status.toUpperCase()}
                  </div>
                  <h3 className="report-title">{report.title}</h3>
                  <div className="report-details">
                    <span className="report-type">{report.type}</span>
                    <span className="report-date">{report.date}</span>
                  </div>
                  <div className={`report-severity ${report.severity}`}>
                    {report.severity.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CitizenDashboard;