import React, { useState, useEffect } from 'react';
import { socialMediaService } from '../services/socialMediaService';

const SyntheticReportGenerator = () => {
  const [status, setStatus] = useState({});
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const fetchStatus = () => {
      const currentStatus = socialMediaService.syntheticReports.getStats();
      setStatus(currentStatus);
    };
    fetchStatus();
  }, []);

  const handleStart = () => {
    const id = socialMediaService.syntheticReports.startGeneration(5, 3);
    setIntervalId(id);
    setStatus(socialMediaService.syntheticReports.getStats());
  };

  const handleStop = () => {
    socialMediaService.syntheticReports.stopGeneration();
    setIntervalId(null);
    setStatus(socialMediaService.syntheticReports.getStats());
  };

  const handleGenerate = async () => {
    await socialMediaService.syntheticReports.generateReports(5);
    setStatus(socialMediaService.syntheticReports.getStats());
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Synthetic Report Generator</h3>
      <div className="space-y-4">
        <p>Status: {status.isGenerating ? 'Running' : 'Stopped'}</p>
        <p>Reports Generated: {status.reportCount}</p>
        <div className="flex space-x-2">
          <button onClick={handleStart} disabled={status.isGenerating} className="btn-primary">
            Start Generation
          </button>
          <button onClick={handleStop} disabled={!status.isGenerating} className="btn-secondary">
            Stop Generation
          </button>
          <button onClick={handleGenerate} className="btn-secondary">
            Generate 5 Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyntheticReportGenerator;
