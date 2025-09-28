import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { TrendingUp, Filter, Search, MessageCircle, User, Settings, AlertCircle } from 'lucide-react';
import Navbar from './Navbar';

const AnalystDashboard = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  // Mock data matching screenshot
  const stats = [
    { label: 'Social Posts', value: '3.2K', icon: MessageCircle, color: 'text-primary' },
    { label: 'High Risk', value: 47, icon: AlertCircle, color: 'text-danger' },
    { label: 'Engagement', value: '7.3%', icon: User, color: 'text-success' },
    { label: 'Active Hashtags', value: 23, icon: TrendingUp, color: 'text-warning' }
  ];

  const trendingTopics = [
    { topic: 'Marina Beach flooding', mentions: 150, sentiment: 'Negative', platform: 'Twitter' },
    { topic: 'Storm surge Chennai', mentions: 120, sentiment: 'Neutral', platform: 'Facebook' },
    { topic: 'High waves alert', mentions: 95, sentiment: 'Negative', platform: 'Instagram' },
    { topic: 'Coastal safety tips', mentions: 80, sentiment: 'Positive', platform: 'Twitter' },
    { topic: 'Volunteer needed', mentions: 65, sentiment: 'Neutral', platform: 'Facebook' }
  ];

  const realTimePosts = [
    { content: 'Heavy flooding at Marina Beach, need rescue teams urgently!', time: '2 minutes ago', sentiment: 'Negative' },
    { content: 'Storm surge warning issued for Chennai coast. Stay safe!', time: '5 minutes ago', sentiment: 'Neutral' },
    { content: 'High waves spotted near Elliot\'s Beach. Caution advised.', time: '10 minutes ago', sentiment: 'Negative' }
  ];

  const handleFilterChange = (key, value) => {
    console.log(`Filter ${key}: ${value}`);
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Social Intelligence */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="card p-4">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex-1 min-w-[120px]">
                  <label className="text-xs font-medium text-text-secondary mb-1 block">Social Media</label>
                  <select 
                    onChange={(e) => handleFilterChange('socialMedia', e.target.value)}
                    className="input text-sm w-full"
                  >
                    <option>All Platforms</option>
                    <option>Twitter</option>
                    <option>Facebook</option>
                    <option>Instagram</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="text-xs font-medium text-text-secondary mb-1 block">Region</label>
                  <select 
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                    className="input text-sm w-full"
                  >
                    <option>All Regions</option>
                    <option>Chennai</option>
                    <option>Pondicherry</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="text-xs font-medium text-text-secondary mb-1 block">Time Range</label>
                  <select 
                    onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                    className="input text-sm w-full"
                  >
                    <option>24 Hours</option>
                    <option>7 Days</option>
                    <option>30 Days</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="text-xs font-medium text-text-secondary mb-1 block">Sentiment</label>
                  <select 
                    onChange={(e) => handleFilterChange('sentiment', e.target.value)}
                    className="input text-sm w-full"
                  >
                    <option>All</option>
                    <option>Positive</option>
                    <option>Neutral</option>
                    <option>Negative</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Trending Topics Table */}
            <div className="card">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Trending Topics</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Topic</th>
                      <th>Mentions</th>
                      <th>Sentiment</th>
                      <th>Platform</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendingTopics.map((topic, index) => (
                      <tr key={index}>
                        <td className="font-medium">{topic.topic}</td>
                        <td>{topic.mentions}</td>
                        <td>
                          <span className={`badge ${topic.sentiment === 'Positive' ? 'badge-success' : topic.sentiment === 'Neutral' ? 'badge-warning' : 'badge-danger'}`}>
                            {topic.sentiment}
                          </span>
                        </td>
                        <td>{topic.platform}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Real-time Posts */}
            <div className="card">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Real-time Posts</span>
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {realTimePosts.map((post, index) => (
                  <div key={index} className="bg-secondary/50 p-3 rounded-lg">
                    <p className="text-sm text-text-primary mb-1">{post.content}</p>
                    <p className="text-xs text-text-secondary">{post.time}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      post.sentiment === 'Negative' ? 'bg-danger text-white' : 'bg-success text-white'
                    }`}>
                      {post.sentiment}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="card">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-text-primary">Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Privacy</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Data Export</span>
                  <button className="text-primary hover:underline text-sm">Export</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalystDashboard;
