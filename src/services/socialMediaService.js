import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://b49cfa40-6e1a-4800-939e-ca2cb741b6cc-00-2t1t4qia4ikak.riker.replit.dev:3001/api';

export const socialMediaService = {
  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Get social media posts from API
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
      console.error('Error getting social media posts:', error);
      throw new Error(error.response?.data?.error || 'Failed to get social media posts');
    }
  },

  // Get trending topics
  async getTrendingTopics(limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/social-media/trending`, {
        params: { limit },
        headers: this.getAuthHeaders()
      });

      return response.data.trending || [];
    } catch (error) {
      console.error('Error getting trending topics:', error);
      throw new Error(error.response?.data?.error || 'Failed to get trending topics');
    }
  },

  // Get sentiment statistics
  async getSentimentStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/social-media/sentiment-stats`, {
        headers: this.getAuthHeaders()
      });

      return response.data.stats || { positive: 0, negative: 0, neutral: 0, total: 0 };
    } catch (error) {
      console.error('Error getting sentiment stats:', error);
      return { positive: 0, negative: 0, neutral: 0, total: 0 };
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

  // Get sentiment statistics
  async getSentimentStats() {
    try {
      const posts = await this.getSocialMediaPosts({ limit: 100 });
      
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
    } catch (error) {
      console.error('Error getting sentiment stats:', error);
      return { positive: 0, negative: 0, neutral: 0, total: 0 };
    }
  }
};