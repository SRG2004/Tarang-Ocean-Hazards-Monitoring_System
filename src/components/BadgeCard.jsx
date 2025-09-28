import React from 'react';

const BadgeCard = ({ badge }) => {
    return (
        <div className="card p-6 text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-${badge.color.replace('text-', '')}-100 to-${badge.color.replace('text-', '')}-200 mb-4`}>
                <badge.icon className={`w-8 h-8 ${badge.color}`} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">{badge.title}</h3>
            <p className="text-sm text-text-secondary mb-4">{badge.description}</p>
            {badge.earned ? (
                <span className="badge badge-success">Earned</span>
            ) : (
                <span className="badge badge-secondary">Keep Contributing</span>
            )}
        </div>
    );
};

export default BadgeCard;
