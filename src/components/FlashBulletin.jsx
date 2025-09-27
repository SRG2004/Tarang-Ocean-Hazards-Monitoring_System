import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FlashBulletin = () => {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBulletinIndex, setCurrentBulletinIndex] = useState(0);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  // Fetch flash bulletins
  const fetchBulletins = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notifications/flash-bulletins');
      setBulletins(response.data.bulletins || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching flash bulletins:', err);
      setError('Failed to load safety bulletins');
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll through bulletins
  useEffect(() => {
    if (bulletins.length <= 1 || !isAutoScrollEnabled) return;

    const interval = setInterval(() => {
      setCurrentBulletinIndex((prev) => (prev + 1) % bulletins.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [bulletins.length, isAutoScrollEnabled]);

  // Fetch bulletins on component mount and refresh every 2 minutes
  useEffect(() => {
    fetchBulletins();
    
    const refreshInterval = setInterval(fetchBulletins, 2 * 60 * 1000); // Refresh every 2 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <div className="animate-pulse">
          <div className="inline-block text-2xl">🌊</div>
          <span className="ml-2">Loading safety bulletins...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && bulletins.length === 0) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
        <div className="flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
          <span className="ml-2">Unable to load safety bulletins</span>
          <button onClick={fetchBulletins} className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No bulletins available
  if (bulletins.length === 0) {
    return null; // Don't render if no bulletins
  }

  const currentBulletin = bulletins[currentBulletinIndex];

  const handlePrevious = () => {
    setIsAutoScrollEnabled(false);
    setCurrentBulletinIndex((prev) => 
      prev === 0 ? bulletins.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setIsAutoScrollEnabled(false);
    setCurrentBulletinIndex((prev) => (prev + 1) % bulletins.length);
  };

  const handleDotClick = (index) => {
    setIsAutoScrollEnabled(false);
    setCurrentBulletinIndex(index);
  };

  return (
    <div className={`p-4 rounded-lg shadow-md border-l-4 ${currentBulletin.color}`}>
      <div className="flex items-start">
        {/* Header */}
        <div className="flex-shrink-0 text-3xl mr-4">{currentBulletin.icon}</div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{currentBulletin.title}</h3>
              <span className="text-sm text-gray-600">{currentBulletin.affectedAreas}</span>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${currentBulletin.severity}`}>
              {currentBulletin.severity.toUpperCase()}
            </span>
          </div>

          {/* Message */}
          <p className="text-sm mt-2">{currentBulletin.message}</p>

          {/* Action Items */}
          {currentBulletin.actionItems && currentBulletin.actionItems.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-semibold">Safety Guidelines:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {currentBulletin.actionItems.slice(0, 3).map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="text-xs text-gray-500 mt-3 flex justify-between">
            <div>Last updated: {new Date(currentBulletin.timestamp).toLocaleTimeString()}</div>
            <div>Valid until: {new Date(currentBulletin.expiresAt).toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      {bulletins.length > 1 && (
        <div className="flex justify-center items-center mt-3">
          <button 
            className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={handlePrevious}
            aria-label="Previous bulletin"
          >
            ‹
          </button>
          
          <div className="flex mx-2">
            {bulletins.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${index === currentBulletinIndex ? 'bg-gray-800' : 'bg-gray-400'}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to bulletin ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={handleNext}
            aria-label="Next bulletin"
          >
            ›
          </button>
        </div>
      )}

      {/* Auto-scroll indicator */}
      {bulletins.length > 1 && isAutoScrollEnabled && (
        <div className="h-1 bg-gray-200 mt-2 rounded-full overflow-hidden">
          <div className="h-1 bg-blue-500 animate-pulse" style={{ width: '100%' }}></div>
        </div>
      )}
    </div>
  );
};

export default FlashBulletin;
