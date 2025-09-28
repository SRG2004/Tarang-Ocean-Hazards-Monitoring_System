import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Eye } from 'lucide-react';
import SocialMediaPost from './SocialMediaPost';

const SocialMediaFeed = ({ loading, filteredPosts, getPlatformIcon, getSentimentColor, getRelevanceColor }) => {
    return (
        <div className="lg:col-span-3">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Live Social Feed</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            <span>Monitoring {filteredPosts.length} posts</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="flex space-x-4">
                                        <div className="w-12 h-12 bg-muted rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-muted rounded w-1/4"></div>
                                            <div className="h-4 bg-muted rounded w-3/4"></div>
                                            <div className="h-4 bg-muted rounded w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-[800px] overflow-y-auto">
                            {filteredPosts.map((post) => (
                                <SocialMediaPost
                                    key={post.id}
                                    post={post}
                                    getPlatformIcon={getPlatformIcon}
                                    getSentimentColor={getSentimentColor}
                                    getRelevanceColor={getRelevanceColor}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SocialMediaFeed;
