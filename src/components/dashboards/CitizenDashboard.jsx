import React, { useEffect, useState } from "react";
import { AlertCircle, Map, Users, Phone, Heart, PlusCircle, Shield, Waves } from "lucide-react";
import MinimalHazardMap from "../MinimalHazardMap";
import { realTimeHazardService } from "../../services/realTimeHazardService";

export default function CitizenDashboard({ onNavigate }) {
  const [hazardStats, setHazardStats] = useState({
    alerts: 0,
    reports: 0,
    contacts: 2,
    community: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [nearbyAlerts, setNearbyAlerts] = useState([]);

  useEffect(() => {
    // Subscribe to real-time hazard updates
    const unsubscribe = realTimeHazardService.subscribe((newReports, _newHotspots) => {
      const stats = realTimeHazardService.getStatistics();
      setHazardStats(prev => ({
        ...prev,
        alerts: stats.active,
        reports: stats.today
      }));
      // Compute nearby alerts from newReports (example: within 50km)
      const userLocation = { lat: 17.385, lng: 78.486 }; // TODO: get real user location
      const nearby = newReports.filter(r => {
        if (!r.location) return false;
        const dx = r.location.latitude - userLocation.lat;
        const dy = r.location.longitude - userLocation.lng;
        return Math.sqrt(dx * dx + dy * dy) < 0.5; // crude distance
      });
      setNearbyAlerts(nearby);
      setRecentActivity(newReports.slice(0, 5).map(r => ({
        description: r.title || "Hazard reported",
        time: r.time || "recent"
      })));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Initial load
    const { reports } = realTimeHazardService.getCurrentData();
    const stats = realTimeHazardService.getStatistics();
    setHazardStats(prev => ({ ...prev, alerts: stats.active, reports: stats.today }));
    // Derive nearby alerts
    const userLocation = { lat: 17.385, lng: 78.486 };
    const nearby = (reports || []).filter(r => {
      if (!r.location) return false;
      const dx = r.location.latitude - userLocation.lat;
      const dy = r.location.longitude - userLocation.lng;
      return Math.sqrt(dx * dx + dy * dy) < 0.5;
    });
    setNearbyAlerts(nearby);
    setRecentActivity((reports || []).slice(0, 5).map(r => ({
      description: r.title || "Hazard reported",
      time: r.time || "recent"
    })));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-muted pb-10">
      {/* Welcome Header */}
      <div className="gradient-card mb-8 flex items-center px-6 py-6 rounded-2xl shadow-lg bg-gradient-citizen">
        <Waves className="w-10 h-10 text-blue-400 mr-4" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome to Tarang Citizen Dashboard</h1>
          <p className="text-slate-600">Monitor ocean hazards, report incidents, and help your community stay safe.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card gradient-card flex items-center gap-4 p-5 rounded-xl shadow bg-gradient-stat-alert">
          <AlertCircle className="w-8 h-8 text-white/90" />
          <div>
            <div className="stat-number text-white">{hazardStats.alerts}</div>
            <div className="stat-label text-white/80">Active Alerts</div>
          </div>
        </div>
        <div className="stat-card gradient-card flex items-center gap-4 p-5 rounded-xl shadow bg-gradient-stat-report">
          <PlusCircle className="w-8 h-8 text-white/90" />
          <div>
            <div className="stat-number text-white">{hazardStats.reports}</div>
            <div className="stat-label text-white/80">Reports Today</div>
          </div>
        </div>
        <div className="stat-card gradient-card flex items-center gap-4 p-5 rounded-xl shadow bg-gradient-stat-contact">
          <Phone className="w-8 h-8 text-white/90" />
          <div>
            <div className="stat-number text-white">{hazardStats.contacts}</div>
            <div className="stat-label text-white/80">Emergency Contacts</div>
          </div>
        </div>
        <div className="stat-card gradient-card flex items-center gap-4 p-5 rounded-xl shadow bg-gradient-stat-community">
          <Users className="w-8 h-8 text-white/90" />
          <div>
            <div className="stat-number text-white">{hazardStats.community}</div>
            <div className="stat-label text-white/80">Community Members</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button className="action-card gradient-card card-hover-lift flex flex-col items-center justify-center p-6 rounded-xl shadow-lg smooth-hover bg-gradient-action-report"
          onClick={() => onNavigate?.('report')}
        >
          <AlertCircle className="w-10 h-10 text-white mb-2" />
          <span className="action-text text-white font-semibold text-lg">Report Ocean Hazard</span>
        </button>
        <button className="action-card gradient-card card-hover-lift flex flex-col items-center justify-center p-6 rounded-xl shadow-lg smooth-hover bg-gradient-action-map"
          onClick={() => onNavigate?.('alerts')}
        >
          <Map className="w-10 h-10 text-white mb-2" />
          <span className="action-text text-white font-semibold text-lg">View Hazard Map</span>
        </button>
        <button className="action-card gradient-card card-hover-lift flex flex-col items-center justify-center p-6 rounded-xl shadow-lg smooth-hover bg-gradient-action-volunteer"
          onClick={() => onNavigate?.('volunteer')}
        >
          <Shield className="w-10 h-10 text-white mb-2" />
          <span className="action-text text-white font-semibold text-lg">Join as Volunteer</span>
        </button>
        <button className="action-card gradient-card card-hover-lift flex flex-col items-center justify-center p-6 rounded-xl shadow-lg smooth-hover bg-gradient-action-support"
          onClick={() => onNavigate?.('volunteer')}
        >
          <Heart className="w-10 h-10 text-white mb-2" />
          <span className="action-text text-white font-semibold text-lg">Support Relief Efforts</span>
        </button>
      </div>

      {/* Nearby Alerts Banner */}
      {nearbyAlerts.length > 0 && (
        <div className="gradient-card mb-8 px-6 py-4 rounded-xl shadow bg-gradient-stat-alert">
          <AlertCircle className="w-6 h-6 text-white mr-2 inline" />
          <span className="text-white font-semibold">Nearby Alerts:</span>
          <span className="text-white/80 ml-2">{nearbyAlerts.map(a => a.title).join(", ")}</span>
        </div>
      )}

      {/* Recent Activity & Emergency Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="gradient-card p-6 rounded-xl shadow bg-gradient-citizen">
          <h2 className="font-semibold text-lg text-slate-800 mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <li key={idx} className="flex items-center gap-3 p-3 rounded-lg card-hover-lift smooth-hover" style={{ background: "rgba(255,255,255,0.08)" }}>
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-slate-700">{activity.description}</span>
                <span className="ml-auto text-xs text-slate-400">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="gradient-card p-6 rounded-xl shadow bg-gradient-stat-contact">
          <h2 className="font-semibold text-lg text-white mb-4">Emergency Contacts</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 p-3 rounded-lg card-hover-lift smooth-hover" style={{ background: "rgba(255,255,255,0.08)" }}>
              <Phone className="w-5 h-5 text-green-400" />
              <span className="text-white">Coast Guard: 1554</span>
              <span className="ml-auto text-xs text-white/80">24/7</span>
            </li>
            <li className="flex items-center gap-3 p-3 rounded-lg card-hover-lift smooth-hover" style={{ background: "rgba(255,255,255,0.08)" }}>
              <Phone className="w-5 h-5 text-green-400" />
              <span className="text-white">Disaster Helpline: 108</span>
              <span className="ml-auto text-xs text-white/80">24/7</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Map Preview */}
      <div className="gradient-card mt-8 p-6 rounded-xl shadow bg-gradient-action-map">
        <h2 className="font-semibold text-lg text-white mb-4">Hazard Map Preview</h2>
        <MinimalHazardMap height="320px" showControls={false} />
      </div>
    </div>
  );
}
}
                  <p className="text-gray-900 text-sm font-medium">{item.event}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 text-sm font-medium hover:text-blue-700">
            View All Activity
          </button>
        </div>

        {/* Emergency Contacts */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Emergency Contacts</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <div className="font-semibold text-red-800">Coast Guard</div>
                <div className="text-sm text-red-600">Emergency Response</div>
              </div>
              <button className="btn-primary bg-red-600 hover:bg-red-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-semibold text-blue-800">Disaster Management</div>
                <div className="text-sm text-blue-600">State Authority</div>
              </div>
              <button className="btn-primary bg-blue-600 hover:bg-blue-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-green-800">Local Police</div>
                <div className="text-sm text-green-600">Area Station</div>
              </div>
              <button className="btn-primary bg-green-600 hover:bg-green-700">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hazard Map Preview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Nearby Hazards</h3>
          <button className="btn-secondary">View Full Map</button>
        </div>
        <div className="h-80">
          <MinimalHazardMap height="320px" showControls={false} />
        </div>
      </div>
    </div>
  );
};
