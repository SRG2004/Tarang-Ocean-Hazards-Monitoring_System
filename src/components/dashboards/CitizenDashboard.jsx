import React, { useEffect, useState } from 'react';
import { AlertCircle, Map, Users, Phone, Heart, PlusCircle, Shield } from 'lucide-react';
import { realTimeHazardService } from '../../../services/realTimeHazardService';
import StatCard from './citizen/StatCard';
import ActionButton from './citizen/ActionButton';
import LocalSafetyInfo from './citizen/LocalSafetyInfo';
import EmergencyContacts from './citizen/EmergencyContacts';
import MapPreview from './citizen/MapPreview';
import WelcomeHeader from './citizen/WelcomeHeader';

export const CitizenDashboard = ({ onNavigate }) => {
  const [hazardStats, setHazardStats] = useState({ alerts: 0, reports: 0, community: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [nearbyAlerts, setNearbyAlerts] = useState([]);

  useEffect(() => {
    const processData = (reports) => {
        const stats = realTimeHazardService.getStatistics(reports);
        setHazardStats(prev => ({ ...prev, alerts: stats.active, reports: stats.today }));
        const userLocation = { lat: 17.385, lng: 78.486 }; // Mock user location
        const nearby = (reports || []).filter(r => {
            if (!r.location) return false;
            const dx = r.location.latitude - userLocation.lat;
            const dy = r.location.longitude - userLocation.lng;
            return Math.sqrt(dx * dx + dy * dy) < 0.5; // Crude distance
        });
        setNearbyAlerts(nearby);
        setRecentActivity((reports || []).slice(0, 3).map(r => ({
            description: r.title || "Hazard reported",
            time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
    }

    const { reports } = realTimeHazardService.getCurrentData();
    processData(reports);

    const unsubscribe = realTimeHazardService.subscribe((newReports, _newHotspots) => {
      processData(newReports);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="space-y-6 p-4 md:p-6 bg-background text-foreground">
        <WelcomeHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Active Alerts" value={hazardStats.alerts} icon={AlertCircle} bgColor="bg-red-500" iconColor="text-red-100" />
            <StatCard title="Reports Today" value={hazardStats.reports} icon={PlusCircle} bgColor="bg-blue-500" iconColor="text-blue-100" />
            <StatCard title="Volunteers" value={427} icon={Users} bgColor="bg-green-500" iconColor="text-green-100" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionButton title="Report Hazard" icon={AlertCircle} onClick={() => onNavigate?.('report')} description="Submit a new alert" />
            <ActionButton title="View Live Map" icon={Map} onClick={() => onNavigate?.('alerts')} description="See active hazards" />
            <ActionButton title="Volunteer" icon={Shield} onClick={() => onNavigate?.('volunteer')} description="Join the network" />
            <ActionButton title="Donate" icon={Heart} onClick={() => onNavigate?.('donate')} description="Support relief efforts" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LocalSafetyInfo nearbyAlerts={nearbyAlerts} recentActivity={recentActivity} />
            <EmergencyContacts />
        </div>

        <MapPreview />
    </div>
  );
}

export default CitizenDashboard;
