import React, { useState } from 'react';
import { LayoutGrid, ShieldCheck, Siren, BarChart2, LogOut, Waves } from 'lucide-react';
import { Button } from './ui/button';
import { OfficialDashboard } from './dashboards/OfficialDashboard';

const VerifyReports = () => <div className="p-6"><h2>Verify Reports</h2><p>No pending reports to verify.</p></div>;
const EmergencyResponse = () => <div className="p-6"><h2>Emergency Response</h2><p>No active incidents.</p></div>;
const Analytics = () => <div className="p-6"><h2>Analytics</h2><p>Analytics dashboard is loading...</p></div>;

export const OfficialApp = ({ onRoleChange }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'verify', label: 'Verify Reports', icon: ShieldCheck },
    { id: 'emergency', label: 'Emergency Response', icon: Siren },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OfficialDashboard />;
      case 'verify':
        return <VerifyReports />;
      case 'emergency':
        return <EmergencyResponse />;
      case 'analytics':
        return <Analytics />;
      default:
        return <OfficialDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-muted/40">
      <aside className="nav-surface nav-surface--official text-white w-64 flex flex-col min-h-screen">
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
