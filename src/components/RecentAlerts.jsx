import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const RecentAlerts = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <p className="text-sm text-gray-500">Ocean safety updates</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-yellow-500">High Waves</h4>
                            <p className="text-sm text-gray-500">Chennai, Marina Beach</p>
                        </div>
                        <Button variant="ghost" size="sm">Details</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentAlerts;
