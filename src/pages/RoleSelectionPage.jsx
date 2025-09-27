import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const cards = [
  {
    key: 'citizen',
    title: 'Citizen',
    desc: 'Report hazards and stay informed.',
  },
  {
    key: 'official',
    title: 'Official',
    desc: 'Coordinate emergency response and operations.',
  },
  {
    key: 'analyst',
    title: 'Analyst',
    desc: 'Monitor data and analyze events.',
  },
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-muted flex flex-col">
      <header className="px-6 py-8 text-center">
        <h1 className="text-3xl font-semibold">Tarang</h1>
        <p className="text-sm text-slate-600">Ocean Hazards Monitoring</p>
      </header>
      <main className="flex-1 container mx-auto px-6 pb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 place-items-stretch">
        {cards.map(c => (
          <Card
            key={c.key}
            className="card-surface card-hover p-6 flex flex-col justify-between"
            tabIndex={0}
            aria-label={`Select ${c.title} role`}
          >
            <div>
              <div className="h-10 w-10 rounded-full bg-sky-100 mb-4" />
              <h2 className="text-xl font-medium">{c.title}</h2>
              <p className="mt-2 text-slate-600">{c.desc}</p>
            </div>
            <Button className="mt-6" onClick={() => navigate(`/login/${c.key}`)}>
              Continue
            </Button>
          </Card>
        ))}
      </main>
    </div>
  );
}
