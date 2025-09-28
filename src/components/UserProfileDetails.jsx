import React from 'react';
import { User, Mail, Phone, Shield } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';

const UserProfileDetails = ({ user }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <p className="flex items-center text-sm p-2 bg-secondary/50 rounded-md min-h-[38px]"><User className="h-4 w-4 mr-2 text-muted-foreground"/>{user.displayName}</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <p className="flex items-center text-sm p-2 bg-secondary/50 rounded-md min-h-[38px]"><Mail className="h-4 w-4 mr-2 text-muted-foreground"/>{user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <p className="flex items-center text-sm p-2 bg-secondary/50 rounded-md min-h-[38px]"><Phone className="h-4 w-4 mr-2 text-muted-foreground"/>{user.phone || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                    <Label>Role</Label>
                    <p className="flex items-center text-sm p-2 bg-secondary/50 rounded-md min-h-[38px]"><Shield className="h-4 w-4 mr-2 text-muted-foreground"/>
                        <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>{user.role || 'Citizen'}</Badge>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserProfileDetails;
