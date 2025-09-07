import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();

  const statsCards = [
    { title: 'Total Reports', value: '127', change: '+12% from last month', color: '#10b981' },
    { title: 'Active Volunteers', value: '89', change: '+8% from last month', color: '#3b82f6' },
    { title: 'Active Alerts', value: '12', change: '+5% from last month', color: '#f59e0b' }
  ];

  const socialMediaStats = [
    { title: 'Total Posts Monitored', value: '6', color: '#6366f1' },
    { title: 'Negative Sentiment', value: '4', color: '#ef4444' },
    { title: 'High Relevance', value: '4', color: '#f59e0b' },
    { title: 'Trending Topics', value: '5', color: '#10b981' }
  ];

  const trendingTopics = [
    { name: 'cyclone', posts: '3 posts', sentiment: 'negative' },
    { name: 'Bay of Bengal', posts: '2 posts', sentiment: 'neutral' },
    { name: 'IMD', posts: '2 posts', sentiment: 'negative' },
    { name: 'alert', posts: '2 posts', sentiment: 'negative' },
    { name: 'high waves', posts: '2 posts', sentiment: 'negative' }
  ];

  const highImpactPosts = [
    {
      source: '@IndiaMetDept',
      content: 'IMD issues cyclone warning for Bay of Bengal. Fishermen advised to return to shore immediately. #CycloneAlert #BayOfBengal',
      sentiment: 'negative',
      relevance: '98%'
    },
    {
      source: '@TheHindu',
      content: 'Cyclone Alert: IMD Issues Warning for East Coast Indian Meteorological Department has issued a cyclone warning for the east coast. Fishermen advised...',
      sentiment: 'negative',
      relevance: '89%'
    },
    {
      source: '@ChennaiWeatherLive',
      content: 'High waves reported at Chennai Marina Beach. Coast Guard advisory issued for fishing vessels. Wave height: 3.5m #ChennaiWeather #MarineAlert',
      sentiment: 'negative',
      relevance: '83%'
    }
  ];

  const hazardTrends = [
    { type: 'Tsunami', incidents: '15 incidents', trend: 'up', status: '7up' },
    { type: 'Cyclone', incidents: '8 incidents', trend: 'down', status: '3down' },
    { type: 'Storm Surge', incidents: '23 incidents', trend: 'stable', status: 'stable' },
    { type: 'Coastal Erosion', incidents: '31 incidents', trend: 'up', status: '7up' }
  ];

  const criticalAlerts = [
    {
      type: 'Tsunami Warning',
      location: 'Chennai Coast',
      time: '2025-01-15 14:30',
      severity: 'HIGH'
    },
    {
      type: 'Storm Surge',
      location: 'Visakhapatnam',
      time: '2025-01-15 12:45',
      severity: 'MEDIUM'
    },
    {
      type: 'Cyclone Alert',
      location: 'Kochi',
      time: '2025-01-15 10:15',
      severity: 'LOW'
    }
  ];

  const analysisTools = [
    { id: 'reports', title: 'Detailed Reports', icon: '📊', color: '#6366f1' },
    { id: 'geospatial', title: 'Geospatial Analysis', icon: '🌍', color: '#06b6d4' },
    { id: 'social', title: 'Social Media Analytics', icon: '📱', color: '#ec4899' },
    { id: 'predictive', title: 'Predictive Models', icon: '🔮', color: '#f59e0b' },
    { id: 'resource', title: 'Resource Management', icon: '🛠️', color: '#10b981' }
  ];

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Taranga Analytics Dashboard</h1>
          <p className="dashboard-subtitle">
            Comprehensive data insights and trend analysis for ocean hazard monitoring
          </p>
          <div className="header-actions">
            <button 
              className="header-button"
              onClick={() => navigate('/')}
            >
              🏠 Home
            </button>
            <button className="header-button">📄 Generate Report</button>
            <button className="header-button">📊 Export Data</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Stats Overview */}
        <section className="stats-overview">
          <div className="stats-grid">
            {statsCards.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="stat-title">{stat.title}</div>
                <div className="stat-change">{stat.change}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Social Media Monitoring */}
        <section className="social-media-section">
          <div className="section-header">
            <h2 className="section-title">📱 Social Media Monitoring</h2>
            <button 
              className="view-full-button"
              onClick={() => navigate('/social-media')}
            >
              View Full Dashboard →
            </button>
          </div>
          
          <div className="social-stats-grid">
            {socialMediaStats.map((stat, index) => (
              <div key={index} className="social-stat-card">
                <div className="social-stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="social-stat-title">{stat.title}</div>
              </div>
            ))}
          </div>

          <div className="social-content">
            <div className="trending-topics">
              <h3 className="subsection-title">🔥 Trending Topics</h3>
              <div className="topics-list">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="topic-item">
                    <span className="topic-name">{topic.name}</span>
                    <span className="topic-posts">({topic.posts})</span>
                    <span className={`topic-sentiment ${topic.sentiment}`}>
                      {topic.sentiment}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="high-impact-posts">
              <h3 className="subsection-title">📈 Recent High-Impact Posts</h3>
              <div className="posts-list">
                {highImpactPosts.map((post, index) => (
                  <div key={index} className="post-item">
                    <div className="post-source">{post.source}</div>
                    <div className="post-content">{post.content}</div>
                    <div className="post-meta">
                      <span className={`post-sentiment ${post.sentiment}`}>
                        {post.sentiment.toUpperCase()} • {post.relevance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Sections */}
        <div className="analytics-grid">
          {/* Hazard Trends */}
          <section className="hazard-trends">
            <h2 className="section-title">Hazard Trends Analysis</h2>
            <div className="trends-list">
              {hazardTrends.map((hazard, index) => (
                <div key={index} className="trend-item">
                  <div className="trend-info">
                    <div className="trend-type">{hazard.type}</div>
                    <div className="trend-incidents">{hazard.incidents}</div>
                  </div>
                  <div className={`trend-indicator ${hazard.trend}`}>
                    {hazard.status}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Critical Alerts */}
          <section className="critical-alerts">
            <h2 className="section-title">Recent Critical Alerts</h2>
            <div className="alerts-list">
              {criticalAlerts.map((alert, index) => (
                <div key={index} className="alert-item">
                  <div className="alert-content">
                    <div className="alert-type">{alert.type}</div>
                    <div className="alert-location">📍 {alert.location}</div>
                    <div className="alert-time">🕐 {alert.time}</div>
                  </div>
                  <div className={`alert-severity ${alert.severity.toLowerCase()}`}>
                    {alert.severity}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Data Analysis Tools */}
        <section className="analysis-tools">
          <h2 className="section-title">Data Analysis Tools</h2>
          <div className="tools-grid">
            {analysisTools.map((tool) => (
              <div key={tool.id} className="tool-card">
                <div className="tool-icon" style={{ color: tool.color }}>
                  {tool.icon}
                </div>
                <div className="tool-title">{tool.title}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;