import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, Clock } from 'lucide-react';

export const AlertsView = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                // Fetch active and urgent alerts
                const response = await fetch('/api/hazards?status=active&status=urgent');
                if (!response.ok) {
                    throw new Error('Failed to fetch alerts');
                }
                const data = await response.json();
                setAlerts(data.reports);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    if (loading) {
        return <div className="p-6"><h2>Alerts</h2><p>Loading alerts...</p></div>;
    }

    if (error) {
        return <div className="p-6"><h2>Alerts</h2><p className="text-red-500">Error: {error}</p></div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Active Alerts</h2>
            {alerts.length === 0 ? (
                <p>No new alerts.</p>
            ) : (
                <div className="grid gap-4">
                    {alerts.map(alert => (
                        <Card key={alert.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className={`h-6 w-6 ${alert.severity === 'critical' ? 'text-red-500' : (alert.severity === 'high' ? 'text-orange-500' : 'text-yellow-500')}`} />
                                    {alert.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-4 pt-2">
                                    <Badge variant={alert.status === 'urgent' ? 'destructive' : 'outline'}>{alert.status.toUpperCase()}</Badge>
                                    <span className="capitalize">{alert.type}</span>
                                    <span className="capitalize">{alert.severity}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{alert.timeAgo}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
