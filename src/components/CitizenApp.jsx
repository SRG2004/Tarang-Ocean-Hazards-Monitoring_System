import React, { useState } from 'react';
import { LayoutGrid, AlertTriangle, Bell, Users, User, LogOut, Waves } from 'lucide-react';
import { Button } from './ui/button';
import CitizenDashboard from './dashboards/CitizenDashboard';
import { ReportForm } from './ReportForm';
import { VolunteerRegistration } from './VolunteerRegistration';
import { UserProfile } from './UserProfile';

const AlertsView = () => <div className="p-6"><h2>Alerts</h2><p>No new alerts.</p></div>;

export const CitizenApp = ({ onRoleChange }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'report', label: 'Report Hazard', icon: AlertTriangle },
    { id: 'alerts', label: 'View Alerts', icon: Bell },
    { id: 'volunteer', label: 'Volunteer', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CitizenDashboard onNavigate={setActiveTab} />;
      case 'report':
        return <ReportForm />;
      case 'alerts':
        return <AlertsView />;
      case 'volunteer':
        return <VolunteerRegistration />;
      case 'profile':
        return <UserProfile />;
      default:
        return <CitizenDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background p-4 sm:flex">
        <div className="flex items-center gap-2 mb-6">
            <Waves className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">Tarang</h1>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className="justify-start"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="mt-auto">
            <Button variant="ghost" className="w-full justify-start" onClick={onRoleChange}>
                <LogOut className="mr-3 h-5 w-5" />
                Switch Role
            </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        {renderContent()}
        </main>
    </div>
  );
};
