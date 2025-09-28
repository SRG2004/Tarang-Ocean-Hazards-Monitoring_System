import React, { useState, useEffect } from 'react';
import { realTimeHazardService } from '../../services/realTimeHazardService.js';
import { MinimalHazardMap } from '../MinimalHazardMap';
import SyntheticReportGenerator from '../SyntheticReportGenerator';
import { 
  BarChart3,
  TrendingUp,
  Activity,
  Eye,
  Globe,
  Users,
  Clock,
  FileText,
  MessageSquare
} from 'lucide-react';

export const AnalystDashboard = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [lastUpdate, setLastUpdate] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    const unsubscribe = realTimeHazardService.subscribe((newReports, hotspots) => {
      setReports(newReports);
      setStatistics(realTimeHazardService.getStatistics());
      setLastUpdate(new Date().toLocaleTimeString());
    });

    return unsubscribe;
  }, []);

  // Mock social media data for demonstration
  const socialMediaTrends = [
    { platform: 'Twitter', mentions: 247, sentiment: 0.3, trend: '+15%' },
    { platform: 'Facebook', mentions: 156, sentiment: 0.1, trend: '+8%' },
    { platform: 'Instagram', mentions: 89, sentiment: 0.6, trend: '+22%' },
    { platform: 'YouTube', mentions: 34, sentiment: 0.4, trend: '+5%' },
  ];

  const keyInsights = [
    {
      title: 'Cyclone Pattern Analysis',
      description: 'Seasonal cyclone frequency shows 23% increase compared to last year',
      priority: 'high',
      timeframe: '30 days'
    },
    {
      title: 'Coastal Erosion Trends',
      description: 'Gujarat coastline showing accelerated erosion rates in 3 districts',
      priority: 'medium',
      timeframe: '90 days'
    },
    {
      title: 'Public Response Effectiveness',
      description: 'Early warning system response time improved by 18%',
      priority: 'low',
      timeframe: '60 days'
    },
  ];

  const generateReport = (type) => {
    console.log(`Generating ${type} report...`);
    // Implementation for report generation
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Analytics Header */}
      <div className="bg-gradient-analyst gradient-shift mb-8 flex items-center px-6 py-6 rounded-2xl shadow-lg">
        <BarChart3 className="w-10 h-10 text-purple-600 mr-4" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Analytics & Insights</h1>
          <p className="text-slate-600">Analyze hazard data, trends, and generate actionable reports.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-analyst-stat-reports text-white stat-card card-hover-lift smooth-hover flex items-center gap-4 p-5 rounded-xl shadow">
          <FileText className="w-8 h-8 text-white/90" />
          <div>
            <div className="stat-number">{statistics.total || 0}</div>
            <div className="stat-label">Total Reports</div>
          </div>
        </div>
        <div className="bg-gradient-analyst-stat-pattern text-white stat-card card-hover-lift smooth-hover flex items-center gap-4 p-5 rounded-xl shadow">
          <TrendingUp className="w-8 h-8 text-white/90" />
          <div>
            <div className="stat-number">7</div>
            <div className="stat-label">Patterns Detected</div>
          </div>
        </div>
        <div className="bg-gradient-analyst-stat-social text-white stat-card card-hover-lift smooth-hover flex items-center gap-4 p-5 rounded-xl shadow">
          <Users className="w-8 h-8 text-white/90" />
          <div>
            <div className="stat-number">34</div>
            <div className="stat-label">Social Mentions</div>
          </div>
        </div>
        <div className="bg-gradient-analyst-stat-response text-white stat-card card-hover-lift smooth-hover flex items-center gap-4 p-5 rounded-xl shadow">
          <Clock className="w-8 h-8 text-white/90" />
          <div>
            <div className="stat-number">10m</div>
            <div className="stat-label">Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Quick Analysis Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button className="bg-gradient-analyst-action-trend action-card card-hover-lift smooth-hover text-white p-4 rounded-xl min-h-[48px]"
          onClick={() => generateReport('trend')}
        >
          <TrendingUp className="w-8 h-8 mb-2" />
          <span className="font-semibold text-lg">Generate Trend Report</span>
        </button>
        <button className="bg-gradient-analyst-action-prediction action-card card-hover-lift smooth-hover text-white p-4 rounded-xl min-h-[48px]"
          onClick={() => generateReport('prediction')}
        >
          <Eye className="w-8 h-8 mb-2" />
          <span className="font-semibold text-lg">Predictive Analysis</span>
        </button>
        <button className="bg-gradient-analyst-action-social action-card card-hover-lift smooth-hover text-white p-4 rounded-xl min-h-[48px]"
          onClick={() => generateReport('social')}
        >
          <MessageSquare className="w-8 h-8 mb-2" />
          <span className="font-semibold text-lg">Social Media Report</span>
        </button>
        <button className="bg-gradient-analyst-action-comparison action-card card-hover-lift smooth-hover text-white p-4 rounded-xl min-h-[48px]"
          onClick={() => generateReport('comparison')}
        >
          <Globe className="w-8 h-8 mb-2" />
          <span className="font-semibold text-lg">Comparative Analysis</span>
        </button>
      </div>

      {/* Section Containers */}
      <div className="bg-gradient-analyst gradient-shift p-6 rounded-xl shadow mb-8">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">Hazard Trends</h2>
        <div className="card-surface p-4 rounded-lg">
          {/* ...trend chart... */}
        </div>
      </div>
      <div className="bg-gradient-analyst gradient-shift p-6 rounded-xl shadow mb-8">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">Social Media Insights</h2>
        <div className="card-surface p-4 rounded-lg">
          {/* ...social media insights... */}
        </div>
      </div>
      <div className="bg-gradient-analyst gradient-shift p-6 rounded-xl shadow mb-8">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">Key Insights</h2>
        <div className="card-surface p-4 rounded-lg">
          {/* ...key insights... */}
        </div>
      </div>
      {/* Map Block */}
      <div className="bg-gradient-analyst gradient-shift mt-8 p-6 rounded-xl shadow">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">Analytics Map View</h2>
        <MinimalHazardMap height="320px" showControls={false} />
      </div>
      {/* Synthetic Report Generator */}
      <div className="bg-gradient-analyst gradient-shift mt-8 p-6 rounded-xl shadow">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">Synthetic Report Generator</h2>
        <SyntheticReportGenerator />
      </div>
    </div>
  );
};

