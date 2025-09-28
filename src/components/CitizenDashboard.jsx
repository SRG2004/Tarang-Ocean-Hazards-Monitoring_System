import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardNav from './DashboardNav';
import DashboardStats from './DashboardStats';
import QuickActions from './QuickActions';
import AreaMap from './AreaMap';
import RecentAlerts from './RecentAlerts';

const CitizenDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardNav />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats />
        <QuickActions />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AreaMap />
          <RecentAlerts />
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;
