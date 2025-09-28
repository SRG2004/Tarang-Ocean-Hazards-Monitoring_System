import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, Share, MessageSquare, ExternalLink, MapPin } from 'lucide-react';

const SocialMediaPost = ({ post, getPlatformIcon, getSentimentColor, getRelevanceColor }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-card-foreground">{post.author}</span>
                                {post.verified && (
                                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">✓</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>{new Date(post.timestamp).toLocaleString()}</span>
                                {post.location && (
                                    <>
                                        <span>•</span>
                                        <MapPin className="w-3 h-3" />
                                        <span>{post.location}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant={getSentimentColor(post.sentiment)}>{post.sentiment}</Badge>
                        <Badge variant={getRelevanceColor(post.relevanceScore)}>{post.relevanceScore}% relevant</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-card-foreground leading-relaxed">{post.content}</p>
                {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {post.hashtags.map((hashtag) => (
                            <span key={hashtag} className="text-primary text-sm font-medium">
                                #{hashtag}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex items-center justify-between text-muted-foreground text-sm">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.engagement.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Share className="w-4 h-4" />
                        <span>{post.engagement.shares}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.engagement.comments}</span>
                    </div>
                </div>
                <button className="flex items-center space-x-1 text-primary hover:text-primary/80 font-medium">
                    <ExternalLink className="w-4 h-4" />
                    <span>View Original</span>
                </button>
            </CardFooter>
        </Card>
    );
};

export default SocialMediaPost;
