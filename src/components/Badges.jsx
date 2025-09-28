import React from 'react';
import { useApp } from '../contexts/AppContext';
import Navbar from './Navbar';
import BadgeCard from './BadgeCard';
import ProgressOverview from './ProgressOverview';
import { badges } from '../data/badges';

const Badges = () => {
    const { user } = useApp();

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Badges & Achievements</h1>
                    <p className="text-text-secondary">Earn recognition for your contributions to ocean safety</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {badges.map((badge) => (
                        <BadgeCard key={badge.id} badge={badge} />
                    ))}
                </div>

                <ProgressOverview />
            </main>
        </div>
    );
};

export default Badges;
