import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, PlusCircle, Bell } from 'lucide-react';

const DashboardStats = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">My Reports</CardTitle>
                    <FileText size={20} className="text-gray-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">23</div>
                    <p className="text-xs text-gray-500">Total submitted</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Verified</CardTitle>
                    <PlusCircle size={20} className="text-gray-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">19</div>
                    <p className="text-xs text-gray-500">Reports confirmed</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Alerts</CardTitle>
                    <Bell size={20} className="text-gray-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-gray-500">Received this month</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardStats;
