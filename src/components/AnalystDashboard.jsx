import React from 'react';
import { Search, Filter, BarChart3, PieChart, TrendingUp, MessageCircle, Layout, FileText, Map as MapIcon, Bell, Database, Settings } from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import './AnalystDashboard.css';

const AnalystDashboard = () => {
  const socialStats = {
    posts: 3180000,
    mentions: 47,
    sentiment: 7.3,
    topics: 23
  };

  const trendingTopics = [
    { topic: 'Marina Beach flooding', mentions: 150, sentiment: 'Negative', platform: 'Twitter' },
    { topic: 'Storm surge Chennai', mentions: 120, sentiment: 'Neutral', platform: 'Facebook' },
    { topic: 'High waves alert', mentions: 95, sentiment: 'Negative', platform: 'Instagram' },
    { topic: 'Coastal safety tips', mentions: 80, sentiment: 'Positive', platform: 'Twitter' },
    { topic: 'Volunteer needed', mentions: 65, sentiment: 'Neutral', platform: 'Facebook' }
  ];

  const sentimentData = [
    { name: 'Positive', value: 35 },
    { name: 'Neutral', value: 45 },
    { name: 'Negative', value: 20 }
  ];

  const COLORS = ['#10B981', '#6B7280', '#EF4444']; // Green, Gray, Red

  const quickActions = [
    {
      title: "Social Media",
      description: "Monitor real-time conversations",
      icon: MessageCircle,
      onClick: () => {}, // Placeholder
      color: "text-blue-500"
    },
    {
      title: "My Dashboard",
      description: "Personalized overview",
      icon: Layout,
      onClick: () => {}, // Already on dashboard
      color: "text-gray-600"
    },
    {
      title: "Reports",
      description: "View and manage reports",
      icon: FileText,
      onClick: () => {}, // Placeholder
      color: "text-gray-600"
    },
    {
      title: "Map View",
      description: "Interactive hazard map",
      icon: MapIcon,
      onClick: () => {}, // Placeholder
      color: "text-gray-600"
    },
    {
      title: "Support & Alerts",
      description: "Notifications and help",
      icon: Bell,
      onClick: () => {}, // Placeholder
      color: "text-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-semibold text-gray-900">Tarang Analyst Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Analyst
              </button>
              <button className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyst Dashboard</h1>
          <p className="text-gray-600">Access insights, trends, and predictive models for ocean hazards</p>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center"
              onClick={action.onClick}
            >
              <action.icon className={`w-6 h-6 mb-2 ${action.color}`} />
              <h3 className="text-sm font-medium text-gray-900 mb-1">{action.title}</h3>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Social Posts</p>
                <p className="text-3xl font-bold text-gray-900">{socialStats.posts.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mentions</p>
                <p className="text-3xl font-bold text-green-600">{socialStats.mentions}</p>
              </div>
              <Search className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sentiment %</p>
                <p className="text-3xl font-bold text-blue-600">{socialStats.sentiment}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Topics</p>
                <p className="text-3xl font-bold text-gray-600">{socialStats.topics}</p>
              </div>
              <Filter className="h-8 w-8 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Main Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Topics Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Trending Topics</span>
              </h3>
              <div className="flex items-center space-x-2 text-sm">
                <select className="border border-gray-300 rounded-md px-2 py-1">
                  <option>All Platforms</option>
                  <option>Twitter</option>
                  <option>Facebook</option>
                </select>
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="border border-gray-300 rounded-md px-3 py-1 w-32"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trendingTopics.map((topic, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{topic.topic}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.mentions}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          topic.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                          topic.sentiment === 'Neutral' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {topic.sentiment}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.platform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sentiment Analysis Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Sentiment Analysis</span>
              </h3>
            </div>
            <div className="p-6 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Real-time Social Posts Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Real-time Social Posts</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Heavy flooding at Marina Beach, need rescue teams</span>
                  </div>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Storm surge warning issued for Chennai coast</span>
                  </div>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">High waves spotted near Elliot's Beach</span>
                  </div>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Settings Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Analytics Settings</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Real-time Monitoring</span>
                  <button className="text-blue-600 hover:underline text-sm">Configure</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Alert Thresholds</span>
                  <button className="text-blue-600 hover:underline text-sm">Set</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Data Sources</span>
                  <button className="text-blue-600 hover:underline text-sm">Manage</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Export Reports</span>
                  <button className="text-blue-600 hover:underline text-sm">Generate</button>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Hashtags Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 col-span-1 lg:col-span-2">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Trending Hashtags</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <h4 className="font-medium text-gray-900">#ChennaiFloods</h4>
                  <p className="text-2xl font-bold text-blue-600">1.2K</p>
                  <p className="text-xs text-gray-500">mentions</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <h4 className="font-medium text-gray-900">#StormSurge</h4>
                  <p className="text-2xl font-bold text-green-600">890</p>
                  <p className="text-xs text-gray-500">mentions</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <h4 className="font-medium text-gray-900">#CoastalAlert</h4>
                  <p className="text-2xl font-bold text-red-600">650</p>
                  <p className="text-xs text-gray-500">mentions</p>
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
