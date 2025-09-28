import { Award, Users, Shield, Camera, Star } from 'lucide-react';

export const badges = [
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
