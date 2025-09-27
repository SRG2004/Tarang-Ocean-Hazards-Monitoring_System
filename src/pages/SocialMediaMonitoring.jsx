import React, { useState, useEffect } from 'react';
import { socialMediaService } from '../services/socialMediaService';
import '../styles/globals.css';

const SocialMediaMonitoring = () => {
  const [tweets, setTweets] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const posts = await socialMediaService.getSocialMediaPosts();
        setTweets(posts);
        setError(null);
      } catch (err) {
        setError('Failed to fetch social media posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredTweets = tweets.filter(
    (tweet) =>
      (tweet.content && tweet.content.toLowerCase().includes(filter.toLowerCase())) ||
      (tweet.author && tweet.author.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Social Media Monitoring</h1>
        <p className="text-muted-foreground">Real-time feed from social channels.</p>
      </header>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by keyword or user..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input"
        />
      </div>

      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {filteredTweets.length > 0 ? (
            filteredTweets.map((tweet, index) => (
              <div key={tweet.id || index} className="card">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">@{tweet.author || 'Unknown User'}</span>
                  <span className="text-sm text-muted-foreground">
                    {tweet.timestamp ? new Date(tweet.timestamp).toLocaleString() : 'Just now'}
                  </span>
                </div>
                <p>{tweet.content}</p>
              </div>
            ))
          ) : (
            <p>No tweets match your filter.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialMediaMonitoring;
