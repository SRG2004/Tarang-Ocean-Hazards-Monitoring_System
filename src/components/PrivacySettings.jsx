import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

const PrivacySettings = ({ settings, updateSetting }) => {
    const privacyOptions = [
        { key: 'profileVisible', label: 'Public Profile', desc: 'Make your profile visible to other users' },
        { key: 'locationSharing', label: 'Location Sharing', desc: 'Share your location for better emergency response' },
        { key: 'dataAnalytics', label: 'Usage Analytics', desc: 'Help improve the platform with anonymous usage data' },
        { key: 'thirdPartySharing', label: 'Third-party Data Sharing', desc: 'Share anonymized data with research partners' }
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold">Privacy & Security</h2>
            </div>

            <div className="space-y-6">
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Privacy</h3>
                    <div className="space-y-4">
                        {privacyOptions.map(item => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{item.label}</p>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.privacy[item.key]}
                                        onChange={(e) => updateSetting('privacy', item.key, e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                            <p className="font-semibold mb-1">Important Security Notice</p>
                            <p className="text-amber-700">
                                Your safety is our priority. Location sharing is recommended for faster
                                emergency response, but you maintain full control over your privacy settings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;
