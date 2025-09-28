import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Globe, Filter } from 'lucide-react';

const SocialMediaFilters = ({ searchTerm, setSearchTerm, filter, setFilter, analyticsData, getPlatformIcon }) => {
    return (
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Filter className="w-5 h-5" />
                        <span>Filters</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search posts..."
                            className="pl-10"
                        />
                    </div>
                    <Select value={filter.platform} onValueChange={(value) => setFilter(prev => ({ ...prev, platform: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filter.sentiment} onValueChange={(value) => setFilter(prev => ({ ...prev, sentiment: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sentiment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sentiments</SelectItem>
                            <SelectItem value="positive">Positive</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                            <SelectItem value="negative">Negative</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filter.timeframe} onValueChange={(value) => setFilter(prev => ({ ...prev, timeframe: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 hours</SelectItem>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Globe className="w-5 h-5" />
                        <span>Platform Activity</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {Object.entries(analyticsData.platformBreakdown).map(([platform, count]) => (
                        <div key={platform} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-lg">{getPlatformIcon(platform)}</span>
                                <span className="font-medium capitalize">{platform}</span>
                            </div>
                            <span className="font-bold text-gray-900">{count}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default SocialMediaFilters;
