import React from 'react';
import { Search, Filter, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import './AnalystDashboard.css'; // Assume CSS file exists or create if needed

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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4">
            {[
              { key: 'social', label: 'Social Intelligence', icon: BarChart3 },
              { key: 'trends', label: 'Trending Topics', icon: TrendingUp },
              { key: 'sentiment', label: 'Sentiment Analysis', icon: PieChart },
              { key: 'profile', label: 'Profile', icon: User }
            ].map((item) => (
              <button
                key={item.key}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  item.key === 'social'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } flex items-center space-x-2`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Social Posts</p>
                <p className="text-3xl font-bold text-gray-900">{socialStats.posts.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mentions</p>
                <p className="text-3xl font-bold text-green-600">{socialStats.mentions}</p>
              </div>
              <Search className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sentiment %</p>
                <p className="text-3xl font-bold text-purple-600">{socialStats.sentiment}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Topics</p>
                <p className="text-3xl font-bold text-orange-600">{socialStats.topics}</p>
              </div>
              <Filter className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trending Topics Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Trending Topics</span>
              </h3>
              <div className="flex items-center space-x-2">
                <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                  <option>All Platforms</option>
                  <option>Twitter</option>
                  <option>Facebook</option>
                </select>
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm w-48"
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

          {/* Sentiment Analysis Chart */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
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
        </div>

        {/* Social Posts Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Social Posts</h3>
            <p className="text-sm text-gray-600 mt-1">Monitor social media feeds and coastal conditions</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Recent Posts</h4>
                <div className="space-y-2 text-sm">
                  <p>"Heavy flooding at Marina Beach, need rescue teams" <span className="text-gray-500">• 2min ago</span></p>
                  <p>"Storm surge warning issued for Chennai coast" <span className="text-gray-500">• 5min ago</span></p>
                  <p>"High waves spotted near Elliot's Beach" <span className="text-gray-500">• 10min ago</span></p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Trending Hashtags</h4>
                <div className="space-y-1 text-sm">
                  <p>#ChennaiFloods <span className="text-gray-500">• 1.2K</span></p>
                  <p>#StormSurge <span className="text-gray-500">• 890</span></p>
                  <p>#CoastalAlert <span className="text-gray-500">• 650</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboard;
