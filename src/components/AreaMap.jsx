import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const AreaMap = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Area</CardTitle>
                <p className="text-sm text-gray-500">Ocean conditions near you</p>
            </CardHeader>
            <CardContent>
                {/* Map placeholder */}
                <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Map will be here</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default AreaMap;
