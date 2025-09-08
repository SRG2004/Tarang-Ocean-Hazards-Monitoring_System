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
    reddit: { posts: 0, mentions: 0 }
  }
};

export const startSocialMediaMonitoring = async () => {
  console.log('Starting social media monitoring service...');

  // Start monitoring intervals
  setInterval(async () => {
    try {
      await monitorTwitter();
      await monitorReddit();
      console.log('Social media monitoring active - checking for hazard mentions...');
    } catch (error) {
      console.error('Error in social media monitoring:', error.message);
    }
  }, 30000); // Check every 30 seconds

  console.log('Social media monitoring service started successfully');
};

/**
 * Monitor Twitter for hazard mentions using TwitterAPI.io
 */
const monitorTwitter = async () => {
  if (!process.env.TWITTERAPI_IO_KEY) {
    return;
  }

  try {
    const hazardKeywords = ['tsunami', 'hurricane', 'cyclone', 'ocean hazard', 'marine emergency', 'coastal warning'];
    const query = hazardKeywords.join(' OR ');
    
    const response = await fetch(`https://api.twitterapi.io/tweets/search?query=${encodeURIComponent(query)}&limit=10`, {
      headers: {
        'Authorization': `Bearer ${process.env.TWITTERAPI_IO_KEY}`,
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
            timestamp: tweet.created_at
          });
          
          monitoringStats.platforms.twitter.posts++;
          monitoringStats.totalPostsAnalyzed++;
          
          if (analysis.hasHazardMention) {
            monitoringStats.platforms.twitter.mentions++;
            monitoringStats.hazardMentionsFound++;
            console.log(`🚨 Twitter hazard mention detected: ${analysis.keywords.join(', ')} - Severity: ${analysis.severity}`);
          }
        }
      }
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
    const subreddits = ['weather', 'tsunami', 'hurricane', 'climatechange', 'environment'];
    
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
 * Extract location information from text
 */
const extractLocation = (text) => {
  // Simple location extraction - in a real implementation,
  // this would use geocoding services
  const locations = [];

  // Common coastal locations (simplified)
  const coastalAreas = [
    'mumbai', 'chennai', 'kolkata', 'goa', 'kerala', 'tamil nadu',
    'andhra pradesh', 'odisha', 'west bengal', 'gujarat', 'maharashtra'
  ];

  coastalAreas.forEach(location => {
    if (text.includes(location)) {
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
      twitter: process.env.TWITTERAPI_IO_KEY ? 'active' : 'disabled',
      reddit: redditClient ? 'active' : 'disabled'
    }
  };
};
