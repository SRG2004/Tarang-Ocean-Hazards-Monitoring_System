import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, ThumbsUp, ThumbsDown, Twitter, CheckCircle } from 'lucide-react';

export const SocialMediaMonitor = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/social-media/monitoring');
                if (!response.ok) {
                    throw new Error('Failed to fetch social media posts');
                }
                const data = await response.json();
                setPosts(data.posts);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleRelevance = async (postId, isRelevant) => {
        console.log(`Post ${postId} marked as ${isRelevant ? 'relevant' : 'dismissed'}`);
        // TODO: Add API call to backend to persist this information
        setPosts(posts.filter(p => p.id !== postId));
    };

    const filteredPosts = posts.filter(post =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.author && post.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Loading social media posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Social Media Monitoring</CardTitle>
                    <CardDescription>Monitor social media for hazard-related information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search keywords, users, or hashtags..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {filteredPosts.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No social media posts found.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post) => (
                        <Card key={post.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Twitter className="h-5 w-5 text-sky-500"/>
                                        <div>
                                            <p className="font-bold flex items-center">{post.author}</p>
                                            <p className="text-sm text-muted-foreground">@{post.platform}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm">{post.content}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                    <span>{post.timeAgo}</span>
                                    {post.engagement && (
                                        <div className="flex gap-2">
                                            <span>{post.engagement.likes || 0} Likes</span>
                                            <span>{post.engagement.shares || 0} Shares</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    {post.sentiment && <Badge variant={post.sentiment.label === 'negative' ? 'destructive' : (post.sentiment.label === 'neutral' ? 'secondary' : 'default')}>{post.sentiment.label}</Badge>}
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleRelevance(post.id, true)}><ThumbsUp className="h-4 w-4 mr-1"/>Relevant</Button>
                                        <Button variant="outline" size="sm" onClick={() => handleRelevance(post.id, false)}><ThumbsDown className="h-4 w-4 mr-1"/>Dismiss</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
