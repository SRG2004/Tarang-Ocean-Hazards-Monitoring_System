import React from 'react';
import { Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

const EmergencyContacts = () => {
    const emergencyContacts = [
        { name: 'Coast Guard', number: '1554', available: '24/7' },
        { name: 'Disaster Helpline', number: '108', available: '24/7' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {emergencyContacts.map(contact => (
                     <div key={contact.name} className="flex items-center justify-between p-3 bg-red-50 text-red-900 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5" />
                            <div>
                                <p className="font-semibold text-sm">{contact.name}</p>
                                <p className="text-lg font-mono tracking-wider">{contact.number}</p>
                            </div>
                        </div>
                        <Badge variant="destructive" className="bg-red-100 text-red-800">{contact.available}</Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default EmergencyContacts;
