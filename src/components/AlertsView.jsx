import React, { useState, useEffect } from 'react';
import AlertCard from './AlertCard';

export const AlertsView = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                // Fetch active and urgent alerts
                const response = await fetch('/api/hazards?status=active&status=urgent');
                if (!response.ok) {
                    throw new Error('Failed to fetch alerts');
                }
                const data = await response.json();
                setAlerts(data.reports);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    if (loading) {
        return <div className="p-6"><h2>Alerts</h2><p>Loading alerts...</p></div>;
    }

    if (error) {
        return <div className="p-6"><h2>Alerts</h2><p className="text-red-500">Error: {error}</p></div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Active Alerts</h2>
            {alerts.length === 0 ? (
                <p>No new alerts.</p>
            ) : (
                <div className="grid gap-4">
                    {alerts.map(alert => (
                        <AlertCard key={alert.id} alert={alert} />
                    ))}
                </div>
            )}
        </div>
    );
};
