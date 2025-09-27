import axios from 'axios';

import { syntheticReportGenerator } from '../utils/syntheticReportGenerator.js';
import { syntheticReportDbService } from './syntheticReportDatabaseService.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const socialMediaService = {
  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Get social media posts directly from Firebase, bypassing the non-existent backend API
  async getSocialMediaPosts(filters = {}) {
    try {
      console.log("Fetching social media posts directly from Firebase...");
      // Using the syntheticReportDbService to fetch posts from Firestore
      const posts = await syntheticReportDbService.getSyntheticReports(filters);
      return posts;
    } catch (error) {
      console.error('Error fetching posts from Firebase, falling back to local simulated data:', error);
      // If Firebase fails, fallback to the original in-memory data
      return await this.fetchSimulatedSocialMediaData();
    }
  },

  // NOTE: The original API-dependent function is preserved below for future reference
  // when the backend API is implemented.
  async getSocialMediaPosts_API_Original(filters = {}) {
    try {
      const params = new URLSearchParams();
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
      return await this.fetchSimulatedSocialMediaData();
    }
  },

  async monitorTwitter() {
    const twitterBearerToken = import.meta.env.VITE_TWITTER_BEARER_TOKEN;

    if (!twitterBearerToken) {
      console.warn('Twitter bearer token not found. Skipping Twitter monitoring.');
      return [];
    }

    const query = `(
      tsunami OR cyclone OR "ocean hazard" OR "marine emergency" OR "coastal warning" OR "storm surge" OR flood OR monsoon OR "high tide"
    ) AND (
      India OR "Indian Ocean" OR "Bay of Bengal" OR "Arabian Sea" OR Mumbai OR Chennai OR Kolkata OR Kerala OR "Tamil Nadu" OR Odisha OR Gujarat
    ) -is:retweet`;

    try {
      const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
        headers: {
          Authorization: `Bearer ${twitterBearerToken}`,
        },
        params: {
          query,
          'tweet.fields': 'created_at,geo',
          expansions: 'author_id',
          'user.fields': 'name,username,profile_image_url,verified',
          max_results: 20,
        },
      });

      if (response.data && response.data.data) {
        const users = response.data.includes.users.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        return response.data.data.map(tweet => {
          const user = users[tweet.author_id] || {};
          return {
            platform: 'Twitter',
            author: user.name,
            username: user.username,
            content: tweet.text,
            timestamp: tweet.created_at,
            profileImageUrl: user.profile_image_url,
            verified: user.verified,
            engagement: {},
            geo: tweet.geo,
          };
        });
      }

      return [];
    } catch (error) {
      console.error('Error fetching tweets:', error);
      throw new Error('Failed to fetch tweets from Twitter API.');
    }
  },

  // ... (rest of the file remains the same) ...

  // Simulate social media data fetching
  async fetchSimulatedSocialMediaData() {
    const simulatedPosts = [
       {
        platform: '@NDRFHQ',
        author: 'NDRF',
        content: 'Massive flooding in Punjab. Over 1,400 villages inundated. Rescue operations are in full swing. Stay safe, follow evacuation orders. #PunjabFloods #Monsoon2025',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        engagement: { likes: 1200, shares: 800, comments: 250 },
        verified: true
      },
      // ... more simulated posts
    ];
    return simulatedPosts;
  },

  syntheticReports: {
    // ... (rest of the syntheticReports object is unchanged) ...
    async generateReports(count = 5, options = {}) {
      try {
        const posts = syntheticReportGenerator.generateMultiplePosts(count, options);
        // This function saves the generated posts to Firebase
        await syntheticReportDbService.saveMultipleSyntheticReports(posts);
        console.log(`✅ Generated and saved ${posts.length} synthetic reports to database`);
        return posts;

      } catch (error) {
        console.error('❌ Error generating synthetic reports:', error);
        throw error;
      }
    },
    // ...
  }
};

/**
 * Utility function to generate and save synthetic data to Firebase.
 * You can run this function from the browser's developer console.
 * Example: > await generateAndSaveSyntheticData(20)
 */
window.generateAndSaveSyntheticData = async (count = 15) => {
  try {
    console.log(`Generating and saving ${count} synthetic reports to Firebase...`);
    const reports = await socialMediaService.syntheticReports.generateReports(count);
    console.log(`Successfully generated and saved ${reports.length} reports to Firebase.`);
    // You might want to reload the page or trigger a state update in your app to see the new data
    window.location.reload(); 
    return reports;
  } catch (error) {
    console.error("Failed to generate and save synthetic data:", error);
  }
};
