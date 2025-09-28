import React from 'react';
import { Home, Bell } from 'lucide-react';

const DashboardHeader = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                            <Home className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-semibold text-gray-800">Tarang</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <Bell size={24} className="text-gray-600" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="font-bold text-gray-700">RK</span>
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-gray-800">Ravi Kumar</p>
                                <p className="text-xs text-gray-500">Community Member</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
