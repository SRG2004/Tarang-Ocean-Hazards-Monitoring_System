import React from 'react';
import { Bell, Mail, Phone, Smartphone } from 'lucide-react';

const NotificationSettings = ({ settings, updateSetting }) => {
    const alertMethods = [
        { key: 'email', label: 'Email Notifications', desc: 'Receive alerts via email', icon: Mail, color: 'text-blue-500' },
        { key: 'sms', label: 'SMS Alerts', desc: 'Critical alerts via SMS', icon: Phone, color: 'text-green-500' },
        { key: 'push', label: 'Push Notifications', desc: 'Real-time app notifications', icon: Smartphone, color: 'text-purple-500' }
    ];

    const alertTypes = [
        { key: 'criticalAlerts', label: 'Critical Hazard Alerts', desc: 'Immediate danger notifications', required: true },
        { key: 'weeklyReports', label: 'Weekly Summary Reports', desc: 'Weekly hazard activity summary' },
        { key: 'socialMediaMentions', label: 'Social Media Monitoring', desc: 'Relevant social media alerts' },
        { key: 'volunteerOpportunities', label: 'Volunteer Opportunities', desc: 'New volunteer opportunities in your area' }
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
            </div>

            <div className="space-y-6">
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Methods</h3>
                    <div className="space-y-4">
                        {alertMethods.map(method => {
                            const Icon = method.icon;
                            return (
                                <div key={method.key} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Icon className={`w-5 h-5 ${method.color}`} />
                                        <div>
                                            <p className="font-medium text-gray-900">{method.label}</p>
                                            <p className="text-sm text-gray-500">{method.desc}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications[method.key]}
                                            onChange={(e) => updateSetting('notifications', method.key, e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Types</h3>
                    <div className="space-y-4">
                        {alertTypes.map(item => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <p className="font-medium text-gray-900">{item.label}</p>
                                        {item.required && (
                                            <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                                                Required
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications[item.key]}
                                        onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                                        disabled={item.required}
                                        className="sr-only peer"
                                    />
                                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${item.required ? 'opacity-50' : ''}`}></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
