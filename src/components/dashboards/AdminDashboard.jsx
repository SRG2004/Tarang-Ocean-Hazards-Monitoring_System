import React, { useState, useEffect } from 'react';
import { realTimeHazardService } from '../../services/realTimeHazardService.js';
import { MinimalHazardMap } from '../MinimalHazardMap';
import { 
  Settings, Users, Shield, BarChart3, Activity, Database, Server, 
  AlertTriangle, CheckCircle, Clock, TrendingUp, UserCheck, UserX, 
  HardDrive, Wifi, Lock, Eye, Download, Upload, RefreshCw, Power
} from 'lucide-react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';

const StatCard = ({ title, value, icon: Icon, trend, trendColor, description }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {trend && <p className={cn("text-xs", trendColor)}>{trend}</p>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

const HealthStatus = ({ service, status }) => {
    const isHealthy = status === 'healthy';
    return (
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center space-x-3">
                <div className={cn("w-2 h-2 rounded-full", isHealthy ? 'bg-green-500' : 'bg-red-500')} />
                <span className="text-sm font-medium text-foreground">{service}</span>
            </div>
            <Badge variant={isHealthy ? 'success' : 'destructive'}>{isHealthy ? 'Operational' : 'Issues'}</Badge>
        </div>
    );
};

export const AdminDashboard = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [lastUpdate, setLastUpdate] = useState('');
  const [systemHealth, setSystemHealth] = useState({
    api: 'healthy',
    database: 'healthy', 
    storage: 'healthy',
    monitoring: 'healthy'
  });

  useEffect(() => {
    const unsubscribe = realTimeHazardService.subscribe((newReports, hotspots) => {
      setReports(newReports);
      setStatistics(realTimeHazardService.getStatistics());
      setLastUpdate(new Date().toLocaleTimeString());
    });
    return unsubscribe;
  }, []);

  const userStatistics = {
    total: 15847,
    active: 12456,
    new_today: 23,
    citizens: 14230,
    officials: 1245,
    analysts: 287,
    admins: 85
  };

  const systemMetrics = {
    uptime: '99.97%',
    response_time: '145ms',
    cpu_usage: '23%',
    memory_usage: '67%',
    storage_usage: '34%',
    daily_requests: '2.4M'
  };

  const securityAlerts = [
    { time: '10 min ago', event: 'Multiple failed login attempts detected', severity: 'medium', action: 'Auto-blocked IP for 1 hour' },
    { time: '2 hours ago', event: 'Unusual API request pattern from citizen app', severity: 'low', action: 'Monitoring increased' },
    { time: '1 day ago', event: 'Database backup completed', severity: 'info', action: 'Routine maintenance' },
  ];

  const handleSystemAction = (action) => console.log(`Executing system action: ${action}`);

  return (
    <div className="space-y-6 p-4 md:p-6 bg-background text-foreground">
      {/* Admin Header */}
      <Card className="overflow-hidden">
        <div className="bg-card-gradient p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary-foreground">System Administration</h1>
                <p className="text-primary-foreground/80 mt-1">Comprehensive oversight of the Taranga platform.</p>
              </div>
              <div className="text-right">
                  <Badge variant="secondary" className="mb-1">Super Administrator</Badge>
                  <div className="text-sm text-primary-foreground/90">{user?.name || 'Admin User'}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 text-sm text-primary-foreground/80">
                <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-green-300" /><span>All Systems Operational</span></div>
                <span>•</span>
                <div>Last health check: <span className="font-semibold text-primary-foreground/90">{lastUpdate || 'Just now'}</span></div>
            </div>
        </div>
      </Card>

      {/* Key System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="System Uptime" value={systemMetrics.uptime} icon={Server} description="Last 30 days" />
        <StatCard title="Active Users" value={userStatistics.active.toLocaleString()} icon={Users} trend={`+${userStatistics.new_today} today`} trendColor="text-green-500" />
        <StatCard title="API Response Time" value={systemMetrics.response_time} icon={Clock} description="Average" />
        <StatCard title="Daily Requests" value={systemMetrics.daily_requests} icon={BarChart3} trend="+8% vs yesterday" trendColor="text-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>User Management</span>
                <Users className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>Manage user roles and access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              {[{label: 'Citizens', value: userStatistics.citizens}, {label: 'Officials', value: userStatistics.officials}, {label: 'Analysts', value: userStatistics.analysts}, {label: 'Admins', value: userStatistics.admins}].map(role => (
                <div key={role.label} className="bg-secondary/50 p-3 rounded-lg">
                    <div className="text-2xl font-bold">{role.value.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{role.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-2">
            <Button><UserCheck className="w-4 h-4 mr-2" /> Approve Users</Button>
            <Button variant="secondary"><UserX className="w-4 h-4 mr-2" /> Review Flags</Button>
          </CardFooter>
        </Card>

        {/* System Health & Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>System Health & Performance</span>
                <Activity className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>Real-time status of core services and resource usage.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Core Services</h4>
              <HealthStatus service="API Services" status={systemHealth.api} />
              <HealthStatus service="Database" status={systemHealth.database} />
              <HealthStatus service="Storage" status={systemHealth.storage} />
              <HealthStatus service="Monitoring" status={systemHealth.monitoring} />
            </div>
            <div className="space-y-4">
                <h4 className="font-semibold text-sm">Resource Usage</h4>
                <div>
                    <div className="flex justify-between mb-1 text-sm"><span className="text-muted-foreground">CPU Usage</span><span className="font-semibold">{systemMetrics.cpu_usage}</span></div>
                    <Progress value={parseInt(systemMetrics.cpu_usage)} />
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-sm"><span className="text-muted-foreground">Memory Usage</span><span className="font-semibold">{systemMetrics.memory_usage}</span></div>
                    <Progress value={parseInt(systemMetrics.memory_usage)} />
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-sm"><span className="text-muted-foreground">Storage Usage</span><span className="font-semibold">{systemMetrics.storage_usage}</span></div>
                    <Progress value={parseInt(systemMetrics.storage_usage)} />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => handleSystemAction('backup')}><Download className="w-4 h-4 mr-2" /> Backup</Button>
            <Button variant="secondary" onClick={() => handleSystemAction('update')}><RefreshCw className="w-4 h-4 mr-2" /> Update</Button>
            <Button variant="secondary" onClick={() => handleSystemAction('logs')}><Eye className="w-4 h-4 mr-2" /> View Logs</Button>
            <Button variant="destructive" onClick={() => handleSystemAction('maintenance')}><Power className="w-4 h-4 mr-2" /> Maint. Mode</Button>
          </CardContent>
        </Card>
        
        {/* Security Monitoring */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>Security Alerts</span>
                <Button variant="secondary" size="sm"><Shield className="w-4 h-4 mr-2" />Security Center</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {securityAlerts.map((alert, i) => (
              <div key={i} className="flex items-start justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                      <AlertTriangle className={cn("w-5 h-5 mt-0.5", {
                          'text-yellow-500': alert.severity === 'medium',
                          'text-blue-500': alert.severity === 'low',
                          'text-green-500': alert.severity === 'info',
                      })} />
                      <div>
                          <p className="font-medium text-sm">{alert.event}</p>
                          <p className="text-xs text-muted-foreground">{alert.action}</p>
                      </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Overview Map */}
      <Card>
        <CardHeader>
          <CardTitle>System Coverage Map</CardTitle>
          <CardDescription>Real-time visualization of system infrastructure and usage hotspots.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] p-0">
          <MinimalHazardMap height="100%" showControls={true} />
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">Infrastructure View</Button>
            <Button variant="outline">Usage Analytics</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
