import React, { useState, useEffect } from 'react';
import { realTimeHazardService } from '../../services/realTimeHazardService.js';
import { notificationService } from '../../services/notificationService.js';
import { MinimalHazardMap } from '../MinimalHazardMap';
import { 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  MapPin,
  Phone,
  FileText,
  Activity,
  TrendingUp,
  Shield,
  Radio,
  Truck,
  AlertCircle
} from 'lucide-react';

export const OfficialDashboard = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [lastUpdate, setLastUpdate] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const unsubscribe = realTimeHazardService.subscribe((newReports, hotspots) => {
      setReports(newReports);
      setStatistics(realTimeHazardService.getStatistics());
      
      // Filter active incidents that need attention
      const active = newReports.filter(report => 
        report.status === 'active' && 
        (report.severity === 'critical' || report.severity === 'high')
      );
      setActiveIncidents(active);
      setLastUpdate(new Date().toLocaleTimeString());
    });

    return unsubscribe;
  }, []);

  const resourceStatus = [
    { name: 'Coast Guard Vessels', available: 12, deployed: 3, status: 'operational' },
    { name: 'Emergency Teams', available: 8, deployed: 2, status: 'operational' },
    { name: 'Medical Units', available: 15, deployed: 1, status: 'operational' },
    { name: 'Evacuation Centers', available: 25, deployed: 0, status: 'standby' },
  ];

  const handleIncidentAction = (incident, action) => {
    console.log(`${action} action for incident:`, incident.id);
    // Implementation for incident actions
  };

  const handleSendAlert = async () => {
    if (alertMessage.trim() === '') return;

    try {
      await notificationService.sendHazardAlert({
        message: alertMessage,
        hazardType: 'general',
        severity: 'critical',
        location: user?.district || 'Mumbai Coastal',
      });
      setAlertMessage('');
    } catch (error) {
      console.error('Error sending alert:', error);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Command Header */}
      <div className="bg-gradient-official gradient-shift mb-8 flex items-center px-6 py-6 rounded-2xl shadow-lg">
        <Shield className="w-10 h-10 text-green-600 mr-4" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Operations Command Center</h1>
          <p className="text-slate-600">Manage incidents, coordinate response, and deploy resources.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-official-stat-active text-white stat-card card-hover-lift smooth-hover flex items-center gap-4 p-5 rounded-xl shadow">
          <AlertCircle className="w-8 h-8 text-white/90" />
          <div>
            <div className="stat-number">{statistics.active || 0}</div>
            <div className="stat-label">Active Incidents</div>
          </div>
        </div>
        <div className="bg-gradient-official-stat-critical text-white stat-card card-hover-lift smooth-hover flex items-center gap-4 p-5 rounded-xl shadow">
          <FileText className="w-8 h-8 text-white/90" />
          <div>
            <div className="stat-number">{statistics.critical || 0}</div>
            <div className="stat-label">Critical Alerts</div>
          </div>
        </div>
        <div className="bg-gradient-official-stat-resources text-white stat-card card-hover-lift smooth-hover flex items-center gap-4 p-5 rounded-xl shadow">
          <Truck className="w-8 h-8 text-white/90" />
          <div>
            <div className="stat-number">8</div>
            <div className="stat-label">Resources Deployed</div>
          </div>
        </div>
        <div className="bg-gradient-official-stat-response text-white stat-card card-hover-lift smooth-hover flex items-center gap-4 p-5 rounded-xl shadow">
          <Clock className="w-8 h-8 text-white/90" />
          <div>
            <div className="stat-number">15m</div>
            <div className="stat-label">Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button className="bg-gradient-official-action-alert action-card card-hover-lift smooth-hover text-white p-4 rounded-xl min-h-[48px]"
          onClick={() => handleSendAlert()}
        >
          <AlertCircle className="w-8 h-8 mb-2" />
          <span className="font-semibold text-lg">Issue Public Alert</span>
        </button>
        <button className="bg-gradient-official-action-contact action-card card-hover-lift smooth-hover text-white p-4 rounded-xl min-h-[48px]"
          onClick={() => console.log('Contact Field Teams')}
        >
          <Phone className="w-8 h-8 mb-2" />
          <span className="font-semibold text-lg">Contact Field Teams</span>
        </button>
        <button className="bg-gradient-official-action-deploy action-card card-hover-lift smooth-hover text-white p-4 rounded-xl min-h-[48px]"
          onClick={() => console.log('Deploy Resources')}
        >
          <Truck className="w-8 h-8 mb-2" />
          <span className="font-semibold text-lg">Deploy Resources</span>
        </button>
        <button className="bg-gradient-official-action-report action-card card-hover-lift smooth-hover text-white p-4 rounded-xl min-h-[48px]"
          onClick={() => console.log('Generate Report')}
        >
          <FileText className="w-8 h-8 mb-2" />
          <span className="font-semibold text-lg">Generate Report</span>
        </button>
      </div>

      {/* Section Containers */}
      <div className="bg-gradient-official gradient-shift p-6 rounded-xl shadow mb-8">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">Active Incidents</h2>
        <div className="card-surface p-4 rounded-lg">
          {/* Active Incidents List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activeIncidents.slice(0, 5).map((incident) => (
              <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{incident.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {incident.severity.toUpperCase()}
                      </span>
                      <span className="text-gray-500">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {incident.location.district}
                      </span>
                      <span className="text-gray-500">
                        {new Date(incident.reportedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleIncidentAction(incident, 'acknowledge')}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    Acknowledge
                  </button>
                  <button 
                    onClick={() => handleIncidentAction(incident, 'dispatch')}
                    className="btn-primary text-sm px-3 py-1"
                  >
                    Dispatch Team
                  </button>
                  <button 
                    onClick={() => handleIncidentAction(incident, 'escalate')}
                    className="btn-secondary text-sm px-3 py-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    Escalate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gradient-official gradient-shift p-6 rounded-xl shadow mb-8">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">Resource Status</h2>
        <div className="card-surface p-4 rounded-lg">
          {/* Resource Status */}
          <div className="space-y-4">
            {resourceStatus.map((resource, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    resource.status === 'operational' ? 'bg-green-100 text-green-800' :
                    resource.status === 'standby' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {resource.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex space-x-4">
                    <span className="text-green-600">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      {resource.available} Available
                    </span>
                    <span className="text-blue-600">
                      <Activity className="w-4 h-4 inline mr-1" />
                      {resource.deployed} Deployed
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gradient-official gradient-shift p-6 rounded-xl shadow mb-8">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">Communications</h2>
        <div className="card-surface p-4 rounded-lg">
          {/* Communications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-green-800">Coast Guard HQ</div>
                <div className="text-sm text-green-600">Online • Ready</div>
              </div>
              <button className="btn-primary bg-green-600 hover:bg-green-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-semibold text-blue-800">Field Team Alpha</div>
                <div className="text-sm text-blue-600">In transit • ETA 15m</div>
              </div>
              <button className="btn-primary bg-blue-600 hover:bg-blue-700">
                <Radio className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="font-semibold text-purple-800">State Control</div>
                <div className="text-sm text-purple-600">Standby • Monitoring</div>
              </div>
              <button className="btn-primary bg-purple-600 hover:bg-purple-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Map Block */}
      <div className="bg-gradient-official gradient-shift mt-8 p-6 rounded-xl shadow">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">Operations Map</h2>
        <MinimalHazardMap height="320px" showControls={false} />
      </div>
    </div>
  );
};
        {/* Communication Center */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Communications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-green-800">Coast Guard HQ</div>
                <div className="text-sm text-green-600">Online • Ready</div>
              </div>
              <button className="btn-primary bg-green-600 hover:bg-green-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-semibold text-blue-800">Field Team Alpha</div>
                <div className="text-sm text-blue-600">In transit • ETA 15m</div>
              </div>
              <button className="btn-primary bg-blue-600 hover:bg-blue-700">
                <Radio className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="font-semibold text-purple-800">State Control</div>
                <div className="text-sm text-purple-600">Standby • Monitoring</div>
              </div>
              <button className="btn-primary bg-purple-600 hover:bg-purple-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Situational Awareness */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Situational Awareness</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="font-semibold text-blue-800">Weather Update</div>
              <div className="text-sm text-blue-600 mt-1">
                Moderate winds expected. Sea conditions: Rough. Visibility: Good
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="font-semibold text-green-800">Traffic Status</div>
              <div className="text-sm text-green-600 mt-1">
                All evacuation routes clear. Emergency lanes available
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="font-semibold text-yellow-800">Public Readiness</div>
              <div className="text-sm text-yellow-600 mt-1">
                85% evacuation compliance. 3 shelter requests pending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operations Map */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Operations Map</h3>
          <button className="btn-secondary">Full Screen View</button>
        </div>
        <div className="h-96">
          <MinimalHazardMap height="384px" showControls={true} />
        </div>
      </div>
    </div>
  );
};
