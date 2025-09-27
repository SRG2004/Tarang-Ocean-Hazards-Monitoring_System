import React, { useState } from 'react';
import { LayoutGrid, BarChart, FileText, Share2, Activity, LogOut, Download, Waves } from 'lucide-react';
import { AnalystDashboard } from './dashboards/AnalystDashboard';
import { SocialMediaMonitor } from './SocialMediaMonitor';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

// Placeholder for Reports section
const Reports = () => (
    <Card>
        <CardHeader>
            <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Generate and view system reports.</p>
            <div className="mt-4 flex gap-4">
                <Button><Download className="mr-2 h-4 w-4" /> Export Hazard Data</Button>
                <Button variant="outline">Generate Monthly Summary</Button>
            </div>
        </CardContent>
    </Card>
);

// Placeholder for Data Analysis section
const DataAnalysis = () => {
    const data = [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 600 },
        { name: 'Apr', value: 800 },
        { name: 'May', value: 500 },
    ];
    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Interactive data analysis and trend visualization.</p>
                <div className="h-96 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#030213" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

// Placeholder for System Health section
const SystemHealth = () => (
    <Card>
        <CardHeader>
            <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Monitor system performance and metrics.</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">99.9%</div>
                        <p className="text-xs text-muted-foreground">in the last 30 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">120ms</div>
                        <p className="text-xs text-muted-foreground">Average API response</p>
                    </CardContent>
                </Card>
            </div>
        </CardContent>
    </Card>
);

export const AnalystApp = ({ onRoleChange }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'analysis', label: 'Data Analysis', icon: BarChart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'social', label: 'Social Monitoring', icon: Share2 },
    { id: 'health', label: 'System Health', icon: Activity },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AnalystDashboard />;
      case 'analysis':
        return <DataAnalysis />;
      case 'reports':
        return <Reports />;
      case 'social':
        return <SocialMediaMonitor />;
      case 'health':
        return <SystemHealth />;
      default:
        return <AnalystDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-muted/40">
      <aside className="nav-surface nav-surface--analyst text-white w-64 flex flex-col min-h-screen">
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
