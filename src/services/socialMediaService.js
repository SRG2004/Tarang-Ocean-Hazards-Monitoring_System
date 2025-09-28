export const mockPosts = [
    {
        id: '1',
        platform: 'twitter',
        author: '@MumbaiWeather',
        content: 'High tide alert! Coastal areas experiencing unusual wave patterns. Marine Drive witnessing higher than normal waves. Authorities advising caution for beachgoers. #MumbaiTide #CoastalAlert #SafetyFirst',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        engagement: { likes: 234, shares: 89, comments: 45 },
        sentiment: 'negative',
        relevanceScore: 95,
        location: 'Mumbai, Maharashtra',
        verified: true,
        hashtags: ['MumbaiTide', 'CoastalAlert', 'SafetyFirst'],
        mentions: []
    },
    {
        id: '2',
        platform: 'facebook',
        author: 'Gujarat Coast Guard',
        content: 'Coast Guard vessels on high alert following reports of unusual sea conditions off Dwarka coast. All fishing vessels advised to return to nearest harbor immediately. Weather department monitoring situation closely.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        engagement: { likes: 156, shares: 234, comments: 67 },
        sentiment: 'neutral',
        relevanceScore: 92,
        location: 'Dwarka, Gujarat',
        verified: true,
        hashtags: [],
        mentions: ['GujaratCoastGuard']
    },
    {
        id: '3',
        platform: 'instagram',
        author: '@chennai_beaches',
        content: 'Beautiful morning at Marina Beach! Crystal clear waters and gentle waves. Perfect weather for a beach walk. Thanks to @chennai_corporation for keeping our beaches clean! 🌊☀️ #ChennaiBeaches #MarinaBech #BeachLife',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        engagement: { likes: 567, shares: 23, comments: 89 },
        sentiment: 'positive',
        relevanceScore: 45,
        location: 'Chennai, Tamil Nadu',
        verified: false,
        hashtags: ['ChennaiBeaches', 'MarinaBech', 'BeachLife'],
        mentions: ['chennai_corporation']
    },
    {
        id: '4',
        platform: 'twitter',
        author: '@KeralaAlerts',
        content: '⚠️ CYCLONE WATCH: Meteorological department issues cyclone alert for Kerala coast. Expected to intensify over next 48 hours. Fishermen advised against venturing into sea. Emergency helplines activated. Stay safe! #CycloneAlert #KeralaWeather',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        engagement: { likes: 445, shares: 678, comments: 123 },
        sentiment: 'negative',
        relevanceScore: 98,
        location: 'Kerala',
        verified: true,
        hashtags: ['CycloneAlert', 'KeralaWeather'],
        mentions: []
    },
    {
        id: '5',
        platform: 'youtube',
        author: 'Indian Ocean Research',
        content: 'New study reveals changing ocean current patterns in the Arabian Sea. Our latest research shows significant shifts that could affect monsoon patterns and coastal ecosystems. Watch our detailed analysis.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        engagement: { likes: 1234, shares: 156, comments: 89 },
        sentiment: 'neutral',
        relevanceScore: 87,
        location: 'Pan-India',
        verified: true,
        hashtags: ['OceanResearch', 'ArabianSea', 'ClimateChange'],
        mentions: []
    }
];

export const generateNewPosts = (existingPosts) => {
    return existingPosts.map((post, index) => ({
        ...post,
        id: `refresh_${Date.now()}_${index}`,
        timestamp: new Date(Date.now() - Math.random() * 3600000), // Random timestamp within last hour
        engagement: {
            likes: Math.floor(Math.random() * 1000) + post.engagement.likes,
            shares: Math.floor(Math.random() * 500) + post.engagement.shares,
            comments: Math.floor(Math.random() * 200) + post.engagement.comments
        }
    }));
};
