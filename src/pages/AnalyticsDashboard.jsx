import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hazardReportService } from '../services/hazardReportService';
import { socialMediaService } from '../services/socialMediaService';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState({
    totalReports: 0,
    activeVolunteers: 0,
    activeAlerts: 0,
    socialMediaPosts: 0,
    negativeSentiment: 0,
    highRelevance: 0,
    trendingTopics: 0
  });
  const [socialMediaStats, setSocialMediaStats] = useState({});
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [socialMediaPosts, setSocialMediaPosts] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Load hazard reports data
      const reportsPromise = hazardReportService.getReports({ limit: 50 });
      
      // Load social media data
      const socialDataPromise = socialMediaService.fetchSimulatedSocialMediaData();
      const trendingPromise = socialMediaService.getSimulatedTrendingTopics(10);
      const sentimentPromise = socialMediaService.getSimulatedSentimentStats();
      
      const [reports, socialPosts, trending, sentimentStats] = await Promise.all([
        reportsPromise,
        socialDataPromise,
        trendingPromise,
        sentimentPromise
      ]);
      
      // Process reports data
      setRecentReports(reports.slice(0, 10));
      
      // Calculate analytics from real data
      const analyticsData = {
        totalReports: reports.length,
        activeVolunteers: Math.floor(reports.length * 0.7), // Simulated based on reports
        activeAlerts: reports.filter(r => r.severity === 'critical' || r.severity === 'high').length,
        socialMediaPosts: socialPosts.length,
        negativeSentiment: sentimentStats.negative || 0,
        highRelevance: socialPosts.filter(p => p.isHazardRelated).length,
        trendingTopics: trending.length
      };
      
      setRealTimeData(analyticsData);
      setSocialMediaStats(sentimentStats);
      setTrendingTopics(trending);
      setSocialMediaPosts(socialPosts.slice(0, 5));
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Keep default/fallback data on error
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadAnalyticsData();
  };

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
            <button 
              className="header-button"
              onClick={refreshData}
              disabled={loading}
            >
              {loading ? '🔄 Refreshing...' : '🔄 Refresh Data'}
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
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#10b981' }}>
                {loading ? '...' : realTimeData.totalReports}
              </div>
              <div className="stat-title">Total Reports</div>
              <div className="stat-change">From Firebase Database</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#f59e0b' }}>
                {loading ? '...' : realTimeData.activeAlerts}
              </div>
              <div className="stat-title">Active Alerts</div>
              <div className="stat-change">High/Critical Severity</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#3b82f6' }}>
                {loading ? '...' : realTimeData.socialMediaPosts}
              </div>
              <div className="stat-title">Social Media Posts</div>
              <div className="stat-change">Monitored Today</div>
            </div>
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
            <div className="social-stat-card">
              <div className="social-stat-value" style={{ color: '#6366f1' }}>
                {loading ? '...' : realTimeData.socialMediaPosts}
              </div>
              <div className="social-stat-title">Total Posts Monitored</div>
            </div>
            <div className="social-stat-card">
              <div className="social-stat-value" style={{ color: '#ef4444' }}>
                {loading ? '...' : socialMediaStats.negative || 0}
              </div>
              <div className="social-stat-title">Negative Sentiment</div>
            </div>
            <div className="social-stat-card">
              <div className="social-stat-value" style={{ color: '#f59e0b' }}>
                {loading ? '...' : realTimeData.highRelevance}
              </div>
              <div className="social-stat-title">High Relevance</div>
            </div>
            <div className="social-stat-card">
              <div className="social-stat-value" style={{ color: '#10b981' }}>
                {loading ? '...' : trendingTopics.length}
              </div>
              <div className="social-stat-title">Trending Topics</div>
            </div>
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
                {loading ? (
                  <div className="loading-state">Loading social media data...</div>
                ) : socialMediaPosts.length === 0 ? (
                  <div className="empty-state">No high-impact posts found</div>
                ) : (
                  socialMediaPosts.map((post, index) => (
                    <div key={index} className="post-item">
                      <div className="post-source">{post.author}</div>
                      <div className="post-content">{post.content}</div>
                      <div className="post-meta">
                        <span className={`post-sentiment ${post.sentiment.label}`}>
                          {post.sentiment.label.toUpperCase()} • {post.platform}
                        </span>
                      </div>
                    </div>
                  ))
                )}
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