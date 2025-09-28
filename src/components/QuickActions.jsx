import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { FileText, UserPlus } from 'lucide-react';

const QuickActions = () => {
    return (
        <Card className="mb-8">
            <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
                <p className="text-sm text-gray-500 mb-4">What would you like to do?</p>
                <div className="flex space-x-4">
                    <Button className="bg-gray-800 text-white hover:bg-gray-700">
                        <FileText size={16} className="mr-2" />
                        Report Ocean Hazard
                    </Button>
                    <Button variant="outline">
                        <UserPlus size={16} className="mr-2" />
                        Join Volunteer Network
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickActions;
