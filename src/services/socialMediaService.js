import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const socialMediaService = {
  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Get social media posts from API (with fallback to simulated data)
  async getSocialMediaPosts(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`${API_BASE_URL}/social-media/posts?${params}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.posts || [];
    } catch (error) {
      console.warn('API not available, using simulated data:', error.message);
      // Fallback to simulated data if API is not available
      return await this.fetchSimulatedSocialMediaData();
    }
  },

  // Get trending topics (with fallback to simulated data)
  async getTrendingTopics(limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/social-media/trending`, {
        params: { limit },
        headers: this.getAuthHeaders()
      });

      return response.data.trending || [];
    } catch (error) {
      console.warn('API not available, generating trending topics from simulated data:', error.message);
      // Fallback to simulated trending topics
      return await this.getSimulatedTrendingTopics(limit);
    }
  },

  // Get sentiment statistics (with fallback to simulated data)
  async getSentimentStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/social-media/sentiment-stats`, {
        headers: this.getAuthHeaders()
      });

      return response.data.stats || { positive: 0, negative: 0, neutral: 0, total: 0 };
    } catch (error) {
      console.warn('API not available, calculating sentiment from simulated data:', error.message);
      // Fallback to simulated sentiment stats
      return await this.getSimulatedSentimentStats();
    }
  },

  // Get social media analytics
  async getAnalytics(timeRange = '24h') {
    try {
      const response = await axios.get(`${API_BASE_URL}/social-media/analytics`, {
        params: { timeRange },
        headers: this.getAuthHeaders()
      });

      return response.data.analytics || {};
    } catch (error) {
      console.error('Error getting social media analytics:', error);
      throw new Error(error.response?.data?.error || 'Failed to get analytics');
    }
  },

  // Analyze sentiment of text (client-side utility)
  analyzeSentiment(text) {
    // Simple sentiment analysis (could be enhanced with a proper library)
    const positiveWords = ['good', 'safe', 'fine', 'okay', 'normal', 'clear', 'calm'];
    const negativeWords = ['danger', 'warning', 'alert', 'storm', 'flood', 'tsunami', 'cyclone', 'emergency'];

    const textLower = text.toLowerCase();
    let score = 0;

    positiveWords.forEach(word => {
      if (textLower.includes(word)) score += 1;
    });

    negativeWords.forEach(word => {
      if (textLower.includes(word)) score -= 2;
    });

    let label = 'neutral';
    if (score > 1) label = 'positive';
    else if (score < -1) label = 'negative';

    return {
      score,
      label,
      words: [...positiveWords.filter(w => textLower.includes(w)),
              ...negativeWords.filter(w => textLower.includes(w))]
    };
  },

  // Extract keywords related to ocean hazards (client-side utility)
  extractHazardKeywords(text) {
    const hazardKeywords = [
      'tsunami', 'cyclone', 'storm', 'flood', 'wave', 'surge', 'tide',
      'coastal', 'marine', 'ocean', 'sea', 'beach', 'erosion', 'current',
      'warning', 'alert', 'emergency', 'evacuation', 'rescue', 'safety',
      'fishermen', 'vessel', 'boat', 'harbor', 'port', 'coast guard',
      'IMD', 'INCOIS', 'meteorological', 'weather', 'wind', 'pressure'
    ];

    const extractedKeywords = [];
    const textLower = text.toLowerCase();

    hazardKeywords.forEach(keyword => {
      if (textLower.includes(keyword)) {
        extractedKeywords.push(keyword);
      }
    });

    return extractedKeywords;
  },

  // Simulate social media data fetching
  async fetchSimulatedSocialMediaData() {
    const simulatedPosts = [
      {
        platform: '@TheHindu',
        author: 'The Hindu',
        content: 'Cyclone Alert: IMD Issues Warning for East Coast Indian Meteorological Department has issued a cyclone warning for the east coast. Fishermen advised not to venture into the sea.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        engagement: { likes: 456, shares: 123, comments: 89 },
        verified: true
      },
      {
        platform: '@IndiaMetDept',
        author: 'India Meteorological Department',
        content: 'IMD issues cyclone warning for Bay of Bengal. Fishermen advised to return to shore immediately. #CycloneAlert #BayOfBengal',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        engagement: { likes: 567, shares: 234, comments: 89 },
        verified: true
      },
      {
        platform: '@ChennaiWeatherLive',
        author: 'Chennai Weather Live',
        content: 'High waves reported at Chennai Marina Beach. Coast Guard advisory issued for fishing vessels. Wave height: 3.5m #ChennaiWeather #MarineAlert',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        engagement: { likes: 245, shares: 67, comments: 23 },
        verified: true
      },
      {
        platform: '@CoastalResident',
        author: 'Coastal Resident',
        content: 'Cyclone approaching Bay of Bengal - preparation tips needed Looking for advice on cyclone preparation for coastal areas. First time dealing with this.',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        engagement: { likes: 76, shares: 0, comments: 21 },
        verified: false
      }
    ];

    // Process each simulated post
    const processedPosts = [];
    for (const post of simulatedPosts) {
      try {
        const processed = await this.processSocialMediaPost(post);
        processedPosts.push(processed);
      } catch (error) {
        console.error('Error processing simulated post:', error);
      }
    }

    return processedPosts;
  },

  // Get trending topics
  async getTrendingTopics(limit = 10) {
    try {
      const posts = await this.getSocialMediaPosts({ 
        isHazardRelated: true, 
        limit: 100 
      });

      // Count keyword frequencies
      const keywordCounts = {};
      posts.forEach(post => {
        post.keywords.forEach(keyword => {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
        });
      });

      // Sort by frequency and return top trending
      const trending = Object.entries(keywordCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([keyword, count]) => ({
          name: keyword,
          count,
          posts: count + ' posts',
          sentiment: this.getKeywordSentiment(keyword, posts)
        }));

      return trending;
    } catch (error) {
      console.error('Error getting trending topics:', error);
      return [];
    }
  },

  // Get sentiment for a specific keyword
  getKeywordSentiment(keyword, posts) {
    const keywordPosts = posts.filter(post => 
      post.keywords.includes(keyword)
    );

    if (keywordPosts.length === 0) return 'neutral';

    const avgScore = keywordPosts.reduce((sum, post) => 
      sum + post.sentiment.score, 0) / keywordPosts.length;

    if (avgScore > 1) return 'positive';
    if (avgScore < -1) return 'negative';
    return 'neutral';
  },


  // Fetch simulated social media data for demo purposes
  async fetchSimulatedSocialMediaData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const simulatedPosts = [
      {
        id: '1',
        platform: 'twitter',
        content: 'High waves reported near Chennai coast. Stay safe everyone! #OceanSafety',
        author: 'CoastalWatch',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        sentiment: { label: 'negative', score: -2 },
        keywords: ['high waves', 'Chennai', 'coast'],
        isHazardRelated: true,
        location: { lat: 13.0827, lng: 80.2707 }
      },
      {
        id: '2',
        platform: 'facebook',
        content: 'Beautiful calm seas today at Marina Beach. Perfect for morning walks.',
        author: 'BeachLover',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        sentiment: { label: 'positive', score: 3 },
        keywords: ['calm seas', 'Marina Beach'],
        isHazardRelated: false,
        location: { lat: 13.0827, lng: 80.2707 }
      },
      {
        id: '3',
        platform: 'twitter',
        content: 'Storm warning issued for Visakhapatnam. Fishing boats advised to return to shore.',
        author: 'WeatherAlert',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        sentiment: { label: 'negative', score: -3 },
        keywords: ['storm warning', 'Visakhapatnam', 'fishing boats'],
        isHazardRelated: true,
        location: { lat: 17.6868, lng: 83.2185 }
      },
      {
        id: '4',
        platform: 'youtube',
        content: 'Great conditions for surfing at Kovalam beach this morning!',
        author: 'SurfGuru',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        sentiment: { label: 'positive', score: 2 },
        keywords: ['surfing', 'Kovalam'],
        isHazardRelated: false,
        location: { lat: 8.4004, lng: 76.9784 }
      },
      {
        id: '5',
        platform: 'twitter',
        content: 'Unusual tidal patterns observed near Puri. Local authorities are monitoring.',
        author: 'OceanWatch',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        sentiment: { label: 'neutral', score: 0 },
        keywords: ['tidal patterns', 'Puri', 'monitoring'],
        isHazardRelated: true,
        location: { lat: 19.8135, lng: 85.8312 }
      }
    ];

    return simulatedPosts;
  },

  // Get simulated trending topics
  async getSimulatedTrendingTopics(limit = 10) {
    const posts = await this.fetchSimulatedSocialMediaData();
    
    // Count keyword frequencies
    const keywordCounts = {};
    posts.forEach(post => {
      post.keywords.forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    });

    // Sort by frequency and return top trending
    const trending = Object.entries(keywordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([keyword, count]) => ({
        name: keyword,
        count,
        posts: count + ' posts',
        sentiment: this.getKeywordSentiment(keyword, posts)
      }));

    return trending;
  },

  // Get simulated sentiment statistics
  async getSimulatedSentimentStats() {
    const posts = await this.fetchSimulatedSocialMediaData();
    
    const stats = {
      positive: 0,
      negative: 0,
      neutral: 0,
      total: posts.length
    };

    posts.forEach(post => {
      stats[post.sentiment.label]++;
    });

    return stats;
  }
};