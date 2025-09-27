import React, { useState, useEffect } from 'react';
import { 
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Eye,
  Heart,
  Share,
  ExternalLink,
  Filter,
  Search,
  Calendar,
  MapPin,
  Users,
  BarChart3,
  Globe,
  RefreshCw
} from 'lucide-react';

export const SocialMediaMonitoring = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    platform: 'all',
    sentiment: 'all',
    timeframe: '24h',
    relevance: 'high'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data
  const mockPosts = [
    {
      id: '1',
      platform: 'twitter',
      author: '@MumbaiWeather',
      content: 'High tide alert! Coastal areas experiencing unusual wave patterns. Marine Drive witnessing higher than normal waves. Authorities advising caution for beachgoers. #MumbaiTide #CoastalAlert #SafetyFirst',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      engagement: { likes: 234, shares: 89, comments: 45 },
      sentiment: 'negative',
      relevanceScore: 95,
      location: 'Mumbai, Maharashtra',
      verified: true,
      hashtags: ['MumbaiTide', 'CoastalAlert', 'SafetyFirst'],
      mentions: []
    },
    {
      id: '2',
      platform: 'facebook',
      author: 'Gujarat Coast Guard',
      content: 'Coast Guard vessels on high alert following reports of unusual sea conditions off Dwarka coast. All fishing vessels advised to return to nearest harbor immediately. Weather department monitoring situation closely.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      engagement: { likes: 156, shares: 234, comments: 67 },
      sentiment: 'neutral',
      relevanceScore: 92,
      location: 'Dwarka, Gujarat',
      verified: true,
      hashtags: [],
      mentions: ['GujaratCoastGuard']
    },
    {
      id: '3',
      platform: 'instagram',
      author: '@chennai_beaches',
      content: 'Beautiful morning at Marina Beach! Crystal clear waters and gentle waves. Perfect weather for a beach walk. Thanks to @chennai_corporation for keeping our beaches clean! 🌊☀️ #ChennaiBeaches #MarinaBech #BeachLife',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      engagement: { likes: 567, shares: 23, comments: 89 },
      sentiment: 'positive',
      relevanceScore: 45,
      location: 'Chennai, Tamil Nadu',
      verified: false,
      hashtags: ['ChennaiBeaches', 'MarinaBech', 'BeachLife'],
      mentions: ['chennai_corporation']
    },
    {
      id: '4',
      platform: 'twitter',
      author: '@KeralaAlerts',
      content: '⚠️ CYCLONE WATCH: Meteorological department issues cyclone alert for Kerala coast. Expected to intensify over next 48 hours. Fishermen advised against venturing into sea. Emergency helplines activated. Stay safe! #CycloneAlert #KeralaWeather',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      engagement: { likes: 445, shares: 678, comments: 123 },
      sentiment: 'negative',
      relevanceScore: 98,
      location: 'Kerala',
      verified: true,
      hashtags: ['CycloneAlert', 'KeralaWeather'],
      mentions: []
    },
    {
      id: '5',
      platform: 'youtube',
      author: 'Indian Ocean Research',
      content: 'New study reveals changing ocean current patterns in the Arabian Sea. Our latest research shows significant shifts that could affect monsoon patterns and coastal ecosystems. Watch our detailed analysis.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      engagement: { likes: 1234, shares: 156, comments: 89 },
      sentiment: 'neutral',
      relevanceScore: 87,
      location: 'Pan-India',
      verified: true,
      hashtags: ['OceanResearch', 'ArabianSea', 'ClimateChange'],
      mentions: []
    }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call with fresh data based on filters
    setTimeout(() => {
      // In a real app, this would call the social media service with filters
      const filteredMockPosts = mockPosts.filter(post => {
        if (filter.platform !== 'all' && post.platform !== filter.platform) return false;
        if (filter.sentiment !== 'all' && post.sentiment !== filter.sentiment) return false;
        // Apply timeframe filtering based on timestamp
        let hours = 24; // default to 24 hours
        if (filter.timeframe.includes('h')) {
          hours = parseInt(filter.timeframe.replace(/[^0-9]/g, '')) || 24;
        } else if (filter.timeframe.includes('d')) {
          const days = parseInt(filter.timeframe.replace(/[^0-9]/g, '')) || 1;
          hours = days * 24;
        }
        const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
        if (post.timestamp < cutoff) return false;
        return true;
      });
      setPosts(filteredMockPosts);
      setLoading(false);
    }, 1500);
  }, [filter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate fetching new posts instead of duplicating
      const newMockPosts = mockPosts.map((post, index) => ({
        ...post,
        id: `refresh_${Date.now()}_${index}`,
        timestamp: new Date(Date.now() - Math.random() * 3600000), // Random timestamp within last hour
        engagement: {
          likes: Math.floor(Math.random() * 1000) + post.engagement.likes,
          shares: Math.floor(Math.random() * 500) + post.engagement.shares,
          comments: Math.floor(Math.random() * 200) + post.engagement.comments
        }
      }));
      setPosts(newMockPosts);
      setIsRefreshing(false);
    }, 1000);
  };

  const filteredPosts = posts.filter(post => {
    if (filter.platform !== 'all' && post.platform !== filter.platform) return false;
    if (filter.sentiment !== 'all' && post.sentiment !== filter.sentiment) return false;
    if (searchTerm && !post.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getPlatformIcon = (platform) => {
    const icons = {
      twitter: '𝕏',
      facebook: '📘',
      instagram: '📷',
      youtube: '📺'
    };
    return icons[platform] || '🌐';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRelevanceColor = (score) => {
    if (score >= 90) return 'text-red-600 bg-red-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const analyticsData = {
    totalPosts: filteredPosts.length,
    highRelevance: filteredPosts.filter(p => p.relevanceScore >= 70).length,
    sentimentBreakdown: {
      positive: filteredPosts.filter(p => p.sentiment === 'positive').length,
      negative: filteredPosts.filter(p => p.sentiment === 'negative').length,
      neutral: filteredPosts.filter(p => p.sentiment === 'neutral').length
    },
    platformBreakdown: {
      twitter: filteredPosts.filter(p => p.platform === 'twitter').length,
      facebook: filteredPosts.filter(p => p.platform === 'facebook').length,
      instagram: filteredPosts.filter(p => p.platform === 'instagram').length,
      youtube: filteredPosts.filter(p => p.platform === 'youtube').length
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Social Media Monitoring</h1>
            <p className="text-gray-600 mt-2">Real-time social media intelligence for ocean hazard detection</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-primary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Total Posts</h3>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{analyticsData.totalPosts}</div>
          <p className="text-gray-500 text-sm">Last 24 hours</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">High Priority</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">{analyticsData.highRelevance}</div>
          <p className="text-gray-500 text-sm">Needs attention</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Sentiment</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex space-x-2 text-sm">
            <span className="text-green-600 font-semibold">{analyticsData.sentimentBreakdown.positive}+</span>
            <span className="text-gray-600">{analyticsData.sentimentBreakdown.neutral}=</span>
            <span className="text-red-600 font-semibold">{analyticsData.sentimentBreakdown.negative}-</span>
          </div>
          <p className="text-gray-500 text-sm">Positive trending</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Engagement</h3>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {filteredPosts.reduce((acc, post) => acc + post.engagement.likes + post.engagement.shares, 0)}
          </div>
          <p className="text-gray-500 text-sm">Total interactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="card space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search posts..."
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Platform</label>
              <select
                value={filter.platform}
                onChange={(e) => setFilter(prev => ({ ...prev, platform: e.target.value }))}
                className="input"
              >
                <option value="all">All Platforms</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sentiment</label>
              <select
                value={filter.sentiment}
                onChange={(e) => setFilter(prev => ({ ...prev, sentiment: e.target.value }))}
                className="input"
              >
                <option value="all">All Sentiment</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Timeframe</label>
              <select
                value={filter.timeframe}
                onChange={(e) => setFilter(prev => ({ ...prev, timeframe: e.target.value }))}
                className="input"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Platform Breakdown */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Activity</h3>
            <div className="space-y-3">
              {Object.entries(analyticsData.platformBreakdown).map(([platform, count]) => (
                <div key={platform} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getPlatformIcon(platform)}</span>
                    <span className="font-medium capitalize">{platform}</span>
                  </div>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Live Social Feed</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>Monitoring {filteredPosts.length} posts</span>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6 max-h-[800px] overflow-y-auto">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{post.author}</span>
                            {post.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{new Date(post.timestamp).toLocaleString()}</span>
                            {post.location && (
                              <>
                                <span>•</span>
                                <MapPin className="w-3 h-3" />
                                <span>{post.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSentimentColor(post.sentiment)}`}>
                          {post.sentiment}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRelevanceColor(post.relevanceScore)}`}>
                          {post.relevanceScore}% relevant
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-gray-900 leading-relaxed">{post.content}</p>
                      
                      {/* Hashtags */}
                      {post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.hashtags.map((hashtag) => (
                            <span key={hashtag} className="text-blue-600 text-sm font-medium">
                              #{hashtag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between text-gray-500 text-sm border-t border-gray-100 pt-4">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.engagement.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share className="w-4 h-4" />
                          <span>{post.engagement.shares}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.engagement.comments}</span>
                        </div>
                      </div>
                      
                      <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium">
                        <ExternalLink className="w-4 h-4" />
                        <span>View Original</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};