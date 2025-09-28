import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Award, Users, Shield, Camera, Star } from 'lucide-react';
import Navbar from './Navbar';

const badges = [
  {
    id: 1,
    title: 'First Report',
    description: 'Submitted your first hazard report',
    icon: Star,
    color: 'text-yellow-500',
    earned: true
  },
  {
    id: 2,
    title: 'Community Guardian',
    description: 'Contributed to community safety efforts',
    icon: Shield,
    color: 'text-green-500',
    earned: true
  },
  {
    id: 3,
    title: 'Verified Reporter',
    description: 'Multiple reports verified by officials',
    icon: Users,
    color: 'text-blue-500',
    earned: false
  },
  {
    id: 4,
    title: 'Photo Contributor',
    description: 'Uploaded photos with your reports',
    icon: Camera,
    color: 'text-purple-500',
    earned: true
  },
  {
    id: 5,
    title: 'Rapid Responder',
    description: 'Reported hazards within 30 minutes',
    icon: Award,
    color: 'text-orange-500',
    earned: false
  }
];

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
            <div key={badge.id} className="card p-6 text-center">
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
          ))}
        </div>

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
      </main>
    </div>
  );
};

export default Badges;
