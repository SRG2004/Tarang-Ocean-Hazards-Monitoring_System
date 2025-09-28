import React from 'react';

const ProgressOverview = () => {
    return (
        <div className="card mt-8 p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Progress Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                    <p className="text-2xl font-bold text-text-primary">4</p>
                    <p className="text-sm text-text-secondary">Badges Earned</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-text-primary">12</p>
                    <p className="text-sm text-text-secondary">Reports Submitted</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-text-primary">85%</p>
                    <p className="text-sm text-text-secondary">Contribution Score</p>
                </div>
            </div>
        </div>
    );
};

export default ProgressOverview;
