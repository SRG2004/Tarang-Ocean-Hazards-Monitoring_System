import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'social-media',
      title: 'Social Media',
      subtitle: 'Analytics & Monitoring',
      color: '#6366f1',
      icon: '📱',
      onClick: () => navigate('/social-media')
    },
    {
      id: 'dashboard',
      title: 'My Dashboard',
      subtitle: 'Control Panel',
      color: '#ef4444',
      icon: '📊',
      onClick: () => navigate('/analyst')
    },
    {
      id: 'reports',
      title: 'Reports',
      subtitle: 'Hazard Reports',
      color: '#06b6d4',
      icon: '📋',
      onClick: () => navigate('/citizen')
    },
    {
      id: 'map',
      title: 'Map View',
      subtitle: 'Interactive View',
      color: '#ec4899',
      icon: '🗺️',
      onClick: () => navigate('/map')
    },
    {
      id: 'support',
      title: 'Support Relief',
      subtitle: 'Resources & Donations',
      color: '#10b981',
      icon: '🤝',
      onClick: () => navigate('/donations')
    }
  ];

  const userRoles = [
    {
      id: 'citizens',
      title: 'Citizens',
      subtitle: 'Report hazards, view alerts',
      features: [
        'Report Ocean Hazards',
        'Receive Real-time Alerts',
        'Community Updates',
        'Emergency Contacts'
      ],
      buttonText: 'Enter as Citizen',
      color: '#6366f1',
      icon: '👥',
      onClick: () => navigate('/citizen')
    },
    {
      id: 'officials',
      title: 'Officials',
      subtitle: 'Manage responses, monitor dashboards',
      features: [
        'Response Management',
        'Emergency Coordination',
        'Resource Allocation',
        'Public Communications'
      ],
      buttonText: 'Enter as Officer (Requires Login)',
      color: '#f59e0b',
      icon: '🛡️',
      disabled: true,
      onClick: () => navigate('/login')
    },
    {
      id: 'analysts',
      title: 'Analysts',
      subtitle: 'Access data insights, trends, and reports',
      features: [
        'Data Analytics',
        'Trend Analysis',
        'Predictive Models',
        'Research Reports'
      ],
      buttonText: 'Enter as Analyst (Requires Login)',
      color: '#8b5cf6',
      icon: '📈',
      disabled: true,
      onClick: () => navigate('/login')
    }
  ];

  const features = [
    {
      id: 'maps',
      title: 'Interactive Maps',
      subtitle: 'Real-time hazard visualization with dynamic hotspots',
      icon: '📍',
      color: '#ef4444'
    },
    {
      id: 'alerts',
      title: 'Smart Alerts',
      subtitle: 'AI-powered notifications for immediate response',
      icon: '🔔',
      color: '#f59e0b'
    },
    {
      id: 'community',
      title: 'Community Driven',
      subtitle: 'Collaborative reporting and volunteer coordination',
      icon: '👥',
      color: '#8b5cf6'
    },
    {
      id: 'insights',
      title: 'Data Insights',
      subtitle: 'Advanced analytics for informed decision making',
      icon: '📊',
      color: '#06b6d4'
    }
  ];

  return (
    <div className="homepage">
      {/* Main Content */}
      <main className="homepage-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Your Ocean Hazard <span className="highlight">Command Center</span>
            </h1>
            <p className="hero-subtitle">
              Welcome to your personalized dashboard. Access real-time hazard data,
              social media analytics, and manage your ocean safety monitoring activities
              all in one place.
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className="quick-action-card"
                style={{ '--action-color': action.color }}
                onClick={action.onClick}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-subtitle">{action.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Roles Section */}
        <section className="user-roles-section">
          <div className="roles-grid">
            {userRoles.map((role) => (
              <div key={role.id} className="role-card">
                <div className="role-header">
                  <div className="role-icon" style={{ color: role.color }}>
                    {role.icon}
                  </div>
                  <div className="role-info">
                    <h3 className="role-title">{role.title}</h3>
                    <p className="role-subtitle">{role.subtitle}</p>
                  </div>
                </div>
                <ul className="role-features">
                  {role.features.map((feature, index) => (
                    <li key={index} className="role-feature">• {feature}</li>
                  ))}
                </ul>
                <button
                  className={`role-button ${role.disabled ? 'disabled' : ''}`}
                  style={{ backgroundColor: role.disabled ? '#94a3b8' : role.color }}
                  onClick={role.onClick}
                  disabled={role.disabled}
                >
                  {role.buttonText}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-section">
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-subtitle">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Volunteer Registration CTA */}
        <section className="cta-section">
          <div className="cta-card">
            <h2 className="cta-title">Volunteer Registration</h2>
            <p className="cta-subtitle">
              Join our volunteer network to help with ocean hazard monitoring, emergency response, and community safety initiatives.
            </p>
            <div className="cta-buttons">
              <button 
                className="cta-button primary"
                onClick={() => navigate('/volunteer-registration')}
              >
                🤝 Volunteer Registration
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
