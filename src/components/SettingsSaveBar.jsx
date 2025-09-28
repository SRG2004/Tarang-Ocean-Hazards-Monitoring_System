import React from 'react';
import { Save, CheckCircle } from 'lucide-react';

const SettingsSaveBar = ({ handleSave, isSaving, saveStatus }) => {
    return (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
            <div className="flex items-center space-x-2">
                {saveStatus === 'success' && (
                    <div className="flex items-center space-x-2 text-green-600 animate-fade-in-scale">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Settings saved successfully</span>
                    </div>
                )}
            </div>
            
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center space-x-2"
            >
                {isSaving && <div className="loading" />}
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
        </div>
    );
};

export default SettingsSaveBar;
