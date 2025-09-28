import React, { useState, useEffect } from 'react';
import { realTimeHazardService } from '../../services/realTimeHazardService.js';
import { notificationService } from '../../services/notificationService.js';
import { MinimalHazardMap } from '../MinimalHazardMap';
import { 
  AlertTriangle, CheckCircle, Clock, Users, MapPin, Phone, FileText, 
  Activity, Shield, Radio, Truck, Send, Siren, Building
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';

const StatCard = ({ title, value, icon: Icon, description }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

const ResourceStatusItem = ({ name, available, deployed, status }) => (
    <div className="p-3 bg-secondary/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-foreground">{name}</h4>
            <Badge variant={status === 'operational' ? 'success' : 'outline'}>{status}</Badge>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
            <span className="flex items-center mr-4"><CheckCircle className="w-3 h-3 mr-1 text-green-500" /> {available} Available</span>
            <span className="flex items-center"><Activity className="w-3 h-3 mr-1 text-blue-500" /> {deployed} Deployed</span>
        </div>
        <Progress value={(deployed / (available + deployed)) * 100} className="mt-2 h-1.5" />
    </div>
);

export const OfficialDashboard = ({ user }) => {
  const [statistics, setStatistics] = useState({ active: 0, critical: 0, avgResponse: 'N/A' });
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const processReports = (reports) => {
        const stats = realTimeHazardService.getStatistics(reports);
        setStatistics({ active: stats.active, critical: stats.critical, avgResponse: '15m' });
        const active = (reports || []).filter(r => r.status === 'active' && ['critical', 'high'].includes(r.severity));
        setActiveIncidents(active);
    }
    const { reports } = realTimeHazardService.getCurrentData();
    processReports(reports);
    const unsubscribe = realTimeHazardService.subscribe((newReports) => processReports(newReports));
    return unsubscribe;
  }, []);

  const resourceStatus = [
    { name: 'Coast Guard Vessels', available: 12, deployed: 3, status: 'operational' },
    { name: 'Emergency Teams', available: 8, deployed: 2, status: 'operational' },
    { name: 'Medical Units', available: 15, deployed: 1, status: 'operational' },
    { name: 'Evacuation Centers', available: 25, deployed: 0, status: 'standby' },
  ];

  const handleIncidentAction = (incidentId, action) => console.log(`${action} on incident: ${incidentId}`);

  const handleSendAlert = async () => {
    if (alertMessage.trim() === '' || isSending) return;
    setIsSending(true);
    try {
      await notificationService.sendHazardAlert({
        message: alertMessage,
        severity: 'critical',
        location: user?.district || 'Mumbai Coastal',
      });
      setAlertMessage('');
    } catch (error) {
      console.error('Error sending alert:', error);
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-background text-foreground">
        <Card className="overflow-hidden">
            <div className="bg-card-gradient p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center">
                        <div className="bg-primary/10 p-3 rounded-full mr-4"><Shield className="w-8 h-8 text-primary" /></div>
                        <div>
                            <h1 className="text-3xl font-bold text-primary-foreground">Operations Command</h1>
                            <p className="text-primary-foreground/80 mt-1">Manage incidents, coordinate response, and deploy resources.</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <Badge variant="secondary">Official: {user?.role || 'Lead Officer'}</Badge>
                        <p className="text-sm text-primary-foreground/80 mt-1">{user?.district || 'Mumbai District'}</p>
                    </div>
                </div>
            </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Active Incidents" value={statistics.active} icon={Siren} />
            <StatCard title="Critical Alerts" value={statistics.critical} icon={AlertTriangle} />
            <StatCard title="Resources Deployed" value={resourceStatus.reduce((acc, r) => acc + r.deployed, 0)} icon={Truck} />
            <StatCard title="Avg. Response Time" value={statistics.avgResponse} icon={Clock} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Priority Incidents</CardTitle></CardHeader>
                    <CardContent className="space-y-4 max-h-[450px] overflow-y-auto">
                        {activeIncidents.length > 0 ? activeIncidents.map((incident) => (
                            <Card key={incident.id} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-base mb-1">{incident.title}</CardTitle>
                                        <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-3">
                                            <Badge severity={incident.severity}>{incident.severity}</Badge>
                                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/>{incident.location?.district || 'N/A'}</span>
                                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/>{new Date(incident.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{incident.description}</p>
                                    </div>
                                </div>
                                <CardFooter className="p-0 pt-4 flex justify-end space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => handleIncidentAction(incident.id, 'acknowledge')}>Acknowledge</Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleIncidentAction(incident.id, 'escalate')}>Escalate</Button>
                                    <Button size="sm" onClick={() => handleIncidentAction(incident.id, 'dispatch')}>Dispatch Team</Button>
                                </CardFooter>
                            </Card>
                        )) : <p className="text-muted-foreground text-center py-8">No active incidents requiring attention.</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Broadcast Public Alert</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <Textarea value={alertMessage} onChange={(e) => setAlertMessage(e.target.value)} placeholder="Compose critical alert for public broadcast..."/>
                        <div className="flex justify-end">
                           <Button onClick={handleSendAlert} disabled={isSending || !alertMessage.trim()}>
                                <Send className="w-4 h-4 mr-2" />{isSending ? 'Broadcasting...' : 'Broadcast Alert'}
                           </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Resource Status</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {resourceStatus.map((res, i) => <ResourceStatusItem key={i} {...res} />)}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Team Comms</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full justify-start" variant="outline"><Radio className="w-4 h-4 mr-2 text-green-500"/>Coast Guard HQ</Button>
                        <Button className="w-full justify-start" variant="outline"><Phone className="w-4 h-4 mr-2 text-blue-500"/>Field Team Alpha</Button>
                        <Button className="w-full justify-start" variant="outline"><Building className="w-4 h-4 mr-2 text-gray-500"/>State Control</Button>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Live Operations Map</CardTitle>
                <CardDescription>Geospatial overview of incidents and resource allocation.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] p-0">
                <MinimalHazardMap height="100%" />
            </CardContent>
        </Card>
    </div>
  );
};
