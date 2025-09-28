import React from 'react';
import { Waves } from 'lucide-react';
import { Card } from './ui/card';

const WelcomeHeader = () => (
    <Card className="overflow-hidden">
        <div className="bg-card-gradient p-6">
            <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Waves className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-primary-foreground">Citizen Dashboard</h1>
                    <p className="text-primary-foreground/80 mt-1">Your hub for community safety and hazard reporting.</p>
                </div>
            </div>
        </div>
    </Card>
);

export default WelcomeHeader;