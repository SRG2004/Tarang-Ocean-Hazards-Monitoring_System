import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, Clock } from 'lucide-react';

const AlertCard = ({ alert }) => {
    const severityColor = alert.severity === 'critical' ? 'text-red-500' : (alert.severity === 'high' ? 'text-orange-500' : 'text-yellow-500');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className={`h-6 w-6 ${severityColor}`} />
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
    );
};

export default AlertCard;
