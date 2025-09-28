import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

const LocalSafetyInfo = ({ nearbyAlerts, recentActivity }) => (
    <Card className="lg:col-span-2">
        <CardHeader>
            <CardTitle>Local Safety Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {nearbyAlerts.length > 0 && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-3"/>
                        <div>
                            <p className="font-bold">Nearby Hazard Alert</p>
                            <p className="text-sm">{nearbyAlerts.map(a => a.title).join(", ")}</p>
                        </div>
                    </div>
                </div>
            )}
            <div>
                <h4 className="font-semibold mb-2">Recent Activity</h4>
                <div className="space-y-2">
                    {recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                            <p className="text-sm text-foreground">{activity.description}</p>
                            <Badge variant="outline">{activity.time}</Badge>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
    </Card>
);

export default LocalSafetyInfo;
