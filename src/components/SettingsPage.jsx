import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import SettingsSidebar from './SettingsSidebar';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import PrivacySettings from './PrivacySettings';
import PreferencesSettings from './PreferencesSettings';
import SettingsSaveBar from './SettingsSaveBar';

export const SettingsPage = ({ user }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [settings, setSettings] = useState({
        profile: {
            name: user?.name || '',
            email: user?.email || '',
            phone: '',
            location: 'Mumbai, Maharashtra',
            bio: ''
        },
        notifications: {
            email: true,
            sms: true,
            push: true,
            criticalAlerts: true,
            weeklyReports: false,
            socialMediaMentions: true,
            volunteerOpportunities: false
        },
        privacy: {
            profileVisible: true,
            locationSharing: false,
            dataAnalytics: true,
            thirdPartySharing: false
        },
        preferences: {
            theme: 'light',
            language: 'en',
            mapProvider: 'leaflet',
            defaultView: 'dashboard',
            alertRadius: '50'
        }
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle');

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        
        // Simulate API call
        setTimeout(() => {
            setSaveStatus('success');
            setIsSaving(false);
            setTimeout(() => setSaveStatus('idle'), 3000);
        }, 1500);
    };

    const updateSetting = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings settings={settings} updateSetting={updateSetting} />;
            case 'notifications':
                return <NotificationSettings settings={settings} updateSetting={updateSetting} />;
            case 'privacy':
                return <PrivacySettings settings={settings} updateSetting={updateSetting} />;
            case 'preferences':
                return <PreferencesSettings settings={settings} updateSetting={updateSetting} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <DashboardHeader 
                title="Settings"
                subtitle="Manage your account and preferences"
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="lg:col-span-3">
                    <div className="card-feature">
                        {renderContent()}
                        <SettingsSaveBar 
                            handleSave={handleSave} 
                            isSaving={isSaving} 
                            saveStatus={saveStatus} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
