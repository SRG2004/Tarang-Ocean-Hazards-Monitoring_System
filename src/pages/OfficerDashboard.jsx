import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import '../styles/globals.css';

const OfficerDashboard = () => {
  const { reports, loadReports } = useApp();

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold">Officer Dashboard</h1>
      <p className="text-muted-foreground">Live incidents and resource overview.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold">Current Incidents</h2>
          <div className="mt-4 space-y-4">
            {reports.length > 0 ? (
              reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold">{report.hazardType}</h3>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                  <div className="mt-2 space-x-2">
                    <button className="btn-secondary btn-sm">Acknowledge</button>
                    <button className="btn-danger btn-sm">Escalate</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No incidents to display.</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold">Resource Allocation</h2>
          <p className="mt-4 text-muted-foreground">Summary of available resources would be shown here.</p>
          {/* Placeholder for resource charts or lists */}
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
