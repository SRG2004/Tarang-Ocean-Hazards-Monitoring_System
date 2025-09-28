import React from 'react';
import { Settings as SettingsIcon, Sun, Moon, Globe } from 'lucide-react';

const PreferencesSettings = ({ settings, updateSetting }) => {
    const themes = [
        { value: 'light', label: 'Light', icon: Sun },
        { value: 'dark', label: 'Dark', icon: Moon },
        { value: 'auto', label: 'Auto', icon: Globe }
    ];

    const languages = [
        { value: 'en', label: 'English' },
        { value: 'hi', label: 'हिन्दी (Hindi)' },
        { value: 'bn', label: 'বাংলা (Bengali)' },
        { value: 'te', label: 'తెలుగు (Telugu)' },
        { value: 'ta', label: 'தமிழ் (Tamil)' },
        { value: 'mr', label: 'मराठी (Marathi)' }
    ];

    const mapProviders = [
        { value: 'leaflet', label: 'OpenStreetMap (Leaflet)' },
        { value: 'google', label: 'Google Maps' },
        { value: 'mapbox', label: 'Mapbox' }
    ];

    const defaultViews = [
        { value: 'dashboard', label: 'Overview Dashboard' },
        { value: 'map', label: 'Hazard Map' },
        { value: 'reports', label: 'Recent Reports' }
    ];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-6">
                <SettingsIcon className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold">App Preferences</h2>
            </div>

            <div className="space-y-6">
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
                            <div className="grid grid-cols-3 gap-3">
                                {themes.map(theme => {
                                    const IconComponent = theme.icon;
                                    return (
                                        <button
                                            key={theme.value}
                                            onClick={() => updateSetting('preferences', 'theme', theme.value)}
                                            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                                                settings.preferences.theme === theme.value
                                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                    : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                        >
                                            <IconComponent className="w-6 h-6 mb-2" />
                                            <span className="text-sm font-medium">{theme.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                            <select
                                value={settings.preferences.language}
                                onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                                className="input"
                            >
                                {languages.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Map & Location</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Map Provider</label>
                            <select
                                value={settings.preferences.mapProvider}
                                onChange={(e) => updateSetting('preferences', 'mapProvider', e.target.value)}
                                className="input"
                            >
                                {mapProviders.map(provider => <option key={provider.value} value={provider.value}>{provider.label}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Alert Radius (km)
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={settings.preferences.alertRadius}
                                onChange={(e) => updateSetting('preferences', 'alertRadius', e.target.value)}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>10 km</span>
                                <span className="font-medium">{settings.preferences.alertRadius} km</span>
                                <span>100 km</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Default Dashboard View</label>
                            <select
                                value={settings.preferences.defaultView}
                                onChange={(e) => updateSetting('preferences', 'defaultView', e.target.value)}
                                className="input"
                            >
                                {defaultViews.map(view => <option key={view.value} value={view.value}>{view.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreferencesSettings;
