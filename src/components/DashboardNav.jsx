import React from 'react';
import { Home, FileText, UserPlus, User } from 'lucide-react';

const DashboardNav = () => {
    return (
        <nav className="flex space-x-8 border-t pt-2">
            <a href="#" className="flex items-center space-x-2 text-blue-600 border-b-2 border-blue-600 py-3 text-sm font-medium">
                <Home size={20} />
                <span>Home</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 py-3 text-sm font-medium">
                <FileText size={20} />
                <span>Report</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 py-3 text-sm font-medium">
                <UserPlus size={20} />
                <span>Volunteer</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 py-3 text-sm font-medium">
                <User size={20} />
                <span>Profile</span>
            </a>
        </nav>
    );
};

export default DashboardNav;
