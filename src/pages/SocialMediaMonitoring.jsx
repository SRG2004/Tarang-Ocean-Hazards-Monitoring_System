import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SocialMediaMonitoring.css';

const SocialMediaMonitoring = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    platform: 'All Platforms',
    sentiment: 'All Sentiments',
    timeframe: 'Last 24 Hours',
    relevance: 50
  });

  const sentimentStats = {
    positive: 0,
    negative: 4,
    neutral: 2,
    total: 6
  };

  const trendingTopics = [
    { name: 'cyclone', posts: 3, sentiment: 'negative' }
  ];

  const geographicActivity = [
    { location: 'Chennai', activity: 1 },
    { location: 'Kerala', activity: 1 },
    { location: 'Tamil nadu', activity: 1 }
  ];

  const socialMediaPosts = [
    {
      id: 1,
      platform: '@TheHindu',
      verified: true,
      content: 'Cyclone Alert: IMD Issues Warning for East Coast Indian Meteorological Department has issued a cyclone warning for the east coast. Fishermen advised not to venture into the sea.',
      sentiment: 'NEGATIVE',
      timestamp: '1h ago',
      engagement: { likes: 456, shares: 123, comments: 89 },
      relevance: '95%'
    },
    {
      id: 2,
      platform: '@IndiaMetDept',
      verified: true,
      content: 'IMD issues cyclone warning for Bay of Bengal. Fishermen advised to return to shore immediately. #CycloneAlert #BayOfBengal',
      sentiment: 'NEGATIVE',
      timestamp: '1h ago',
      engagement: { likes: 567, shares: 234, comments: 89 },
      relevance: '90%'
    },
    {
      id: 3,
      platform: '@ChennaiWeatherLive',
      verified: true,
      content: 'High waves reported at Chennai Marina Beach. Coast Guard advisory issued for fishing vessels. Wave height: 3.5m #ChennaiWeather #MarineAlert',
      sentiment: 'NEGATIVE',
      timestamp: '10m ago',
      engagement: { likes: 245, shares: 67, comments: 23 },
      relevance: '83%'
    },
    {
      id: 4,
      platform: '@CoastalResident',
      verified: false,
      content: 'Cyclone approaching Bay of Bengal - preparation tips needed Looking for advice on cyclone preparation for coastal areas. First time dealing with this.',
      sentiment: 'NEUTRAL',
      timestamp: '3h ago',
      engagement: { likes: 76, shares: 0, comments: 21 },
      relevance: '82%'
    },
    {
      id: 5,
      platform: '@TimesofIndia',
      verified: true,
      content: 'High Wave Alert Along Kerala Coast Kerala State Disaster Management Authority issues high wave alert. Coast Guard residents advised to stay away from beaches.',
      sentiment: 'NEGATIVE',
      timestamp: '1h ago',
      engagement: { likes: 234, shares: 67, comments: 34 },
      relevance: '70%'
    },
    {
      id: 6,
      platform: '@WeatherWatcher2024',
      verified: false,
      content: 'Severe weather conditions reported along Tamil Nadu coast. Any updates from locals?',
      sentiment: 'NEUTRAL',
      timestamp: '2h ago',
      engagement: { likes: 34, shares: 0, comments: 12 },
      relevance: '70%'
    }
  ];

  return (
    <div className="social-media-monitoring">
      {/* Header */}
      <header className="monitoring-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="page-title">📱 Social Media Monitoring</h1>
            <p className="page-subtitle">Real-time social media analysis for ocean hazard detection</p>
          </div>
          <div className="header-actions">
            <button 
              className="header-button"
              onClick={() => navigate('/analyst')}
            >
              ← Back to Analytics
            </button>
            <button className="refresh-button">🔄 Refresh</button>
          </div>
        </div>
      </header>

      <main className="monitoring-main">
        {/* Filters */}
        <section className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Platform</label>
              <select 
                value={filters.platform}
                onChange={(e) => setFilters({...filters, platform: e.target.value})}
              >
                <option>All Platforms</option>
                <option>Twitter</option>
                <option>Facebook</option>
                <option>Instagram</option>
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
            <div className="filter-group">
              <label>Min Relevance: {filters.relevance}%</label>
              <input 
                type="range"
                min="0"
                max="100"
                value={filters.relevance}
                onChange={(e) => setFilters({...filters, relevance: e.target.value})}
                className="relevance-slider"
              />
            </div>
          </div>
        </section>

        {/* Analytics Grid */}
        <section className="analytics-grid">
          {/* Sentiment Analysis */}
          <div className="analytics-card sentiment-analysis">
            <h3 className="card-title">Sentiment Analysis</h3>
            <div className="sentiment-stats">
              <div className="sentiment-item positive">
                <span className="sentiment-label">● Positive</span>
                <span className="sentiment-value">{sentimentStats.positive}</span>
              </div>
              <div className="sentiment-item negative">
                <span className="sentiment-label">● Negative</span>
                <span className="sentiment-value">{sentimentStats.negative}</span>
              </div>
              <div className="sentiment-item neutral">
                <span className="sentiment-label">● Neutral</span>
                <span className="sentiment-value">{sentimentStats.neutral}</span>
              </div>
              <div className="sentiment-total">
                <span className="total-label">Total Posts</span>
                <span className="total-value">{sentimentStats.total}</span>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="analytics-card trending-topics">
            <h3 className="card-title">🔥 Trending Topics</h3>
            <div className="topics-list">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="topic-item">
                  <span className="topic-name">{topic.name}</span>
                  <span className="topic-posts">{topic.posts} posts</span>
                  <span className={`topic-sentiment ${topic.sentiment}`}>
                    {topic.sentiment}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Activity */}
          <div className="analytics-card geographic-activity">
            <h3 className="card-title">📍 Geographic Activity</h3>
            <div className="activity-list">
              {geographicActivity.map((location, index) => (
                <div key={index} className="activity-item">
                  <span className="location-name">{location.location}</span>
                  <span className="activity-indicator">●</span>
                  <span className="activity-count">{location.activity}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media Posts */}
        <section className="posts-section">
          <h2 className="section-title">Social Media Posts ({socialMediaPosts.length})</h2>
          <div className="posts-list">
            {socialMediaPosts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-source">
                    <span className="platform-name">{post.platform}</span>
                    {post.verified && <span className="verified-badge">✓</span>}
                  </div>
                  <div className="post-meta">
                    <span className={`sentiment-badge ${post.sentiment.toLowerCase()}`}>
                      {post.sentiment}
                    </span>
                    <span className="timestamp">{post.timestamp}</span>
                  </div>
                </div>
                <div className="post-content">
                  {post.content}
                </div>
                <div className="post-footer">
                  <div className="engagement-stats">
                    <span>👍 {post.engagement.likes}</span>
                    <span>🔄 {post.engagement.shares}</span>
                    <span>💬 {post.engagement.comments}</span>
                  </div>
                  <div className="relevance-score">
                    Relevance: {post.relevance} 
                    <button className="view-button">View →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SocialMediaMonitoring;