import React, { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, Clock, TrendingUp, Zap, Globe, Filter, List, CheckSquare, AlertTriangle } from 'lucide-react';
import { MinimalHazardMap } from '../MinimalHazardMap'; // Adjusted path
import { SyntheticReportGenerator } from '../SyntheticReportGenerator'; // Adjusted path
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils'; // Assuming you have a utils file for cn

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {trend && <p className="text-xs text-green-500">{trend}</p>}
        </CardContent>
    </Card>
);

const recentReports = [
    { id: 'HZ7461', type: 'Coastal Flooding', severity: 'High', status: 'Verified', time: '15 min ago' },
    { id: 'HZ7460', type: 'Rip Currents', severity: 'Medium', status: 'Pending', time: '45 min ago' },
    { id: 'HZ7459', type: 'Storm Surge', severity: 'Critical', status: 'Verified', time: '1 hr ago' },
    { id: 'HZ7458', type: 'Erosion', severity: 'Low', status: 'Verified', time: '3 hrs ago' },
    { id: 'HZ7457', type: 'Other', severity: 'Medium', status: 'Disregarded', time: '5 hrs ago' },
];

const ReportItem = ({ report }) => (
    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
        <div className="flex items-center space-x-3">
            <div className={cn('w-2.5 h-2.5 rounded-full', {
                'bg-red-500': report.severity === 'Critical',
                'bg-orange-500': report.severity === 'High',
                'bg-yellow-500': report.severity === 'Medium',
                'bg-blue-500': report.severity === 'Low',
            })} />
            <div>
                <p className="font-semibold text-sm">{report.id}: <span className="font-normal">{report.type}</span></p>
                <p className="text-xs text-muted-foreground">{report.time}</p>
            </div>
        </div>
        <Badge variant={{
            'Verified': 'success',
            'Pending': 'outline',
            'Disregarded': 'destructive'
        }[report.status] || 'secondary'}>{report.status}</Badge>
    </div>
);

export const AnalystDashboard = ({ onNavigate }) => {
    // Mock data, in a real app this would come from state/props
    const stats = {
        reportsToday: 134,
        pendingReview: 25,
        avgTimeToVerify: '42min',
        hotspotAlerts: 7
    };

    return (
        <div className="space-y-6 p-4 md:p-6 bg-background text-foreground">
            {/* Analyst Header */}
            <Card className="overflow-hidden">
                <div className="bg-card-gradient p-6">
                    <div className="flex items-center">
                        <div className="bg-primary/10 p-3 rounded-full mr-4">
                            <BarChart3 className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-primary-foreground">Analytics & Insights</h1>
                            <p className="text-primary-foreground/80 mt-1">Analyze hazard data, trends, and generate actionable reports.</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Reports Today" value={stats.reportsToday} icon={FileText} trend="+15% from yesterday" />
                <StatCard title="Pending Review" value={stats.pendingReview} icon={List} />
                <StatCard title="Avg. Time to Verify" value={stats.avgTimeToVerify} icon={Clock} />
                <StatCard title="Active Hotspot Alerts" value={stats.hotspotAlerts} icon={AlertTriangle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Reports Queue */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Reports Queue</CardTitle>
                        <CardDescription>Incoming reports requiring analysis and verification.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentReports.map(report => <ReportItem key={report.id} report={report} />)}
                    </CardContent>
                </Card>

                {/* Quick Tools */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Tools</CardTitle>
                        <CardDescription>Analyst actions at your fingertips.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                        <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter Data</Button>
                        <Button variant="outline"><List className="w-4 h-4 mr-2" /> Manage Lists</Button>
                        <Button variant="outline"><CheckSquare className="w-4 h-4 mr-2" /> Bulk Verify</Button>
                        <Button variant="outline"><TrendingUp className="w-4 h-4 mr-2" /> Trend Analysis</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Real-time Hazard Map */}
            <Card>
                <CardHeader>
                    <CardTitle>Real-time Hazard Map</CardTitle>
                    <CardDescription>Geospatial distribution of all active and pending hazard reports.</CardDescription>
                </CardHeader>
                <CardContent className="h-[450px] p-0">
                    <MinimalHazardMap height="100%" />
                </CardContent>
            </Card>

            {/* Synthetic Report Generator */}
            <Card>
                <CardHeader>
                    <CardTitle>Synthetic Report Generator</CardTitle>
                    <CardDescription>For testing system resilience and training purposes. Use with caution.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SyntheticReportGenerator />
                </CardContent>
            </Card>
        </div>
    );
}
