import React from 'react';
import { HazardMap } from './HazardMap';
import { ReportManager } from './ReportManager';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const OfficialDashboard = () => {
  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Live Hazard Map</CardTitle>
            </CardHeader>
            <CardContent>
                <HazardMap />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Manage Hazard Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <ReportManager />
            </CardContent>
        </Card>
    </div>
  );
};
