export const getPlatformIcon = (platform) => {
    const icons = {
        twitter: '𝕏',
        facebook: '📘',
        instagram: '📷',
        youtube: '📺'
    };
    return icons[platform] || '🌐';
};

export const getSentimentColor = (sentiment) => {
    switch (sentiment) {
        case 'positive': return 'success';
        case 'negative': return 'destructive';
        default: return 'secondary';
    }
};

export const getRelevanceColor = (score) => {
    if (score >= 90) return 'destructive';
    if (score >= 70) return 'warning';
    if (score >= 50) return 'secondary';
    return 'outline';
};
