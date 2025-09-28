import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Alert, AlertDescription } from './ui/alert';
import UserProfileHeader from './UserProfileHeader';
import UserProfileDetails from './UserProfileDetails';
import UserProfileForm from './UserProfileForm';

export const UserProfile = () => {
    const { user, setUser } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.displayName || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setFormData({ fullName: user.displayName, phone: user.phone });
        }
        setIsEditing(!isEditing);
        setFeedback({ message: '', type: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFeedback({ message: '', type: '' });

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUser(prevUser => ({ ...prevUser, ...formData, displayName: formData.fullName }));

            setFeedback({ message: 'Profile updated successfully!', type: 'success' });
            setIsEditing(false);
        } catch (err) {
            setFeedback({ message: 'Failed to update profile. Please try again.', type: 'error' });
            console.error('Update profile error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader><CardTitle>Loading...</CardTitle></CardHeader>
                <CardContent><p>Loading user profile. Please wait.</p></CardContent>
            </Card>
        );
    }

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <UserProfileHeader 
                    isEditing={isEditing} 
                    handleEditToggle={handleEditToggle} 
                    user={user} 
                    getInitials={getInitials} 
                />
            </CardHeader>
            <CardContent className="space-y-6">
                {feedback.message && (
                    <Alert variant={feedback.type === 'error' ? 'destructive' : 'success'}>
                        {feedback.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        <AlertDescription>{feedback.message}</AlertDescription>
                    </Alert>
                )}

                {isEditing ? (
                    <UserProfileForm 
                        formData={formData} 
                        handleInputChange={handleInputChange} 
                        submitting={submitting} 
                        handleSubmit={handleSubmit} 
                    />
                ) : (
                    <UserProfileDetails user={user} />
                )}
            </CardContent>
        </Card>
    );
};
