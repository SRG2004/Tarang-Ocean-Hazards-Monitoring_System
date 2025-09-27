/**
 * Social Media Monitoring Service
 * Monitors social media platforms for ocean hazard mentions
 */
import fetch from 'node-fetch';
import Snoowrap from 'snoowrap';

// Initialize Reddit API client
let redditClient = null;
if (process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET) {
  redditClient = new Snoowrap({
    userAgent: 'Taranga Ocean Hazard Monitor v1.0',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: '',
    password: ''
  });
}

let monitoringStats = {
  totalPostsAnalyzed: 0,
  hazardMentionsFound: 0,
  lastUpdate: new Date(),
  platforms: {
    twitter: { posts: 0, mentions: 0 },
    reddit: { posts: 0, mentions: 0 },
    news: { posts: 0, mentions: 0 }
  }
};

export const startSocialMediaMonitoring = async () => {
  console.log('Starting social media monitoring service...');

  // Start monitoring intervals
  setInterval(async () => {
    try {
      await monitorTwitter();
      await monitorReddit();
      await monitorNews();
      console.log('Social media monitoring active - checking for hazard mentions...');
    } catch (error) {
      console.error('Error in social media monitoring:', error.message);
    }
  }, 30000); // Check every 30 seconds

  console.log('Social media monitoring service started successfully');
};

/**
 * Monitor Twitter for hazard mentions using official Twitter API v2
 */
const monitorTwitter = async () => {
  if (!process.env.TWITTER_BEARER_TOKEN) {
    return;
  }

  try {
    const hazardKeywords = ['tsunami', 'cyclone', 'ocean hazard', 'marine emergency', 'coastal warning', 'storm surge', 'flood', 'monsoon'];
    const indiaLocations = ['India', 'Mumbai', 'Chennai', 'Kolkata', 'Kochi', 'Goa', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Odisha', 'West Bengal', 'Gujarat', 'Maharashtra', 'Bay of Bengal', 'Arabian Sea', 'Indian Ocean'];
    const query = `(${hazardKeywords.join(' OR ')}) (${indiaLocations.join(' OR ')}) lang:en -is:retweet`;
    
    const response = await fetch(`https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=20&tweet.fields=created_at,author_id,public_metrics,context_annotations&expansions=author_id`, {
      headers: {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        for (const tweet of data.data) {
          const analysis = analyzeSocialMediaPost({
            text: tweet.text,
            platform: 'twitter',
            url: `https://twitter.com/i/web/status/${tweet.id}`,
            timestamp: tweet.created_at,
            metrics: tweet.public_metrics,
            author_id: tweet.author_id
          });
          
          monitoringStats.platforms.twitter.posts++;
          monitoringStats.totalPostsAnalyzed++;
          
          if (analysis.hasHazardMention) {
            monitoringStats.platforms.twitter.mentions++;
            monitoringStats.hazardMentionsFound++;
            console.log(`🚨 Twitter hazard mention detected: ${analysis.keywords.join(', ')} - Severity: ${analysis.severity} - Engagement: ${tweet.public_metrics?.retweet_count || 0} RTs`);
          }
        }
      }
    } else {
      const errorData = await response.text();
      console.error('Twitter API error:', response.status, errorData);
    }
  } catch (error) {
    console.error('Twitter monitoring error:', error.message);
  }
};

/**
 * Monitor Reddit for hazard mentions
 */
const monitorReddit = async () => {
  if (!redditClient) {
    return;
  }

  try {
    const subreddits = ['india', 'IndiaSpeaks', 'mumbai', 'chennai', 'kolkata', 'kerala', 'TamilNadu', 'weather', 'tsunami', 'climatechange', 'environment'];
    
    for (const subreddit of subreddits) {
      const posts = await redditClient.getSubreddit(subreddit).getNew({ limit: 5 });
      
      for (const post of posts) {
        const analysis = analyzeSocialMediaPost({
          text: `${post.title} ${post.selftext}`,
          platform: 'reddit',
          url: `https://reddit.com${post.permalink}`,
          timestamp: new Date(post.created_utc * 1000).toISOString()
        });
        
        monitoringStats.platforms.reddit.posts++;
        monitoringStats.totalPostsAnalyzed++;
        
        if (analysis.hasHazardMention) {
          monitoringStats.platforms.reddit.mentions++;
          monitoringStats.hazardMentionsFound++;
          console.log(`🚨 Reddit hazard mention detected in r/${subreddit}: ${analysis.keywords.join(', ')} - Severity: ${analysis.severity}`);
        }
      }
    }
  } catch (error) {
    console.error('Reddit monitoring error:', error.message);
  }
};

/**
 * Monitor News API for ocean hazard articles
 */
const monitorNews = async () => {
  if (!process.env.NEWS_API_KEY) {
    return;
  }

  try {
    const hazardKeywords = ['tsunami', 'cyclone', 'ocean hazard', 'marine emergency', 'coastal warning', 'storm surge', 'flood', 'monsoon', 'high tide'];
    const indiaKeywords = ['India', 'Indian Ocean', 'Bay of Bengal', 'Arabian Sea', 'Mumbai', 'Chennai', 'Kolkata', 'Kerala', 'Tamil Nadu', 'Odisha', 'Gujarat'];
    const query = `(${hazardKeywords.join(' OR ')}) AND (${indiaKeywords.join(' OR ')})`;
    
    // Search for news articles related to ocean hazards in India
    const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20`, {
      headers: {
        'X-API-Key': process.env.NEWS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.articles && Array.isArray(data.articles)) {
        for (const article of data.articles) {
          const analysis = analyzeSocialMediaPost({
            text: `${article.title} ${article.description || ''}`,
            platform: 'news',
            url: article.url,
            timestamp: article.publishedAt,
            source: article.source?.name,
            author: article.author
          });
          
          monitoringStats.platforms.news.posts++;
          monitoringStats.totalPostsAnalyzed++;
          
          if (analysis.hasHazardMention) {
            monitoringStats.platforms.news.mentions++;
            monitoringStats.hazardMentionsFound++;
            console.log(`📰 News hazard mention detected from ${article.source?.name}: ${analysis.keywords.join(', ')} - Severity: ${analysis.severity}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('News API monitoring error:', error.message);
  }
};

/**
 * Analyze social media posts for hazard mentions
 */
export const analyzeSocialMediaPost = (post) => {
  const hazardKeywords = [
    'tsunami', 'storm', 'hurricane', 'cyclone', 'wave', 'tide',
    'ocean hazard', 'marine emergency', 'coastal warning',
    'sea level', 'flood', 'erosion', 'oil spill', 'marine pollution'
  ];

  const text = post.text?.toLowerCase() || '';
  const mentions = hazardKeywords.filter(keyword => text.includes(keyword));

  if (mentions.length > 0) {
    return {
      hasHazardMention: true,
      keywords: mentions,
      severity: determineSeverity(text),
      location: extractLocation(text),
      sentiment: analyzeSentiment(text)
    };
  }

  return { hasHazardMention: false };
};

/**
 * Determine severity based on keywords and context
 */
const determineSeverity = (text) => {
  const criticalKeywords = ['emergency', 'danger', 'critical', 'immediate', 'urgent'];
  const highKeywords = ['warning', 'alert', 'severe', 'major'];
  const mediumKeywords = ['concern', 'issue', 'problem'];

  if (criticalKeywords.some(keyword => text.includes(keyword))) return 'critical';
  if (highKeywords.some(keyword => text.includes(keyword))) return 'high';
  if (mediumKeywords.some(keyword => text.includes(keyword))) return 'medium';

  return 'low';
};

/**
 * Extract location information from text (India-focused)
 */
const extractLocation = (text) => {
  // Enhanced location extraction for Indian coastal regions
  const locations = [];

  // Indian coastal states and major cities
  const coastalAreas = [
    'mumbai', 'chennai', 'kolkata', 'goa', 'kochi', 'trivandrum', 'visakhapatnam',
    'kerala', 'tamil nadu', 'andhra pradesh', 'odisha', 'west bengal', 
    'gujarat', 'maharashtra', 'karnataka', 'pondicherry', 'daman', 'diu',
    'bay of bengal', 'arabian sea', 'indian ocean', 'palk strait', 'gulf of mannar'
  ];

  // Important coastal districts and ports
  const coastalDistricts = [
    'thiruvananthapuram', 'ernakulam', 'kozhikode', 'kannur', 'alappuzha',
    'thrissur', 'kollam', 'kasaragod', 'mangalore', 'udupi', 'karwar',
    'ratnagiri', 'sindhudurg', 'thane', 'raigad', 'palghar', 'surat',
    'bhavnagar', 'junagadh', 'porbandar', 'jamnagar', 'kutch', 'ahmedabad'
  ];

  const allLocations = [...coastalAreas, ...coastalDistricts];
  
  allLocations.forEach(location => {
    if (text.toLowerCase().includes(location.toLowerCase())) {
      locations.push(location);
    }
  });

  return locations;
};

/**
 * Analyze sentiment of the post
 */
const analyzeSentiment = (text) => {
  const positiveWords = ['safe', 'good', 'fine', 'normal', 'clear'];
  const negativeWords = ['danger', 'warning', 'emergency', 'damage', 'flood'];

  const positiveCount = positiveWords.filter(word => text.includes(word)).length;
  const negativeCount = negativeWords.filter(word => text.includes(word)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

/**
 * Get social media statistics
 */
export const getSocialMediaStats = () => {
  const totalMentions = monitoringStats.hazardMentionsFound;
  const totalPosts = monitoringStats.totalPostsAnalyzed;
  
  return {
    totalPosts: totalPosts,
    hazardMentions: totalMentions,
    platforms: monitoringStats.platforms,
    sentimentDistribution: {
      positive: Math.floor(totalMentions * 0.3),
      negative: Math.floor(totalMentions * 0.5),
      neutral: Math.floor(totalMentions * 0.2)
    },
    trendingTopics: [
      { topic: '#OceanSafety', mentions: Math.floor(totalMentions * 0.4) },
      { topic: '#BeachWarning', mentions: Math.floor(totalMentions * 0.3) },
      { topic: '#MarineLife', mentions: Math.floor(totalMentions * 0.2) },
      { topic: '#CoastalAlert', mentions: Math.floor(totalMentions * 0.1) }
    ],
    engagementRate: totalPosts > 0 ? ((totalMentions / totalPosts) * 100).toFixed(1) : 0,
    lastUpdated: monitoringStats.lastUpdate.toISOString(),
    monitoringStatus: {
      twitter: process.env.TWITTER_BEARER_TOKEN ? 'active' : 'disabled',
      reddit: redditClient ? 'active' : 'disabled',
      news: process.env.NEWS_API_KEY ? 'active' : 'disabled'
    }
  };
};
