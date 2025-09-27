import React, { useState, useEffect } from 'react';
import { realTimeHazardService } from '../../services/realTimeHazardService.js';
import { MinimalHazardMap } from '../MinimalHazardMap';
import { 
  Settings,
  Users,
  Shield,
  BarChart3,
  Activity,
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  UserCheck,
  UserX,
  HardDrive,
  Wifi,
  Lock,
  Eye,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [lastUpdate, setLastUpdate] = useState('');
  const [systemHealth, setSystemHealth] = useState({
    api: 'healthy',
    database: 'healthy', 
    storage: 'healthy',
    monitoring: 'healthy'
  });

  useEffect(() => {
    const unsubscribe = realTimeHazardService.subscribe((newReports, hotspots) => {
      setReports(newReports);
      setStatistics(realTimeHazardService.getStatistics());
      setLastUpdate(new Date().toLocaleTimeString());
    });

    return unsubscribe;
  }, []);

  // Mock data for demonstration
  const userStatistics = {
    total: 15847,
    active: 12456,
    new_today: 23,
    citizens: 14230,
    officials: 1245,
    analysts: 287,
    admins: 85
  };

  const systemMetrics = {
    uptime: '99.97%',
    response_time: '145ms',
    cpu_usage: '23%',
    memory_usage: '67%',
    storage_usage: '34%',
    daily_requests: '2.4M'
  };

  const securityAlerts = [
    { 
      time: '10 min ago', 
      event: 'Multiple failed login attempts detected', 
      severity: 'medium',
      action: 'Auto-blocked IP for 1 hour'
    },
    { 
      time: '2 hours ago', 
      event: 'Unusual API request pattern from citizen app', 
      severity: 'low',
      action: 'Monitoring increased'
    },
    { 
      time: '1 day ago', 
      event: 'Database backup completed successfully', 
      severity: 'info',
      action: 'Routine maintenance'
    },
  ];

  const handleSystemAction = (action) => {
    console.log(`Executing system action: ${action}`);
    // Implementation for system actions
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Administration Center</h1>
            <p className="text-gray-600 mt-2">Complete system oversight and management for Taranga Ocean Monitor</p>
            <div className="flex items-center space-x-2 mt-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">All Systems Operational</span>
              <span className="text-sm text-gray-500">• Last health check {lastUpdate}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Admin Level</div>
            <div className="text-lg font-semibold text-gray-900">Super Administrator</div>
            <div className="text-sm text-gray-600">Full System Access</div>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              systemHealth.api === 'healthy' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium">API Services</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              systemHealth.database === 'healthy' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium">Database</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              systemHealth.storage === 'healthy' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium">Storage</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              systemHealth.monitoring === 'healthy' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium">Monitoring</span>
          </div>
        </div>
      </div>

      {/* Key System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">System Uptime</h3>
            <Server className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{systemMetrics.uptime}</div>
          <p className="text-gray-500 text-sm">Last 30 days</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Active Users</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{userStatistics.active.toLocaleString()}</div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <p className="text-green-600 text-sm">+{userStatistics.new_today} today</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Response Time</h3>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">{systemMetrics.response_time}</div>
          <p className="text-gray-500 text-sm">Average API response</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Daily Requests</h3>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">{systemMetrics.daily_requests}</div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <p className="text-green-600 text-sm">+8% from yesterday</p>
          </div>
        </div>
      </div>

      {/* Main Admin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
            <button className="btn-secondary">Manage All</button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userStatistics.citizens.toLocaleString()}</div>
                <div className="text-sm text-blue-800">Citizens</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{userStatistics.officials.toLocaleString()}</div>
                <div className="text-sm text-green-800">Officials</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{userStatistics.analysts}</div>
                <div className="text-sm text-purple-800">Analysts</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{userStatistics.admins}</div>
                <div className="text-sm text-orange-800">Admins</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="btn-primary flex-1 flex items-center justify-center space-x-2">
                <UserCheck className="w-4 h-4" />
                <span>Approve Users</span>
              </button>
              <button className="btn-secondary flex-1 flex items-center justify-center space-x-2">
                <UserX className="w-4 h-4" />
                <span>Review Flagged</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Monitoring */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Security Alerts</h3>
            <button className="btn-secondary">Security Center</button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {securityAlerts.map((alert, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.severity === 'medium' ? 'bg-orange-500' :
                      alert.severity === 'low' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <span className="font-medium text-gray-900 text-sm">{alert.event}</span>
                  </div>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <p className="text-xs text-gray-600">{alert.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Performance */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">System Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-sm font-medium text-gray-900">{systemMetrics.cpu_usage}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: systemMetrics.cpu_usage }}></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm font-medium text-gray-900">{systemMetrics.memory_usage}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: systemMetrics.memory_usage }}></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage Usage</span>
              <span className="text-sm font-medium text-gray-900">{systemMetrics.storage_usage}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: systemMetrics.storage_usage }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Operations */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">System Operations</h3>
          <div className="space-y-3">
            <button 
              onClick={() => handleSystemAction('backup')}
              className="w-full btn-primary flex items-center justify-center space-x-3 py-3"
            >
              <Download className="w-5 h-5" />
              <span>Backup System</span>
            </button>
            <button 
              onClick={() => handleSystemAction('update')}
              className="w-full btn-secondary flex items-center justify-center space-x-3 py-3"
            >
              <RefreshCw className="w-5 h-5" />
              <span>System Update</span>
            </button>
            <button 
              onClick={() => handleSystemAction('maintenance')}
              className="w-full btn-secondary flex items-center justify-center space-x-3 py-3"
            >
              <Settings className="w-5 h-5" />
              <span>Maintenance Mode</span>
            </button>
            <button 
              onClick={() => handleSystemAction('logs')}
              className="w-full btn-secondary flex items-center justify-center space-x-3 py-3"
            >
              <Eye className="w-5 h-5" />
              <span>View System Logs</span>
            </button>
          </div>
        </div>

        {/* Database Management */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Database Management</h3>
          <div className="space-y-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-green-800">Production DB</div>
                  <div className="text-sm text-green-600">Healthy • Auto-backup enabled</div>
                </div>
                <Database className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-blue-800">Analytics DB</div>
                  <div className="text-sm text-blue-600">Synced • Real-time processing</div>
                </div>
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="btn-secondary flex-1 text-sm">Optimize</button>
              <button className="btn-secondary flex-1 text-sm">Monitor</button>
            </div>
          </div>
        </div>

        {/* Security Center */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Center</h3>
          <div className="space-y-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-green-800">SSL Certificate</div>
                  <div className="text-sm text-green-600">Valid • Expires in 87 days</div>
                </div>
                <Lock className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-blue-800">API Security</div>
                  <div className="text-sm text-blue-600">Rate limiting active</div>
                </div>
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="btn-secondary flex-1 text-sm">Audit</button>
              <button className="btn-secondary flex-1 text-sm">Policies</button>
            </div>
          </div>
        </div>
      </div>

      {/* System Overview Map */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">System Coverage Map</h3>
          <div className="flex space-x-2">
            <button className="btn-secondary">Infrastructure View</button>
            <button className="btn-secondary">Usage Analytics</button>
          </div>
        </div>
        <div className="h-96">
          <MinimalHazardMap height="384px" showControls={true} />
        </div>
      </div>
    </div>
  );
};
