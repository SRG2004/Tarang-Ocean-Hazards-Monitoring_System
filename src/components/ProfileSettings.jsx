import React from 'react';
import { User } from 'lucide-react';

const ProfileSettings = ({ settings, updateSetting }) => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                        className="input"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                        className="input"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        value={settings.profile.phone}
                        onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className="input"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <input
                        type="text"
                        value={settings.profile.location}
                        onChange={(e) => updateSetting('profile', 'location', e.target.value)}
                        className="input"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <textarea
                    value={settings.profile.bio}
                    onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="input resize-none"
                />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Profile Verification</p>
                        <p className="text-blue-700">
                            Keep your profile information up-to-date to ensure you receive important
                            alerts and can be contacted during emergency situations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
