import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socialMediaService } from '../services/socialMediaService';
import { incoisIntegrationService } from '../services/incoisIntegrationService';
import './SocialMediaMonitoring.css';

const SocialMediaMonitoring = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [socialMediaData, setSocialMediaData] = useState([]);
  const [sentimentStats, setSentimentStats] = useState({ positive: 0, negative: 0, neutral: 0, total: 0 });
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [geographicActivity, setGeographicActivity] = useState([]);
  const [incoisAlerts, setIncoisAlerts] = useState([]);
  const [filters, setFilters] = useState({
    platform: 'All Platforms',
    sentiment: 'All Sentiments',
    timeframe: 'Last 24 Hours',
    relevance: 50,
    region: 'All Regions',
    hazardType: 'All Hazards'
  });

  useEffect(() => {
    loadSocialMediaData();
    loadIncoisAlerts();
  }, []);

  const loadSocialMediaData = async () => {
    setLoading(true);
    try {
      // Load social media posts
      const posts = await socialMediaService.fetchSimulatedSocialMediaData();
      setSocialMediaData(posts);

      // Calculate sentiment statistics
      const stats = posts.reduce((acc, post) => {
        acc[post.sentiment.label] = (acc[post.sentiment.label] || 0) + 1;
        acc.total++;
        return acc;
      }, { positive: 0, negative: 0, neutral: 0, total: 0 });
      
      setSentimentStats(stats);

      // Extract trending topics
      const keywordCounts = {};
      posts.forEach(post => {
        post.keywords.forEach(keyword => {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
        });
      });

      const trending = Object.entries(keywordCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([keyword, count]) => ({
          name: keyword,
          posts: count,
          sentiment: calculateTopicSentiment(keyword, posts)
        }));
      
      setTrendingTopics(trending);

      // Extract geographic activity
      const geoActivity = extractGeographicActivity(posts);
      setGeographicActivity(geoActivity);

    } catch (error) {
      console.error('Error loading social media data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIncoisAlerts = async () => {
    try {
      const alerts = await incoisIntegrationService.getEarlyWarningData();
      setIncoisAlerts(alerts.slice(0, 3)); // Show top 3 alerts
    } catch (error) {
      console.error('Error loading INCOIS alerts:', error);
    }
  };

  const calculateTopicSentiment = (keyword, posts) => {
    const relevantPosts = posts.filter(post => 
      post.keywords.includes(keyword)
    );
    
    if (relevantPosts.length === 0) return 'neutral';
    
    const sentimentCounts = relevantPosts.reduce((acc, post) => {
      acc[post.sentiment.label] = (acc[post.sentiment.label] || 0) + 1;
      return acc;
    }, { positive: 0, negative: 0, neutral: 0 });
    
    const dominantSentiment = Object.entries(sentimentCounts)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return dominantSentiment;
  };

  const extractGeographicActivity = (posts) => {
    const locationCounts = {};
    const indianStatesAndCities = [
      'mumbai', 'chennai', 'kolkata', 'kochi', 'goa', 'visakhapatnam',
      'gujarat', 'maharashtra', 'kerala', 'tamil nadu', 'andhra pradesh',
      'odisha', 'west bengal', 'karnataka', 'goa', 'puducherry'
    ];

    posts.forEach(post => {
      indianStatesAndCities.forEach(location => {
        if (post.content.toLowerCase().includes(location)) {
          locationCounts[location] = (locationCounts[location] || 0) + 1;
        }
      });
    });

    return Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([location, activity]) => ({
        location: location.charAt(0).toUpperCase() + location.slice(1),
        activity
      }));
  };

  const refreshData = () => {
    loadSocialMediaData();
    loadIncoisAlerts();
  };

  const filteredPosts = socialMediaData.filter(post => {
    if (filters.platform !== 'All Platforms' && !post.platform.includes(filters.platform.replace('@', ''))) {
      return false;
    }
    if (filters.sentiment !== 'All Sentiments' && post.sentiment.label !== filters.sentiment.toLowerCase()) {
      return false;
    }
    if (filters.hazardType !== 'All Hazards' && !post.keywords.includes(filters.hazardType.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="social-media-monitoring">
      {/* Header */}
      <header className="monitoring-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="page-title">📱 Social Media Monitoring - INCOIS Enhanced</h1>
            <p className="page-subtitle">Real-time social media analysis for Indian ocean hazard detection with multilingual support</p>
          </div>
          <div className="header-actions">
            <button 
              className="header-button"
              onClick={() => navigate('/analyst')}
            >
              ← Back to Analytics
            </button>
            <button className="refresh-button" onClick={refreshData} disabled={loading}>
              {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
            </button>
          </div>
        </div>
      </header>

      <main className="monitoring-main">
        {/* INCOIS Alerts Integration */}
        {incoisAlerts.length > 0 && (
          <section className="incois-alerts-section">
            <h2>🚨 INCOIS Early Warnings</h2>
            <div className="alerts-grid">
              {incoisAlerts.map(alert => (
                <div key={alert.id} className={`alert-card alert-${alert.alertLevel.toLowerCase()}`}>
                  <div className="alert-header">
                    <span className="alert-type">{alert.type}</span>
                    <span className="alert-level">{alert.alertLevel}</span>
                  </div>
                  <div className="alert-region">{alert.region}</div>
                  <div className="alert-time">Valid until: {new Date(alert.validUntil).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Enhanced Filters */}
        <section className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Platform</label>
              <select 
                value={filters.platform}
                onChange={(e) => setFilters({...filters, platform: e.target.value})}
              >
                <option>All Platforms</option>
                <option>@TheHindu</option>
                <option>@IndiaMetDept</option>
                <option>@INCOIS_Official</option>
                <option>@CoastalGuardIndia</option>
                <option>@WeatherChannelIndia</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sentiment</label>
              <select 
                value={filters.sentiment}
                onChange={(e) => setFilters({...filters, sentiment: e.target.value})}
              >
                <option>All Sentiments</option>
                <option>Positive</option>
                <option>Negative</option>
                <option>Neutral</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Hazard Type</label>
              <select 
                value={filters.hazardType}
                onChange={(e) => setFilters({...filters, hazardType: e.target.value})}
              >
                <option>All Hazards</option>
                <option>Tsunami</option>
                <option>Cyclone</option>
                <option>Storm Surge</option>
                <option>High Waves</option>
                <option>Coastal Flooding</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Region</label>
              <select 
                value={filters.region}
                onChange={(e) => setFilters({...filters, region: e.target.value})}
              >
                <option>All Regions</option>
                <option>Bay of Bengal</option>
                <option>Arabian Sea</option>
                <option>Tamil Nadu Coast</option>
                <option>Kerala Coast</option>
                <option>Gujarat Coast</option>
                <option>Andhra Pradesh Coast</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Timeframe</label>
              <select 
                value={filters.timeframe}
                onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
              >
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
          </div>
        </section>

        {/* Analytics Overview */}
        <section className="analytics-overview">
          <div className="analytics-grid">
            {/* Enhanced Sentiment Analysis */}
            <div className="analytics-card sentiment-card">
              <h3>🎭 Sentiment Analysis</h3>
              <div className="sentiment-stats">
                <div className="sentiment-item positive">
                  <span className="sentiment-value">{sentimentStats.positive}</span>
                  <span className="sentiment-label">Positive</span>
                </div>
                <div className="sentiment-item negative">
                  <span className="sentiment-value">{sentimentStats.negative}</span>
                  <span className="sentiment-label">Negative</span>
                </div>
                <div className="sentiment-item neutral">
                  <span className="sentiment-value">{sentimentStats.neutral}</span>
                  <span className="sentiment-label">Neutral</span>
                </div>
                <div className="sentiment-item total">
                  <span className="sentiment-value">{sentimentStats.total}</span>
                  <span className="sentiment-label">Total Posts</span>
                </div>
              </div>
            </div>

            {/* Enhanced Trending Topics */}
            <div className="analytics-card trending-card">
              <h3>📈 Trending Ocean Hazard Keywords</h3>
              <div className="trending-list">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="trending-item">
                    <span className="trending-name">{topic.name}</span>
                    <span className="trending-posts">{topic.posts} posts</span>
                    <span className={`trending-sentiment ${topic.sentiment}`}>
                      {topic.sentiment}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Geographic Activity */}
            <div className="analytics-card geographic-card">
              <h3>🗺️ Indian Coastal Regions Activity</h3>
              <div className="geographic-list">
                {geographicActivity.map((location, index) => (
                  <div key={index} className="geographic-item">
                    <span className="location-name">{location.location}</span>
                    <span className="location-activity">{location.activity} mentions</span>
                    <div className="activity-bar">
                      <div 
                        className="activity-fill" 
                        style={{width: `${(location.activity / Math.max(...geographicActivity.map(g => g.activity))) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Social Media Posts */}
        <section className="posts-section">
          <h2>📱 Live Social Media Feed ({filteredPosts.length} posts)</h2>
          <div className="posts-container">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading social media data...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="empty-state">
                <p>No posts match the current filters</p>
              </div>
            ) : (
              filteredPosts.map((post, index) => (
                <div key={index} className="post-card">
                  <div className="post-header">
                    <div className="post-author">
                      <span className="platform-name">{post.platform}</span>
                      {post.verified && <span className="verified-badge">✓</span>}
                    </div>
                    <div className="post-meta">
                      <span className="post-timestamp">{post.timestamp}</span>
                      <span className={`sentiment-badge ${post.sentiment.label}`}>
                        {post.sentiment.label.toUpperCase()} ({Math.round(post.sentiment.confidence * 100)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="post-content">
                    {post.content}
                  </div>
                  
                  {post.keywords && post.keywords.length > 0 && (
                    <div className="post-keywords">
                      <strong>Keywords:</strong> {post.keywords.join(', ')}
                    </div>
                  )}
                  
                  {post.context && post.context.length > 0 && (
                    <div className="post-context">
                      <strong>Hazard Context:</strong> {post.context.join(', ')}
                    </div>
                  )}
                  
                  <div className="post-engagement">
                    <span>👍 {post.engagement.likes}</span>
                    <span>🔄 {post.engagement.shares}</span>
                    <span>💬 {post.engagement.comments}</span>
                    <span className="relevance">Relevance: {Math.round(post.relevanceScore * 100)}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SocialMediaMonitoring;