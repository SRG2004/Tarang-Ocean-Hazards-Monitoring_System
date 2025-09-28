import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import SocialMediaAnalytics from './SocialMediaAnalytics';
import SocialMediaFilters from './SocialMediaFilters';
import SocialMediaFeed from './SocialMediaFeed';
import { mockPosts, generateNewPosts } from '../services/socialMediaService';
import { getPlatformIcon, getSentimentColor, getRelevanceColor } from '../utils/socialMediaUtils';

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

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const filteredMockPosts = mockPosts.filter(post => {
                if (filter.platform !== 'all' && post.platform !== filter.platform) return false;
                if (filter.sentiment !== 'all' && post.sentiment !== filter.sentiment) return false;
                let hours = 24;
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
            const newPosts = generateNewPosts(mockPosts);
            setPosts(newPosts);
            setIsRefreshing(false);
        }, 1000);
    };

    const filteredPosts = posts.filter(post => {
        if (filter.platform !== 'all' && post.platform !== filter.platform) return false;
        if (filter.sentiment !== 'all' && post.sentiment !== filter.sentiment) return false;
        if (searchTerm && !post.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

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
            <DashboardHeader 
                title="Social Media Monitoring"
                subtitle="Real-time social media intelligence for ocean hazard detection"
            />

            <SocialMediaAnalytics analyticsData={analyticsData} filteredPosts={filteredPosts} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <SocialMediaFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filter={filter}
                    setFilter={setFilter}
                    analyticsData={analyticsData}
                    getPlatformIcon={getPlatformIcon}
                />
                <SocialMediaFeed
                    loading={loading}
                    filteredPosts={filteredPosts}
                    getPlatformIcon={getPlatformIcon}
                    getSentimentColor={getSentimentColor}
                    getRelevanceColor={getRelevanceColor}
                />
            </div>
        </div>
    );
};
