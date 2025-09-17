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
    // Enhanced sentiment analysis for ocean hazard context
    const positiveWords = [
      'good', 'safe', 'fine', 'okay', 'normal', 'clear', 'calm',
      'peaceful', 'stable', 'secure', 'protected', 'sheltered',
      'mild', 'gentle', 'favorable', 'improving', 'controlled',
      'manageable', 'subsiding', 'weakening', 'receding'
    ];
    
    const negativeWords = [
      'danger', 'dangerous', 'warning', 'alert', 'storm', 'flood', 'tsunami', 
      'cyclone', 'emergency', 'evacuate', 'severe', 'critical', 'extreme',
      'devastating', 'destructive', 'threatening', 'intensifying',
      'worsening', 'escalating', 'unprecedented', 'catastrophic',
      'massive', 'powerful', 'violent', 'turbulent', 'rough',
      'hazardous', 'risky', 'unsafe', 'perilous', 'fatal',
      'surge', 'inundation', 'landfall', 'depression', 'disturbance'
    ];
    
    const neutralWords = [
      'monitoring', 'tracking', 'observing', 'reporting', 'update',
      'advisory', 'forecast', 'prediction', 'analysis', 'assessment',
      'preparation', 'precaution', 'measure', 'protocol', 'procedure'
    ];

    const textLower = text.toLowerCase();
    let score = 0;
    let confidence = 0;

    // Count positive indicators
    const positiveMatches = positiveWords.filter(word => textLower.includes(word));
    score += positiveMatches.length * 1;
    confidence += positiveMatches.length * 0.1;

    // Count negative indicators (weighted more heavily)
    const negativeMatches = negativeWords.filter(word => textLower.includes(word));
    score -= negativeMatches.length * 2;
    confidence += negativeMatches.length * 0.2;
    
    // Count neutral indicators
    const neutralMatches = neutralWords.filter(word => textLower.includes(word));
    confidence += neutralMatches.length * 0.05;

    // Determine sentiment label with confidence
    let label = 'neutral';
    if (score > 1) {
      label = 'positive';
    } else if (score <= -1) {
      label = 'negative';
    }
    
    // Adjust confidence based on text length and keyword density
    const textWords = text.split(/\s+/).length;
    const keywordDensity = (positiveMatches.length + negativeMatches.length + neutralMatches.length) / textWords;
    confidence = Math.min(confidence + keywordDensity, 1.0);

    return {
      score,
      label,
      confidence: Math.round(confidence * 100) / 100,
      keywords: {
        positive: positiveMatches,
        negative: negativeMatches,
        neutral: neutralMatches
      },
      context: this.determineHazardContext(text)
    };
  },

  // Determine the specific hazard context from text
  determineHazardContext(text) {
    const textLower = text.toLowerCase();
    const contexts = {
      tsunami: ['tsunami', 'seismic', 'earthquake', 'tectonic'],
      cyclone: ['cyclone', 'hurricane', 'typhoon', 'depression', 'low pressure'],
      flood: ['flood', 'inundation', 'overflow', 'submersion'],
      storm: ['storm', 'thunderstorm', 'squall', 'tempest'],
      waves: ['wave', 'swell', 'surf', 'breaker'],
      tide: ['tide', 'tidal', 'high tide', 'low tide'],
      current: ['current', 'rip current', 'undertow', 'drift'],
      erosion: ['erosion', 'coastal erosion', 'shoreline', 'retreat'],
      weather: ['weather', 'meteorological', 'atmospheric', 'climate']
    };

    const detectedContexts = [];
    for (const [context, keywords] of Object.entries(contexts)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        detectedContexts.push(context);
      }
    }

    return detectedContexts.length > 0 ? detectedContexts : ['general'];
  },

  // Extract keywords related to ocean hazards (client-side utility)
  extractHazardKeywords(text) {
    const hazardKeywords = [
      // Ocean hazards
      'tsunami', 'cyclone', 'storm', 'flood', 'wave', 'surge', 'tide',
      'storm surge', 'high waves', 'swell surge', 'coastal current',
      'abnormal sea behavior', 'unusual tide', 'marine flooding',
      'coastal erosion', 'rip current', 'undertow',
      
      // Coastal and marine terms
      'coastal', 'marine', 'ocean', 'sea', 'beach', 'erosion', 'current',
      'bay of bengal', 'arabian sea', 'indian ocean', 'coastline',
      'mangrove', 'coral reef', 'estuary', 'delta', 'lagoon',
      
      // Alert and emergency terms
      'warning', 'alert', 'emergency', 'evacuation', 'rescue', 'safety',
      'red alert', 'orange alert', 'yellow alert', 'advisory',
      
      // Maritime and fishing related
      'fishermen', 'fishing', 'vessel', 'boat', 'harbor', 'port', 'coast guard',
      'maritime', 'shipping', 'navigation', 'anchorage', 'dock',
      
      // Weather and meteorological
      'IMD', 'INCOIS', 'meteorological', 'weather', 'wind', 'pressure',
      'barometric', 'atmospheric', 'monsoon', 'pre-monsoon', 'post-monsoon',
      'northeast monsoon', 'southwest monsoon',
      
      // Indian coastal cities and states
      'mumbai', 'chennai', 'kolkata', 'visakhapatnam', 'kochi', 'goa',
      'gujarat', 'maharashtra', 'karnataka', 'kerala', 'tamil nadu',
      'andhra pradesh', 'odisha', 'west bengal', 'puducherry',
      'andaman', 'nicobar', 'lakshadweep',
      
      // Regional language terms (transliterated)
      'samudra', 'sagar', 'darya', 'kadal', 'kayal', 'backwater',
      'meenavar', 'machhua', 'nelayan'
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
        platform: '@INCOIS_Official',
        author: 'INCOIS',
        content: 'Storm surge warning issued for Andhra Pradesh and Tamil Nadu coasts. High wave alert (3-4m) expected along Chennai and Visakhapatnam. Coastal residents advised to stay vigilant. #StormSurge #CoastalAlert',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        engagement: { likes: 892, shares: 456, comments: 134 },
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
        platform: '@CoastalGuardIndia',
        author: 'Indian Coast Guard',
        content: 'Marine rescue operation underway off Gujarat coast. All fishing vessels advised to return to nearest harbor due to rough sea conditions. Swell surge height: 2.8m #MarineRescue #CoastGuard',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        engagement: { likes: 678, shares: 234, comments: 56 },
        verified: true
      },
      {
        platform: '@MumbaiPolice',
        author: 'Mumbai Police',
        content: 'Coastal flooding reported in low-lying areas of Mumbai. Citizens advised to avoid Worli Sea Face and Marine Drive. High tide expected at 14:30 hrs. #MumbaiFloods #HighTide',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        engagement: { likes: 534, shares: 189, comments: 78 },
        verified: true
      },
      {
        platform: '@FishermenAssocKerala',
        author: 'Kerala Fishermen Association',
        content: 'Abnormal sea behavior observed off Kochi coast. Unusual current patterns reported by fishermen. INCOIS monitoring the situation. All vessels advised caution. #SeaConditions #Kerala',
        timestamp: new Date(Date.now() - 4200000).toISOString(),
        engagement: { likes: 234, shares: 87, comments: 45 },
        verified: false
      },
      {
        platform: '@WeatherChannelIndia',
        author: 'Weather Channel India',
        content: 'Monsoon depression in Bay of Bengal intensifying. Coastal Odisha and West Bengal on high alert. Storm surge likely along Paradip and Digha. #MonsoonUpdate #StormSurge',
        timestamp: new Date(Date.now() - 6600000).toISOString(),
        engagement: { likes: 423, shares: 167, comments: 92 },
        verified: true
      },
      {
        platform: '@CoastalResident',
        author: 'Coastal Resident',
        content: 'Cyclone approaching Bay of Bengal - preparation tips needed Looking for advice on cyclone preparation for coastal areas. First time dealing with this.',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        engagement: { likes: 76, shares: 0, comments: 21 },
        verified: false
      },
      {
        platform: '@TamilNaduGovt',
        author: 'Tamil Nadu Government',
        content: 'Coastal erosion accelerating in Nagapattinam district. Emergency measures being implemented. Residents in vulnerable areas being relocated. #CoastalErosion #TamilNadu',
        timestamp: new Date(Date.now() - 8400000).toISOString(),
        engagement: { likes: 345, shares: 123, comments: 67 },
        verified: true
      },
      {
        platform: '@LocalFisherman_Goa',
        author: 'Local Fisherman',
        content: 'Unusual tide patterns at Baga Beach today. Water receded much more than normal low tide. Old fishermen say they never seen like this before. Anyone else notice? #GoaBeach #UnusualTide',
        timestamp: new Date(Date.now() - 2400000).toISOString(),
        engagement: { likes: 89, shares: 23, comments: 34 },
        verified: false
      },
      {
        platform: '@PuducherryPorts',
        author: 'Puducherry Port Authority',
        content: 'Strong coastal currents reported in Puducherry waters. All small vessel operations suspended. Rip current advisory issued for beaches. #RipCurrent #PuducherryPorts',
        timestamp: new Date(Date.now() - 7800000).toISOString(),
        engagement: { likes: 156, shares: 45, comments: 28 },
        verified: true
      },
      {
        platform: '@OrissaDisasterMgmt',
        author: 'Odisha Disaster Management',
        content: 'Swell surge alert for Puri and Konark beaches. Wave height forecast: 4-5m. Tourists and locals advised to maintain safe distance from shoreline. #SwellSurge #Odisha',
        timestamp: new Date(Date.now() - 5700000).toISOString(),
        engagement: { likes: 278, shares: 89, comments: 43 },
        verified: true
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

  // Enhanced multilingual support for Indian regional languages
  translateRegionalText(text, sourceLanguage = 'auto') {
    // This is a simplified transliteration/translation helper
    // In production, integrate with Google Translate API or similar service
    
    const regionalKeywords = {
      // Tamil keywords
      'kadal': 'sea',
      'alai': 'wave', 
      'meenavar': 'fishermen',
      'puyal': 'cyclone',
      
      // Hindi keywords
      'samudra': 'ocean',
      'sagar': 'sea',
      'machhua': 'fishermen',
      'toofan': 'storm',
      
      // Bengali keywords
      'samudra': 'ocean',
      'machh': 'fish',
      'jhor': 'storm',
      
      // Gujarati keywords
      'darya': 'sea',
      'machimaar': 'fishermen',
      'vaavazoda': 'storm',
      
      // Malayalam keywords
      'kayal': 'backwater',
      'theera': 'coast',
      'matsyakar': 'fishermen'
    };

    let translatedText = text;
    
    for (const [regional, english] of Object.entries(regionalKeywords)) {
      const regex = new RegExp(regional, 'gi');
      translatedText = translatedText.replace(regex, english);
    }

    return {
      originalText: text,
      translatedText: translatedText,
      detectedLanguage: sourceLanguage,
      translatedTerms: Object.keys(regionalKeywords).filter(term => 
        text.toLowerCase().includes(term)
      )
    };
  },

  // Enhanced geolocation-based filtering for Indian coastal regions
  getCoastalRegionInfo(latitude, longitude) {
    const coastalRegions = [
      {
        name: 'Mumbai Coast',
        state: 'Maharashtra',
        bounds: { latMin: 18.8, latMax: 19.3, lngMin: 72.7, lngMax: 73.0 },
        hazards: ['storm_surge', 'high_waves', 'marine_flooding', 'monsoon_surge'],
        languages: ['marathi', 'hindi', 'english']
      },
      {
        name: 'Chennai Coast',
        state: 'Tamil Nadu', 
        bounds: { latMin: 12.8, latMax: 13.3, lngMin: 80.1, lngMax: 80.4 },
        hazards: ['cyclone', 'storm_surge', 'tsunami', 'coastal_erosion'],
        languages: ['tamil', 'english']
      },
      {
        name: 'Kochi Coast',
        state: 'Kerala',
        bounds: { latMin: 9.8, latMax: 10.1, lngMin: 76.1, lngMax: 76.4 },
        hazards: ['monsoon_surge', 'coastal_erosion', 'swell_surge'],
        languages: ['malayalam', 'english']
      },
      {
        name: 'Visakhapatnam Coast',
        state: 'Andhra Pradesh',
        bounds: { latMin: 17.5, latMax: 17.9, lngMin: 83.1, lngMax: 83.4 },
        hazards: ['cyclone', 'storm_surge', 'high_waves'],
        languages: ['telugu', 'english']
      },
      {
        name: 'Kolkata Coast',
        state: 'West Bengal',
        bounds: { latMin: 21.8, latMax: 22.7, lngMin: 88.0, lngMax: 88.5 },
        hazards: ['cyclone', 'storm_surge', 'tidal_surge'],
        languages: ['bengali', 'english']
      },
      {
        name: 'Gujarat Coast',
        state: 'Gujarat',
        bounds: { latMin: 20.0, latMax: 23.5, lngMin: 68.0, lngMax: 72.5 },
        hazards: ['cyclone', 'storm_surge', 'high_waves', 'coastal_erosion'],
        languages: ['gujarati', 'hindi', 'english']
      },
      {
        name: 'Goa Coast',
        state: 'Goa',
        bounds: { latMin: 15.0, latMax: 15.8, lngMin: 73.7, lngMax: 74.2 },
        hazards: ['monsoon_surge', 'coastal_erosion', 'rip_current'],
        languages: ['konkani', 'marathi', 'english']
      },
      {
        name: 'Odisha Coast',
        state: 'Odisha',
        bounds: { latMin: 19.3, latMax: 21.9, lngMin: 85.0, lngMax: 87.5 },
        hazards: ['cyclone', 'storm_surge', 'tsunami', 'coastal_erosion'],
        languages: ['odia', 'english']
      }
    ];

    const matchingRegion = coastalRegions.find(region => 
      latitude >= region.bounds.latMin && latitude <= region.bounds.latMax &&
      longitude >= region.bounds.lngMin && longitude <= region.bounds.lngMax
    );

    return matchingRegion || {
      name: 'Indian Coast',
      state: 'Unknown',
      hazards: ['general_ocean_hazard'],
      languages: ['english']
    };
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