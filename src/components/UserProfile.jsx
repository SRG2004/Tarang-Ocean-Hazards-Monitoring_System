    import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'; // Assuming you have an Avatar component
import { AlertCircle, CheckCircle } from 'lucide-react';

export const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/auth/profile');
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }
                const data = await response.json();
                setProfile(data.user);
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

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (profile) {
            setProfile({ ...profile, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profile) return;

        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: profile.fullName,
                    phone: profile.phone,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }

            const result = await response.json();
            setProfile(result.user);
            setSuccess('Profile updated successfully!');

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error && !profile) {
        return <p className="text-red-500">Error: {error}</p>;
    }
    
    if (!profile) {
        return <p>Could not load profile.</p>;
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>View and update your personal information.</CardDescription>
            </CardHeader>
            <CardContent as="form" onSubmit={handleSubmit} className="grid gap-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>{success}</span>
                    </div>
                )}
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${profile.fullName}`} alt={profile.fullName} />
                        <AvatarFallback>{profile.fullName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                     <Button variant="outline" type="button" disabled>Change Picture</Button>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="fullName">Name</Label>
                    <Input id="fullName" name="fullName" value={profile.fullName} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={profile.email} disabled />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleInputChange} />
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? 'Updating...' : 'Update Profile'}
                </Button>
            </CardContent>
        </Card>
    );
};
