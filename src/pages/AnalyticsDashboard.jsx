import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hazardReportService } from '../services/hazardReportService';
import { socialMediaService } from '../services/socialMediaService';
import '../styles/globals.css';

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

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const reportsPromise = hazardReportService.getReports({ limit: 50 });
      const socialDataPromise = socialMediaService.fetchSimulatedSocialMediaData();
      const trendingPromise = socialMediaService.getSimulatedTrendingTopics(10);
      const sentimentPromise = socialMediaService.getSimulatedSentimentStats();
      
      const [reports, socialPosts, trending, sentimentStats] = await Promise.all([
        reportsPromise,
        socialDataPromise,
        trendingPromise,
        sentimentPromise
      ]);
      
      setRecentReports(reports.slice(0, 10));
      
      const analyticsData = {
        totalReports: reports.length,
        activeVolunteers: Math.floor(reports.length * 0.7),
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
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadAnalyticsData();
  };

  return (
    <div className="page-container">
      <header className="dashboard-header">
        <h1>Tarang Analytics Dashboard</h1>
        <p>Comprehensive data insights and trend analysis for ocean hazard monitoring</p>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate('/')}>
            Home
          </button>
          <button className="btn-primary" onClick={refreshData} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </header>

      <main className="analytics-grid">
        <div className="main-card">
          <h2>Real-time Stats</h2>
          <ul>
            <li>Total Reports: <span>{realTimeData.totalReports}</span></li>
            <li>Active Volunteers: <span>{realTimeData.activeVolunteers}</span></li>
            <li>Active Alerts: <span>{realTimeData.activeAlerts}</span></li>
          </ul>
        </div>

        <div className="main-card">
          <h2>Social Media Stats</h2>
          <ul>
            <li>Total Posts: <span>{realTimeData.socialMediaPosts}</span></li>
            <li>Negative Sentiment: <span>{realTimeData.negativeSentiment}</span></li>
            <li>High Relevance: <span>{realTimeData.highRelevance}</span></li>
            <li>Trending Topics: <span>{realTimeData.trendingTopics}</span></li>
          </ul>
        </div>

        <div className="main-card">
          <h2>Trending Topics</h2>
          <ul>
            {trendingTopics.map((topic, index) => (
              <li key={index}>{topic.name} ({topic.posts})</li>
            ))}
          </ul>
        </div>

        <div className="main-card">
          <h2>Recent Reports</h2>
          <ul>
            {recentReports.map((report) => (
              <li key={report.id}>{report.type} - {report.location.district}</li>
            ))}
          </ul>
        </div>

        <div className="main-card">
          <h2>Recent Social Media Posts</h2>
          <ul>
            {socialMediaPosts.map((post) => (
              <li key={post.id}>{post.content}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
