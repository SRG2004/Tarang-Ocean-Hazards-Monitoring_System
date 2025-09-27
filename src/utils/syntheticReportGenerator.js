/**
 * Synthetic Social Media Report Generator
 * Creates artificial social media posts for testing hotspot generation
 */

export class SyntheticReportGenerator {
  constructor() {
    this.isGenerating = false;
    this.generationInterval = null;
    this.reportCount = 0;
    this.config = {
      platforms: ['twitter', 'facebook', 'instagram', 'youtube'],
      hazardTypes: ['cyclone', 'tsunami', 'flood', 'storm', 'high_waves', 'coastal_erosion'],
      locations: [
        { name: 'Chennai', lat: 13.0827, lng: 80.2707, radius: 0.5 },
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777, radius: 0.5 },
        { name: 'Kochi', lat: 9.9312, lng: 76.2673, radius: 0.5 },
        { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, radius: 0.5 },
        { name: 'Goa', lat: 15.2993, lng: 74.1240, radius: 0.5 },
        { name: 'Puducherry', lat: 11.9139, lng: 79.8145, radius: 0.5 },
        { name: 'Kolkata', lat: 22.5726, lng: 88.3639, radius: 0.5 },
        { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, radius: 0.5 }
      ],
      authors: [
        'CoastalWatch', 'WeatherAlert', 'OceanSafety', 'MarineGuard',
        'BeachPatrol', 'StormTracker', 'TideMonitor', 'CoastGuardOfficial',
        'FishermanAlert', 'MarineWeather', 'CoastalResident', 'WeatherWatcher2024'
      ]
    };
  }

  /**
   * Generate a single synthetic social media post
   */
  generateSyntheticPost(options = {}) {
    const {
      hazardType = this.getRandomItem(this.config.hazardTypes),
      location = this.getRandomItem(this.config.locations),
      platform = this.getRandomItem(this.config.platforms),
      author = this.getRandomItem(this.config.authors),
      severity = this.getRandomSeverity(),
      sentiment = this.getRandomSentiment()
    } = options;

    // Generate coordinates within the location radius
    const coordinates = this.generateCoordinatesInRadius(
      location.lat,
      location.lng,
      location.radius
    );

    // Generate content based on hazard type and sentiment
    const content = this.generateContent(hazardType, location.name, sentiment, severity);

    // Calculate sentiment score
    const sentimentScore = this.calculateSentimentScore(content, sentiment);

    // Extract keywords
    const keywords = this.extractKeywords(content, hazardType);

    // Generate engagement metrics
    const engagement = this.generateEngagement(sentiment, severity);

    const post = {
      id: `synthetic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      platform,
      content,
      author,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(), // Random time within last 24h
      sentiment: {
        label: sentiment,
        score: sentimentScore
      },
      keywords,
      isHazardRelated: true,
      location: {
        name: location.name,
        lat: coordinates.lat,
        lng: coordinates.lng
      },
      relevanceScore: this.calculateRelevanceScore(keywords, sentiment, severity),
      engagement,
      isSynthetic: true, // Flag to identify synthetic posts
      generatedAt: new Date().toISOString(),
      hazardType,
      severity
    };

    return post;
  }

  /**
   * Generate multiple synthetic posts
   */
  generateMultiplePosts(count = 5, options = {}) {
    const posts = [];
    for (let i = 0; i < count; i++) {
      posts.push(this.generateSyntheticPost(options));
    }
    return posts;
  }

  /**
   * Start continuous generation of synthetic reports
   */
  startGeneration(intervalMinutes = 5, postsPerInterval = 3, callback) {
    if (this.isGenerating) {
      console.warn('Synthetic report generation is already running');
      return;
    }

    this.isGenerating = true;
    console.log(`Starting synthetic report generation: ${postsPerInterval} posts every ${intervalMinutes} minutes`);

    this.generationInterval = setInterval(() => {
      const posts = this.generateMultiplePosts(postsPerInterval);
      this.reportCount += posts.length;

      if (callback && typeof callback === 'function') {
        callback(posts);
      }

      console.log(`Generated ${posts.length} synthetic reports. Total: ${this.reportCount}`);
    }, intervalMinutes * 60 * 1000);

    return this.generationInterval;
  }

  /**
   * Stop synthetic report generation
   */
  stopGeneration() {
    if (this.generationInterval) {
      clearInterval(this.generationInterval);
      this.generationInterval = null;
    }
    this.isGenerating = false;
    console.log(`Stopped synthetic report generation. Total generated: ${this.reportCount}`);
  }

  /**
   * Get generation status
   */
  getStatus() {
    return {
      isGenerating: this.isGenerating,
      reportCount: this.reportCount,
      intervalId: this.generationInterval
    };
  }

  // Helper methods
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getRandomSeverity() {
    const severities = ['low', 'medium', 'high', 'critical'];
    const weights = [0.3, 0.4, 0.2, 0.1]; // More low/medium, fewer high/critical
    const random = Math.random();
    let sum = 0;

    for (let i = 0; i < severities.length; i++) {
      sum += weights[i];
      if (random <= sum) return severities[i];
    }
    return 'medium';
  }

  getRandomSentiment() {
    const sentiments = ['positive', 'neutral', 'negative'];
    const weights = [0.1, 0.3, 0.6]; // More negative for hazard monitoring
    const random = Math.random();
    let sum = 0;

    for (let i = 0; i < sentiments.length; i++) {
      sum += weights[i];
      if (random <= sum) return sentiments[i];
    }
    return 'negative';
  }

  generateCoordinatesInRadius(lat, lng, radiusKm) {
    // Generate random point within radius (simplified)
    const radiusInDeg = radiusKm / 111.32; // Rough conversion
    const u = Math.random();
    const v = Math.random();
    const w = radiusInDeg * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    return {
      lat: lat + y,
      lng: lng + x
    };
  }

  generateContent(hazardType, locationName, sentiment, severity) {
    const templates = {
      cyclone: {
        negative: [
          `Cyclone warning issued for ${locationName} coast. Strong winds and heavy rainfall expected. Stay indoors and follow safety guidelines. #CycloneAlert`,
          `Emergency alert: Cyclone approaching ${locationName}. Fishermen advised to return to shore immediately. Coastal areas on high alert. #WeatherEmergency`,
          `Severe cyclonic storm developing near ${locationName}. Expected to make landfall in next 24 hours. Evacuation preparations underway. #CycloneWarning`
        ],
        neutral: [
          `Weather update: Cyclonic conditions developing near ${locationName}. Monitoring the situation closely. #WeatherUpdate`,
          `Cyclone watch issued for ${locationName} coastal region. Residents advised to stay informed. #WeatherAlert`
        ],
        positive: [
          `Cyclone threat for ${locationName} appears to be weakening. Weather conditions improving. #WeatherUpdate`
        ]
      },
      tsunami: {
        negative: [
          `TSUNAMI WARNING: ${locationName} coast under threat. Move to higher ground immediately. Emergency services activated. #TsunamiAlert`,
          `Earthquake detected - Tsunami watch issued for ${locationName}. Coastal evacuation in progress. #EmergencyAlert`,
          `URGENT: Tsunami waves approaching ${locationName}. Height estimated at 3-5 meters. Seek immediate shelter inland. #TsunamiWarning`
        ],
        neutral: [
          `Tsunami advisory issued for ${locationName} following seismic activity. Monitoring wave patterns. #TsunamiWatch`,
          `Seismic event detected near ${locationName}. Tsunami evaluation in progress. #EarthquakeAlert`
        ],
        positive: [
          `Tsunami threat for ${locationName} has been cancelled. All clear signal given. #AllClear`
        ]
      },
      flood: {
        negative: [
          `FLOOD WARNING: ${locationName} experiencing heavy flooding. Low-lying areas underwater. Emergency response teams deployed. #FloodAlert`,
          `Flash flood emergency in ${locationName}. Rivers overflowing, roads impassable. Stay away from water bodies. #WeatherEmergency`,
          `Coastal flooding reported in ${locationName}. Storm surge causing significant water rise. Evacuation recommended. #CoastalFlood`
        ],
        neutral: [
          `Flood watch issued for ${locationName} area. Heavy rainfall expected. Monitor local conditions. #WeatherWatch`,
          `Rising water levels observed in ${locationName}. Flood preparations advised. #FloodWatch`
        ],
        positive: [
          `Flood waters in ${locationName} are receding. Situation improving gradually. #WeatherUpdate`
        ]
      },
      storm: {
        negative: [
          `Severe storm warning for ${locationName}. Gale force winds and heavy rain expected. Secure loose objects and stay indoors. #StormAlert`,
          `Dangerous storm conditions in ${locationName}. Power outages reported, fallen trees blocking roads. Emergency services responding. #StormWarning`,
          `Storm emergency: ${locationName} under attack from severe weather. Lightning strikes and strong winds causing damage. #SevereWeather`
        ],
        neutral: [
          `Storm watch issued for ${locationName} region. Thunderstorms possible in coming hours. #WeatherWatch`,
          `Weather advisory: Storm developing near ${locationName}. Monitor for updates. #StormWatch`
        ],
        positive: [
          `Storm over ${locationName} has passed. Weather conditions returning to normal. #WeatherUpdate`
        ]
      }
    };

    const typeTemplates = templates[hazardType] || templates.cyclone;
    const sentimentTemplates = typeTemplates[sentiment] || typeTemplates.negative;

    return this.getRandomItem(sentimentTemplates);
  }

  calculateSentimentScore(content, sentiment) {
    const negativeWords = ['warning', 'alert', 'emergency', 'danger', 'flood', 'storm', 'cyclone', 'tsunami', 'evacuation', 'damage'];
    const positiveWords = ['clear', 'safe', 'improving', 'normal', 'passed', 'receding', 'cancelled'];

    let score = 0;
    const contentLower = content.toLowerCase();

    negativeWords.forEach(word => {
      if (contentLower.includes(word)) score -= 2;
    });

    positiveWords.forEach(word => {
      if (contentLower.includes(word)) score += 1;
    });

    // Adjust based on sentiment
    if (sentiment === 'negative') score -= 3;
    else if (sentiment === 'positive') score += 2;

    return Math.max(-10, Math.min(10, score));
  }

  extractKeywords(content, hazardType) {
    const hazardKeywords = [
      'tsunami', 'cyclone', 'storm', 'flood', 'wave', 'surge', 'tide',
      'coastal', 'marine', 'ocean', 'sea', 'beach', 'erosion', 'current',
      'warning', 'alert', 'emergency', 'evacuation', 'rescue', 'safety',
      'fishermen', 'vessel', 'boat', 'harbor', 'port', 'coast guard',
      'imd', 'incois', 'meteorological', 'weather', 'wind', 'pressure'
    ];

    const extractedKeywords = [hazardType];
    const contentLower = content.toLowerCase();

    hazardKeywords.forEach(keyword => {
      if (contentLower.includes(keyword) && !extractedKeywords.includes(keyword)) {
        extractedKeywords.push(keyword);
      }
    });

    return extractedKeywords;
  }

  generateEngagement(sentiment, severity) {
    let baseLikes = Math.floor(Math.random() * 100) + 50;
    let baseShares = Math.floor(Math.random() * 50) + 10;
    let baseComments = Math.floor(Math.random() * 30) + 5;

    // Increase engagement for negative sentiment and high severity
    if (sentiment === 'negative') {
      baseLikes *= 2;
      baseShares *= 3;
      baseComments *= 2;
    }

    if (severity === 'critical' || severity === 'high') {
      baseLikes *= 1.5;
      baseShares *= 2;
      baseComments *= 1.5;
    }

    return {
      likes: Math.floor(baseLikes),
      shares: Math.floor(baseShares),
      comments: Math.floor(baseComments)
    };
  }

  calculateRelevanceScore(keywords, sentiment, severity) {
    let score = keywords.length * 15;

    if (sentiment === 'negative') score += 20;
    if (severity === 'critical') score += 30;
    else if (severity === 'high') score += 20;
    else if (severity === 'medium') score += 10;

    return Math.min(100, Math.round(score));
  }
}

// Create singleton instance
export const syntheticReportGenerator = new SyntheticReportGenerator();
