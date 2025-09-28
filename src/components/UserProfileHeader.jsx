import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { CardTitle, CardDescription } from './ui/card';
import { Edit } from 'lucide-react';

const UserProfileHeader = ({ isEditing, handleEditToggle, user, getInitials }) => {
    return (
        <div className="flex flex-col md:flex-row items-start justify-between">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/50">
                    <AvatarImage src={user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.displayName}`} alt={user.displayName} />
                    <AvatarFallback>{getInitials(user.displayName || 'User')}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl">{isEditing ? 'Edit Profile' : user.displayName}</CardTitle>
                    <CardDescription>View and manage your personal details.</CardDescription>
                </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleEditToggle} className="mt-4 md:mt-0">
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
        </div>
    );
};

export default UserProfileHeader;
