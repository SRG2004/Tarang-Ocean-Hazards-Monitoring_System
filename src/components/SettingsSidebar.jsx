import React from 'react';
import { User, Bell, Shield, Settings as SettingsIcon } from 'lucide-react';

const SettingsSidebar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield },
        { id: 'preferences', label: 'Preferences', icon: SettingsIcon }
    ];

    return (
        <div className="lg:col-span-1">
            <div className="card space-y-1">
                {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left ${
                                activeTab === tab.id
                                    ? 'bg-blue-50 border border-blue-200 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <IconComponent className="w-5 h-5" />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SettingsSidebar;
