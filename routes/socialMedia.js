/**
 * Social Media Monitoring Routes
 * Real-time social media analysis and sentiment monitoring for ocean hazards
 */

import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { firestore } from '../config/database.js';
import Sentiment from 'sentiment';
import axios from 'axios';

const router = express.Router();
const sentiment = new Sentiment();

/**
 * GET /api/social-media/monitoring
 * Get processed social media posts with sentiment analysis
 */
router.get('/monitoring', authenticateToken, async (req, res) => {
  try {
    const { 
      platform,
      sentiment: sentimentFilter,
      minRelevance = 60,
      limit: queryLimit = 50,
      startDate,
      endDate
    } = req.query;
    
    let q = collection(firestore, 'socialMediaPosts');
    const constraints = [];
    
    // Apply filters
    if (platform) {
      constraints.push(where('platform', '==', platform));
    }
    
    if (sentimentFilter) {
      constraints.push(where('sentiment.label', '==', sentimentFilter));
    }
    
    constraints.push(where('relevanceScore', '>=', parseInt(minRelevance)));
    constraints.push(orderBy('relevanceScore', 'desc'));
    constraints.push(orderBy('processedAt', 'desc'));
    constraints.push(limit(parseInt(queryLimit)));
    
    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      
      // Apply date filter if specified
      if (startDate || endDate) {
        const postDate = new Date(post.timestamp || post.processedAt);
        if (startDate && postDate < new Date(startDate)) return;
        if (endDate && postDate > new Date(endDate)) return;
      }
      
      posts.push({
        id: doc.id,
        ...post,
        timeAgo: getTimeAgo(post.timestamp || post.processedAt)
      });
    });
    
    res.json({
      posts,
      total: posts.length,
      filters: { platform, sentiment: sentimentFilter, minRelevance, startDate, endDate }
    });
    
  } catch (error) {
    console.error('Get social media monitoring error:', error);
    res.status(500).json({
      error: 'Failed to retrieve social media data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/social-media/sentiment-analysis
 * Get sentiment analysis statistics
 */
router.get('/sentiment-analysis', authenticateToken, async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '1h':
        startDate.setHours(now.getHours() - 1);
        break;
      case '24h':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setDate(now.getDate() - 1);
    }
    
    // Get posts from the specified time range
    const q = query(
      collection(firestore, 'socialMediaPosts'),
      where('processedAt', '>=', startDate.toISOString()),
      orderBy('processedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach(doc => posts.push(doc.data()));
    
    // Calculate sentiment statistics
    const sentimentStats = {
      positive: 0,
      negative: 0,
      neutral: 0,
      total: posts.length,
      averageScore: 0,
      platformBreakdown: {},
      hourlyTrends: new Array(24).fill(0).map((_, i) => ({
        hour: i,
        positive: 0,
        negative: 0,
        neutral: 0
      })),
      topKeywords: {},
      criticalAlerts: 0
    };
    
    let totalScore = 0;
    
    posts.forEach(post => {
      // Sentiment counting
      const sentimentLabel = post.sentiment?.label || 'neutral';
      sentimentStats[sentimentLabel]++;
      
      // Platform breakdown
      const platform = post.platform || 'unknown';
      if (!sentimentStats.platformBreakdown[platform]) {
        sentimentStats.platformBreakdown[platform] = { positive: 0, negative: 0, neutral: 0 };
      }
      sentimentStats.platformBreakdown[platform][sentimentLabel]++;
      
      // Hourly trends
      const hour = new Date(post.timestamp || post.processedAt).getHours();
      sentimentStats.hourlyTrends[hour][sentimentLabel]++;
      
      // Keyword frequency
      (post.keywords || []).forEach(keyword => {
        sentimentStats.topKeywords[keyword] = (sentimentStats.topKeywords[keyword] || 0) + 1;
      });
      
      // Average score calculation
      totalScore += post.sentiment?.score || 0;
      
      // Critical alerts (negative sentiment + high relevance)
      if (sentimentLabel === 'negative' && (post.relevanceScore || 0) > 80) {
        sentimentStats.criticalAlerts++;
      }
    });
    
    sentimentStats.averageScore = posts.length > 0 ? totalScore / posts.length : 0;
    
    // Convert keywords object to sorted array
    sentimentStats.topKeywords = Object.entries(sentimentStats.topKeywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));
    
    res.json({
      sentimentStats,
      timeRange,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get sentiment analysis error:', error);
    res.status(500).json({
      error: 'Failed to retrieve sentiment analysis',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/social-media/trending
 * Get trending topics and hashtags
 */
router.get('/trending', async (req, res) => {
  try {
    const { limit: queryLimit = 20, timeRange = '24h' } = req.query;
    
    // Get recent posts
    const now = new Date();
    const startDate = new Date();
    startDate.setHours(now.getHours() - (timeRange === '1h' ? 1 : 24));
    
    const q = query(
      collection(firestore, 'socialMediaPosts'),
      where('isHazardRelated', '==', true),
      where('processedAt', '>=', startDate.toISOString()),
      orderBy('processedAt', 'desc'),
      limit(500) // Get more posts to analyze trends
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach(doc => posts.push(doc.data()));
    
    // Analyze trending topics
    const keywordFrequency = {};
    const hashtagFrequency = {};
    const platformActivity = {};
    
    posts.forEach(post => {
      // Count keywords
      (post.keywords || []).forEach(keyword => {
        keywordFrequency[keyword] = (keywordFrequency[keyword] || 0) + 1;
      });
      
      // Extract and count hashtags from content
      const hashtags = (post.content || '').match(/#\w+/g) || [];
      hashtags.forEach(hashtag => {
        const tag = hashtag.toLowerCase();
        hashtagFrequency[tag] = (hashtagFrequency[tag] || 0) + 1;
      });
      
      // Platform activity
      const platform = post.platform || 'unknown';
      if (!platformActivity[platform]) {
        platformActivity[platform] = { count: 0, engagement: 0 };
      }
      platformActivity[platform].count++;
      platformActivity[platform].engagement += (post.engagement?.likes || 0) + (post.engagement?.shares || 0);
    });
    
    // Sort and limit trending topics
    const trendingKeywords = Object.entries(keywordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, parseInt(queryLimit))
      .map(([keyword, count]) => ({
        name: keyword,
        count,
        trend: 'up', // Simplified - could calculate actual trend
        sentiment: getKeywordSentiment(keyword, posts)
      }));
    
    const trendingHashtags = Object.entries(hashtagFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([hashtag, count]) => ({ hashtag, count }));
    
    res.json({
      trending: {
        keywords: trendingKeywords,
        hashtags: trendingHashtags,
        platformActivity: Object.entries(platformActivity)
          .map(([platform, data]) => ({ platform, ...data }))
          .sort((a, b) => b.count - a.count)
      },
      timeRange,
      totalPosts: posts.length,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get trending topics error:', error);
    res.status(500).json({
      error: 'Failed to retrieve trending topics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/social-media/process
 * Process and analyze new social media content
 */
router.post('/process',
  authenticateToken,
  authorizeRoles('official', 'analyst', 'admin'),
  async (req, res) => {
    try {
      const { content, platform, author, url, timestamp } = req.body;
      
      if (!content || !platform) {
        return res.status(400).json({
          error: 'Content and platform are required'
        });
      }
      
      // Perform sentiment analysis
      const sentimentResult = sentiment.analyze(content);
      
      // Determine sentiment label
      let sentimentLabel = 'neutral';
      if (sentimentResult.score > 2) sentimentLabel = 'positive';
      else if (sentimentResult.score < -2) sentimentLabel = 'negative';
      
      // Extract hazard-related keywords
      const hazardKeywords = extractHazardKeywords(content);
      
      // Calculate relevance score
      const relevanceScore = calculateRelevanceScore(content, hazardKeywords, sentimentResult);
      
      // Generate unique ID
      const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create processed post object
      const processedPost = {
        id: postId,
        content,
        platform: platform.toLowerCase(),
        author: author || 'unknown',
        url: url || '',
        timestamp: timestamp || new Date().toISOString(),
        processedAt: new Date().toISOString(),
        sentiment: {
          score: sentimentResult.score,
          comparative: sentimentResult.comparative,
          label: sentimentLabel,
          positive: sentimentResult.positive,
          negative: sentimentResult.negative,
          words: sentimentResult.words
        },
        keywords: hazardKeywords,
        relevanceScore,
        isHazardRelated: hazardKeywords.length > 0 || sentimentLabel === 'negative',
        engagement: {
          likes: 0,
          shares: 0,
          comments: 0
        },
        processedBy: req.user.userId || req.user.id
      };
      
      // Save to database
      await setDoc(doc(firestore, 'socialMediaPosts', postId), processedPost);
      
      // Emit real-time update
      req.io?.emit('new-social-media-post', processedPost);
      
      res.status(201).json({
        message: 'Social media content processed successfully',
        post: processedPost
      });
      
    } catch (error) {
      console.error('Process social media content error:', error);
      res.status(500).json({
        error: 'Failed to process social media content',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * GET /api/social-media/alerts
 * Get critical social media alerts
 */
router.get('/alerts', 
  authenticateToken,
  authorizeRoles('official', 'analyst', 'admin'),
  async (req, res) => {
    try {
      const { limit: queryLimit = 20 } = req.query;
      
      // Get posts with high negative sentiment and relevance
      const q = query(
        collection(firestore, 'socialMediaPosts'),
        where('sentiment.label', '==', 'negative'),
        where('relevanceScore', '>=', 75),
        orderBy('relevanceScore', 'desc'),
        orderBy('processedAt', 'desc'),
        limit(parseInt(queryLimit))
      );
      
      const querySnapshot = await getDocs(q);
      const alerts = [];
      
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        alerts.push({
          id: doc.id,
          ...post,
          alertLevel: post.relevanceScore > 90 ? 'critical' : 'high',
          timeAgo: getTimeAgo(post.processedAt)
        });
      });
      
      res.json({
        alerts,
        total: alerts.length,
        criticalCount: alerts.filter(a => a.alertLevel === 'critical').length
      });
      
    } catch (error) {
      console.error('Get social media alerts error:', error);
      res.status(500).json({
        error: 'Failed to retrieve social media alerts',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Utility functions
function extractHazardKeywords(text) {
  const hazardKeywords = [
    'tsunami', 'cyclone', 'storm', 'flood', 'wave', 'surge', 'tide',
    'coastal', 'marine', 'ocean', 'sea', 'beach', 'erosion', 'current',
    'warning', 'alert', 'emergency', 'evacuation', 'rescue', 'safety',
    'fishermen', 'vessel', 'boat', 'harbor', 'port', 'coast guard',
    'imd', 'incois', 'meteorological', 'weather', 'wind', 'pressure',
    'drowning', 'missing', 'stranded', 'damage', 'disaster'
  ];
  
  const extractedKeywords = [];
  const textLower = text.toLowerCase();
  
  hazardKeywords.forEach(keyword => {
    if (textLower.includes(keyword)) {
      extractedKeywords.push(keyword);
    }
  });
  
  return extractedKeywords;
}

function calculateRelevanceScore(content, keywords, sentimentResult) {
  let score = 0;
  
  // Base score from keyword matches
  score += keywords.length * 15;
  
  // Negative sentiment adds relevance for hazard monitoring
  if (sentimentResult.score < 0) {
    score += Math.abs(sentimentResult.score) * 10;
  }
  
  // Content length factor
  const wordCount = content.split(/\s+/).length;
  score += Math.min(20, wordCount / 5);
  
  // Emergency-related terms boost
  const emergencyTerms = ['emergency', 'urgent', 'help', 'sos', 'danger', 'critical'];
  emergencyTerms.forEach(term => {
    if (content.toLowerCase().includes(term)) {
      score += 25;
    }
  });
  
  // Location mentions boost
  const locations = ['india', 'bengal', 'arabian', 'bay', 'chennai', 'mumbai', 'kolkata', 'kerala'];
  locations.forEach(location => {
    if (content.toLowerCase().includes(location)) {
      score += 10;
    }
  });
  
  return Math.min(100, Math.round(score));
}

function getKeywordSentiment(keyword, posts) {
  const keywordPosts = posts.filter(post => 
    post.keywords && post.keywords.includes(keyword)
  );
  
  if (keywordPosts.length === 0) return 'neutral';
  
  const avgScore = keywordPosts.reduce((sum, post) => 
    sum + (post.sentiment?.score || 0), 0) / keywordPosts.length;
  
  if (avgScore > 1) return 'positive';
  if (avgScore < -1) return 'negative';
  return 'neutral';
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diffMs = now - postTime;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return 'Just now';
}

export default router;