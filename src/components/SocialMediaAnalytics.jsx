import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { BarChart3, TrendingUp, AlertTriangle, MessageSquare, Users } from 'lucide-react';

const SocialMediaAnalytics = ({ analyticsData, filteredPosts }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.totalPosts}</div>
                    <p className="text-xs text-muted-foreground">in the last 24 hours</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{analyticsData.highRelevance}</div>
                    <p className="text-xs text-muted-foreground">posts need attention</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sentiment</CardTitle>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        <span className="text-green-500">{analyticsData.sentimentBreakdown.positive}</span> / {' '}
                        <span className="text-red-500">{analyticsData.sentimentBreakdown.negative}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Positive vs Negative</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {filteredPosts.reduce((acc, post) => acc + post.engagement.likes + post.engagement.shares, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Likes and shares</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SocialMediaAnalytics;
